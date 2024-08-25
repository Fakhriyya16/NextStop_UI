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
import '../../assets/css/CityManagement.css';

const API_URL = 'https://localhost:7264/api/admin/City';

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState(null);
  const [newCity, setNewCity] = useState({ name: '', countryName: '', description: '', image: null });
  const [isEditing, setIsEditing] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/notauthorized');
      return;
    }

    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/GetAll`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCities(data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch cities: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCity.name || !newCity.countryName || !newCity.description || !newCity.image) {
      Swal.fire({
        title: 'Error!',
        text: 'All fields are required for creating a city.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formData = new FormData();
    formData.append('Name', newCity.name);
    formData.append('CountryName', newCity.countryName);
    formData.append('Description', newCity.description);
    formData.append('Image', newCity.image);

    try {
      await axios.post(`${API_URL}/Create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire({
        title: 'Success!',
        text: 'City created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCities();
        setNewCity({ name: '', countryName: '', description: '', image: null });
        setIsEditing(false); 
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to create city: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleEdit = async () => {
    if (!editingCity.description) {
      Swal.fire({
        title: 'Error!',
        text: 'Description is required for editing a city.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formData = new FormData();
    formData.append('Name', editingCity.name);
    formData.append('Country', editingCity.country);
    formData.append('Description', editingCity.description);
    if (editingCity.image) {
      formData.append('Image', editingCity.image);
    }

    try {
      await axios.put(`${API_URL}/Edit`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        params: { id: editingCity.id } 
      });
      Swal.fire({
        title: 'Success!',
        text: 'City edited successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCities();
        setEditingCity(null);
        setIsEditing(false); 
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to edit city: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDelete = async (cityId) => {
    try {
      await axios.delete(`${API_URL}/Delete`, {
        params: { id: cityId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire({
        title: 'Deleted!',
        text: 'City has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCities();
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete city: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : description;
  };

  return (
    <Container className="city-admin-container">
      <Row>
        <Col>
          <h1 className="city-admin-heading">Cities</h1>
          {!isEditing && (
            <Form inline className="city-admin-form">
              <FormGroup>
                <Label for="newCityName" className="mr-sm-2">Name</Label>
                <Input
                  type="text"
                  id="newCityName"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  placeholder="City Name"
                  className="mr-sm-2"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="newCityCountry" className="mr-sm-2">Country</Label>
                <Input
                  type="text"
                  id="newCityCountry"
                  value={newCity.countryName}
                  onChange={(e) => setNewCity({ ...newCity, countryName: e.target.value })}
                  placeholder="Country Name"
                  className="mr-sm-2"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="newCityDescription" className="mr-sm-2">Description</Label>
                <Input
                  type="text"
                  id="newCityDescription"
                  value={newCity.description}
                  onChange={(e) => setNewCity({ ...newCity, description: e.target.value })}
                  placeholder="Description"
                  className="mr-sm-2"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="newCityImage" className="mr-sm-2">Image</Label>
                <Input
                  type="file"
                  id="newCityImage"
                  onChange={(e) => setNewCity({ ...newCity, image: e.target.files[0] })}
                  className="mr-sm-2"
                  required
                />
              </FormGroup>
              <Button color="primary" onClick={handleCreate}>Create</Button>
            </Form>
          )}
          {isEditing && editingCity && (
            <Form inline className="city-admin-form mt-4">
              <FormGroup>
                <Label for="editCityName" className="mr-sm-2">Name</Label>
                <Input
                  type="text"
                  id="editCityName"
                  value={editingCity.name}
                  onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                  placeholder="City Name"
                  className="mr-sm-2"
                />
              </FormGroup>
              <FormGroup>
                <Label for="editCityCountry" className="mr-sm-2">Country</Label>
                <Input
                  type="text"
                  id="editCityCountry"
                  value={editingCity.country}
                  onChange={(e) => setEditingCity({ ...editingCity, country: e.target.value })}
                  placeholder="Country Name"
                  className="mr-sm-2"
                />
              </FormGroup>
              <FormGroup>
                <Label for="editCityDescription" className="mr-sm-2">Description</Label>
                <Input
                  type="text"
                  id="editCityDescription"
                  value={editingCity.description}
                  onChange={(e) => setEditingCity({ ...editingCity, description: e.target.value })}
                  placeholder="Description"
                  className="mr-sm-2"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="editCityImage" className="mr-sm-2">Image</Label>
                <Input
                  type="file"
                  id="editCityImage"
                  onChange={(e) => setEditingCity({ ...editingCity, image: e.target.files[0] })}
                  className="mr-sm-2"
                />
              </FormGroup>
              <Button color="success" onClick={handleEdit}>Save</Button>
              <Button color="secondary" onClick={() => { setIsEditing(false); setEditingCity(null); }}>Cancel</Button>
            </Form>
          )}
          <Table striped className="city-admin-table mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="city-admin-loading">Loading...</td>
                </tr>
              ) : (
                cities.map(city => (
                  <tr key={city.id}>
                    <td>{city.name}</td>
                    <td>{city.countryName}</td>
                    <td>{truncateDescription(city.description)}</td>
                    <td className="city-admin-actions">
                      <Button 
                        color="danger" 
                        className="city-admin-button" 
                        onClick={() => handleDelete(city.id)}
                      >
                        Delete
                      </Button>
                      <Button 
                        color="info" 
                        className="city-admin-button" 
                        onClick={() => { 
                          setEditingCity(city); 
                          setIsEditing(true); 
                        }}
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

export default CityManagement;
