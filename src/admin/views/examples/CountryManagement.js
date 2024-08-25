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
import '../../assets/css/CountryManagement.css'; 

const API_URL = 'https://localhost:7264/api/admin/Country';

const CountryManagement = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCountry, setEditingCountry] = useState(null);
  const [newCountry, setNewCountry] = useState({ name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/notauthorized');
      return;
    }

    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/GetAll`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCountries(data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch countries: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCountry.name) {
      Swal.fire({
        title: 'Error!',
        text: 'Name is required for creating a country.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.post(`${API_URL}/Create`, { name: newCountry.name }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      Swal.fire({
        title: 'Success!',
        text: 'Country created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCountries();
        setNewCountry({ name: '' });
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to create country: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleEdit = async () => {
    if (!editingCountry.name) {
      Swal.fire({
        title: 'Error!',
        text: 'Name is required for editing a country.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.put(`${API_URL}/Edit`, { name: editingCountry.name }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params:{
            id: editingCountry.id
        }
      });
      Swal.fire({
        title: 'Success!',
        text: 'Country edited successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCountries();
        setEditingCountry(null);
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to edit country: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDelete = async (countryId) => {
    try {
      await axios.delete(`${API_URL}/Delete`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params : {id: countryId}
      });
      Swal.fire({
        title: 'Deleted!',
        text: 'Country has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCountries();
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete country: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Container className="c-o-container">
      <Row>
        <Col>
          <h1 className="c-o-heading">Countries</h1>
          <Form inline className="c-o-form">
            <FormGroup>
              <Label for="newCountryName" className="mr-sm-2">Name</Label>
              <Input
                type="text"
                id="newCountryName"
                value={newCountry.name}
                onChange={(e) => setNewCountry({ name: e.target.value })}
                placeholder="Country Name"
                className="mr-sm-2"
                required
              />
            </FormGroup>
            <Button color="primary" onClick={handleCreate}>Create</Button>
          </Form>
          {editingCountry && (
            <Form inline className="c-o-form mt-4">
              <FormGroup>
                <Label for="editCountryName" className="mr-sm-2">Name</Label>
                <Input
                  type="text"
                  id="editCountryName"
                  value={editingCountry.name}
                  onChange={(e) => setEditingCountry({ ...editingCountry, name: e.target.value })}
                  placeholder="Country Name"
                  className="mr-sm-2"
                  required
                />
              </FormGroup>
              <Button color="success" onClick={handleEdit}>Save</Button>
              <Button color="secondary" onClick={() => setEditingCountry(null)}>Cancel</Button>
            </Form>
          )}
          <Table striped className="c-o-table mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="c-o-loading">Loading...</td>
                </tr>
              ) : (
                countries.map(country => (
                  <tr key={country.id}>
                    <td>{country.name}</td>
                    <td className="c-o-actions">
                      <Button 
                        color="danger" 
                        className="c-o-button" 
                        onClick={() => handleDelete(country.id)}
                      >
                        Delete
                      </Button>
                      <Button 
                        color="info" 
                        className="c-o-button" 
                        onClick={() => setEditingCountry(country)}
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

export default CountryManagement;
