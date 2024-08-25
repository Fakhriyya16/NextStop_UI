import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';
import '../../assets/css/Account.css';

const API_URL = 'https://localhost:7264/api/admin/Account';

const Account = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/notauthorized'); 
      return;
    }

    const decodedToken = jwtDecode(token);

    if (!decodedToken.role.includes('Admin')) {
      navigate('/notauthorized'); 
      return;
    }

    fetchUsers();
  }, [currentPage, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/GetPaginatedUsers`, {
        params: {
          currentPage,
          pageSize
        },
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setUsers(data.data);
      setTotalCount(data.totalCount);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch users: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      console.log(token);
  
      await axios.delete(`${API_URL}/DeleteAccount`, {
        params: {
          userId
        },
        headers: { Authorization: `Bearer ${token}` }
      });
  
      Swal.fire({
        title: 'Deleted!',
        text: 'User has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchUsers();
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete user: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleRoleChange = async (userId, role, action) => {
    try {
      const token = sessionStorage.getItem('token'); 
      if (!token) {
        throw new Error('No token found');
      }
  
      const url = action === 'add'
        ? `${API_URL}/AddRoleToUser?userId=${encodeURIComponent(userId)}&role=${encodeURIComponent(role)}`
        : `${API_URL}/RemoveRoleFromUser?userId=${encodeURIComponent(userId)}&role=${encodeURIComponent(role)}`;
  
      await axios.post(url, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      Swal.fire({
        title: 'Success!',
        text: `Role has been ${action === 'add' ? 'added' : 'removed'}.`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchUsers();
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to update role: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container className="a-a-container">
      <Row>
        <Col>
          <h1 className="a-a-heading">Users</h1>
          <Table striped className="a-a-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="a-a-loading">Loading...</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles.join(', ')}</td>
                    <td className="a-a-actions">
                      <Button 
                        color="danger" 
                        className="a-a-button" 
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                      <Button 
                        color="primary" 
                        className="a-a-button" 
                        onClick={() => handleRoleChange(user.id, 'Admin', 'add')}
                        disabled={user.roles.includes('Admin')}
                      >
                        Add Admin
                      </Button>
                      <Button 
                        color="warning" 
                        className="a-a-button" 
                        onClick={() => handleRoleChange(user.id, 'Admin', 'remove')}
                        disabled={!user.roles.includes('Admin')}
                      >
                        Remove Admin
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <Pagination className="a-a-pagination">
            <PaginationItem className="a-a-pagination-item" disabled={currentPage === 1}>
              <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
            {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, index) => (
              <PaginationItem key={index + 1} className="a-a-pagination-item" active={index + 1 === currentPage}>
                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="a-a-pagination-item" disabled={currentPage === Math.ceil(totalCount / pageSize)}>
              <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
