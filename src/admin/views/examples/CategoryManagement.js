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
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import '../../assets/css/CategoryManagement.css';

const API_URL = 'https://localhost:7264/api/admin/Category';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/notauthorized');
      return;
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/GetAll`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCategories(data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch categories: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/Create`, newCategory, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire({
        title: 'Success!',
        text: 'Category created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCategories();
        setNewCategory({ name: '' });
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to create category: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`${API_URL}/Edit`, 
        { name: editingCategory.name },
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { id: editingCategory.id } 
        }
      );
      console.log(editingCategory.name);
      Swal.fire({
        title: 'Success!',
        text: 'Category edited successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCategories();
        setEditingCategory(null);
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to edit category: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/Delete`, {
        params: {
          id: categoryId
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire({
        title: 'Deleted!',
        text: 'Category has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCategories();
        setEditingCategory(null);
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete category: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Container className="c-c-container">
      <Row>
        <Col>
          <h1 className="c-c-heading">Categories</h1>
          <Form inline className="c-c-form">
            <FormGroup>
              <Label for="newCategory" className="mr-sm-2">New Category</Label>
              <Input
                type="text"
                id="newCategory"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
                placeholder="Category Name"
                className="mr-sm-2"
              />
            </FormGroup>
            <Button color="primary" onClick={handleCreate}>Create</Button>
          </Form>
          {editingCategory && (
            <Form inline className="c-c-form">
              <FormGroup>
                <Label for="editCategory" className="mr-sm-2">Edit Category</Label>
                <Input
                  type="text"
                  id="editCategory"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Category Name"
                  className="mr-sm-2 mt-3"
                />
              </FormGroup>
              <Button color="success" onClick={handleEdit}>Save</Button>
              <Button color="secondary" onClick={() => setEditingCategory(null)}>Cancel</Button>
            </Form>
          )}
          <Table striped className="c-c-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="c-c-loading">Loading...</td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td className="c-c-actions">
                      <Button 
                        color="danger" 
                        className="c-c-button" 
                        onClick={() => handleDelete(category.id)}
                      >
                        Delete
                      </Button>
                      <Button 
                        color="info" 
                        className="c-c-button" 
                        onClick={() => setEditingCategory(category)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryManagement;
