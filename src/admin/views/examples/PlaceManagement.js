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
  Input,
} from 'reactstrap';
import '../../assets/css/PlaceManagement.css';

const API_URL = 'https://localhost:7264/api/admin/Place';

const PlaceManagement = () => {
  const [cities, setCities] = useState([]);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [pagination, setPagination] = useState({
    data: [],
    hasNext: false,
    hasPrevious: false,
    currentPage: 1,
    pageCount: 0,
    totalCount: 0,
    pageSize: 10,
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlace, setEditingPlace] = useState(null);
  const [newPlace, setNewPlace] = useState({
    name: '',
    cityId: '',
    categoryId: '',
    description: '',
    images: [],
    tagIds: [],
  });
  const [isCreating, setIsCreating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/notauthorized');
      return;
    }

    fetchPlaces();
    fetchCities();
    fetchCategories();
    fetchTags();
  }, []);

  const toggleCreateForm = () => {
    setIsCreateFormVisible(!isCreateFormVisible);
  };

  const fetchPlaces = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/GetAllPaginated`, {
        params: { currentPage: page, pageSize: pagination.pageSize },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(data.data);
      setPagination({
        data: Array.isArray(data.data) ? data.data : [],
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
        currentPage: data.currentPage,
        pageCount: data.pageCount,
        totalCount: data.totalCount,
        pageSize: data.pageSize,
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch places: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchPlaces(page);
  };

  const fetchCities = async () => {
    try {
      const { data } = await axios.get('https://localhost:7264/api/City/GetAllNames', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCities(data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch cities: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('https://localhost:7264/api/Category/GetAllNames', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories(data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch categories: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await axios.get('https://localhost:7264/api/Tag/GetAllNames', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTags(data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch tags: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCreate = async () => {
    if (!newPlace.name || !newPlace.cityId || !newPlace.categoryId || !newPlace.description) {
      Swal.fire({
        title: 'Error!',
        text: 'All fields except images and tags are required for creating a place.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    formData.append('Name', newPlace.name);
    formData.append('CityId', newPlace.cityId);
    formData.append('CategoryId', newPlace.categoryId);
    formData.append('Description', newPlace.description);
    newPlace.images.forEach((image) => formData.append('Images', image));
    newPlace.tagIds.forEach((tagId) => formData.append('TagIds', tagId));

    try {
      await axios.post(`${API_URL}/Create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: 'Success!',
        text: 'Place created successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        fetchPlaces();
        setNewPlace({
          name: '',
          cityId: '',
          categoryId: '',
          description: '',
          images: [],
          tagIds: [],
        });
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to create place: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleEdit = async () => {
    if (!editingPlace.name || !editingPlace.categoryId || !editingPlace.description) {
      Swal.fire({
        title: 'Error!',
        text: 'Name, Category, and Description are required for editing a place.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    formData.append('Name', editingPlace.name);
    formData.append('CategoryId', editingPlace.categoryId);
    formData.append('Description', editingPlace.description);
    if (editingPlace.newImages) {
      editingPlace.newImages.forEach((image) => formData.append('NewImages', image));
    }
    editingPlace.tagIds.forEach((tagId) => formData.append('TagIds', tagId));

    try {
      await axios.put(`${API_URL}/Edit?id=${editingPlace.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: 'Success!',
        text: 'Place edited successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        fetchPlaces();
        setEditingPlace(null);
        setIsCreating(true);
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to edit place: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleDelete = async (placeId) => {
    try {
      await axios.delete(`${API_URL}/Delete`, {
        params: { id: placeId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      Swal.fire({
        title: 'Deleted!',
        text: 'Place has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        fetchPlaces();
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete place: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const cancelEdit = () => {
    setEditingPlace(null);
    setIsCreating(true);
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : description;
  };

  return (
    <Container className="place-mngm-container">
      <Row>
        <Col>
          <h1 className="place-mngm-heading">Places</h1>

          <Button color="primary" onClick={toggleCreateForm} className="mb-3">
            {isCreateFormVisible ? 'Hide Create Form' : 'Show Create Form'}
          </Button>

          {isCreateFormVisible && (
            <Form inline className="place-mngm-form">
              <FormGroup>
                <Label for="newPlaceName" className="mr-sm-2">
                  Name
                </Label>
                <Input
                  type="text"
                  id="newPlaceName"
                  value={newPlace.name}
                  onChange={(e) =>
                    setNewPlace({ ...newPlace, name: e.target.value })
                  }
                  placeholder="Enter place name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="newPlaceCity" className="mr-sm-2">
                  City
                </Label>
                <Input
                  type="select"
                  id="newPlaceCity"
                  value={newPlace.cityId}
                  onChange={(e) =>
                    setNewPlace({ ...newPlace, cityId: e.target.value })
                  }
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="newPlaceCategory" className="mr-sm-2">
                  Category
                </Label>
                <Input
                  type="select"
                  id="newPlaceCategory"
                  value={newPlace.categoryId}
                  onChange={(e) =>
                    setNewPlace({ ...newPlace, categoryId: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="newPlaceDescription" className="mr-sm-2">
                  Description
                </Label>
                <Input
                  type="textarea"
                  id="newPlaceDescription"
                  value={newPlace.description}
                  onChange={(e) =>
                    setNewPlace({ ...newPlace, description: e.target.value })
                  }
                  placeholder="Enter place description"
                />
              </FormGroup>
              <FormGroup>
                <Label for="newPlaceImages" className="mr-sm-2">
                  Images
                </Label>
                <Input
                  type="file"
                  id="newPlaceImages"
                  multiple
                  onChange={(e) =>
                    setNewPlace({
                      ...newPlace,
                      images: Array.from(e.target.files),
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label for="newPlaceTags" className="mr-sm-2">
                  Tags
                </Label>
                <Input
                  type="select"
                  id="newPlaceTags"
                  value={newPlace.tagIds}
                  onChange={(e) =>
                    setNewPlace({
                      ...newPlace,
                      tagIds: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  multiple
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <Button color="success" onClick={handleCreate} className="mr-sm-2">
                Create Place
              </Button>
            </Form>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Table bordered className="place-mngm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Category</th>
                <th>Description</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                pagination.data.map((place) => (
                  <tr key={place.id}>
                    <td>{place.id}</td>
                    <td>{place.name}</td>
                    <td>{place.city}</td>
                    <td>{place.category}</td>
                    <td>{truncateDescription(place.description)}</td>
                    <td>
                      {place.tags && place.tags.length > 0
                        ? place.tags.map((tag, index) => (
                          <div key={index}>{tag}</div>
                        ))
                        : 'No tags'}
                    </td>
                    <td>
                      <Button
                        color="info"
                        onClick={() => {
                          setEditingPlace(place);
                          setIsCreating(false);
                        }}
                        className="mr-sm-2"
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleDelete(place.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <div className="pagination-container">
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevious}
              className='mx-3'
            >
              Previous
            </Button>
            <span>
              Page {pagination.currentPage} of {pagination.pageCount}
            </span>
            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className='mx-3'
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          {editingPlace && (
            <Form inline className="place-mngm-form">
              <FormGroup>
                <Label for="editPlaceName" className="mr-sm-2">
                  Name
                </Label>
                <Input
                  type="text"
                  id="editPlaceName"
                  value={editingPlace.name}
                  onChange={(e) =>
                    setEditingPlace({ ...editingPlace, name: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label for="editPlaceCategory" className="mr-sm-2">
                  Category
                </Label>
                <Input
                  type="select"
                  id="editPlaceCategory"
                  value={editingPlace.categoryId}
                  onChange={(e) =>
                    setEditingPlace({
                      ...editingPlace,
                      categoryId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="editPlaceDescription" className="mr-sm-2">
                  Description
                </Label>
                <Input
                  type="textarea"
                  id="editPlaceDescription"
                  value={editingPlace.description}
                  onChange={(e) =>
                    setEditingPlace({
                      ...editingPlace,
                      description: e.target.value,
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label for="editPlaceImages" className="mr-sm-2">
                  Images
                </Label>
                <Input
                  type="file"
                  id="editPlaceImages"
                  multiple
                  onChange={(e) =>
                    setEditingPlace({
                      ...editingPlace,
                      newImages: Array.from(e.target.files),
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label for="editPlaceTags" className="mr-sm-2">
                  Tags
                </Label>
                <Input
                  type="select"
                  id="editPlaceTags"
                  value={editingPlace.tagIds}
                  onChange={(e) =>
                    setEditingPlace({
                      ...editingPlace,
                      tagIds: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  multiple
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <Button
                color="success"
                onClick={handleEdit}
                className="mr-sm-2"
              >
                Save Changes
              </Button>
              <Button color="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceManagement;
