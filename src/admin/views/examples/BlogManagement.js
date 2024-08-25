import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
import '../../assets/css/BlogManagement.css';

const API_URL = 'https://localhost:7264/api/admin/Blog';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
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

    fetchBlogs();
  }, [currentPage, pageSize]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/GetPaginatedBlogs`, {
        params: {
          currentPage,
          pageSize
        },
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setBlogs(data.data);
      setTotalCount(data.totalCount);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch blogs: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`${API_URL}/Delete`, {
        params: {
          id: blogId
        },
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      Swal.fire({
        title: 'Deleted!',
        text: 'Blog has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchBlogs();
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete blog: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container className="b-b-container">
      <Row>
        <Col>
          <h1 className="b-b-heading">Blogs</h1>
          <Table striped className="b-b-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="b-b-loading">Loading...</td>
                </tr>
              ) : (
                blogs.map(blog => (
                  <tr key={blog.id}>
                    <td>{blog.title}</td>
                    <td>{blog.author}</td>
                    <td className="b-b-actions">
                      <Button 
                        color="danger" 
                        className="b-b-button" 
                        onClick={() => handleDelete(blog.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <Pagination className="b-b-pagination">
            <PaginationItem className="b-b-pagination-item" disabled={currentPage === 1}>
              <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
            {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, index) => (
              <PaginationItem key={index + 1} className="b-b-pagination-item" active={index + 1 === currentPage}>
                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="b-b-pagination-item" disabled={currentPage === Math.ceil(totalCount / pageSize)}>
              <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogManagement;
