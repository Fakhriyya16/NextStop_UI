import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import '../../assets/css/TagManagement.css'; 

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState({ name: '' });
  const [editingTag, setEditingTag] = useState({ id: null, name: '' });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data } = await axios.get('https://localhost:7264/api/admin/Tag/GetAll', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTags(data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch tags: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleCreate = async () => {
    if (!newTag.name) {
      Swal.fire({
        title: 'Error!',
        text: 'Tag name is required.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.post('https://localhost:7264/api/admin/Tag/Create', newTag, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire({
        title: 'Success!',
        text: 'Tag created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchTags();
        setNewTag({ name: '' });
        setIsCreateFormVisible(false);
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to create tag: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleEdit = async () => {
    if (!editingTag.name) {
      Swal.fire({
        title: 'Error!',
        text: 'Tag name is required.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.put(`https://localhost:7264/api/admin/Tag/Edit?id=${editingTag.id}`, { name: editingTag.name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire({
        title: 'Success!',
        text: 'Tag edited successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchTags();
        setEditingTag({ id: null, name: '' });
        setIsEditing(false);
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to edit tag: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDelete = async (tagId) => {
    try {
      await axios.delete(`https://localhost:7264/api/admin/Tag/Delete?id=${tagId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire({
        title: 'Deleted!',
        text: 'Tag has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchTags();
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete tag: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Container className="t-m-container">
      <h1 className="t-m-heading">Tag Management</h1>

      <Button
        color="primary"
        onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}
        className="mb-3"
      >
        {isCreateFormVisible ? 'Hide Create Form' : 'Show Create Form'}
      </Button>

      {isCreateFormVisible && (
        <Form inline className="t-m-form">
          <FormGroup>
            <Label for="newTagName" className="mr-sm-2">Name</Label>
            <Input
              type="text"
              id="newTagName"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              placeholder="Tag Name"
              className="mr-sm-2"
              required
            />
          </FormGroup>
          <Button color="primary" onClick={handleCreate}>Create Tag</Button>
        </Form>
      )}

      {isEditing && (
        <Form inline className="t-m-form">
          <FormGroup>
            <Label for="editTagName" className="mr-sm-2">Name</Label>
            <Input
              type="text"
              id="editTagName"
              value={editingTag.name}
              onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
              placeholder="Tag Name"
              className="mr-sm-2"
              required
            />
          </FormGroup>
          <Button color="primary" onClick={handleEdit}>Save Changes</Button>
        </Form>
      )}

      <Table className="t-m-table">
        <thead>
          <tr>
            <th>Tag ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.length > 0 ? (
            tags.map(tag => (
              <tr key={tag.id}>
                <td>{tag.id}</td>
                <td>{tag.name}</td>
                <td>
                  <Button
                    color="warning"
                    onClick={() => {
                      setEditingTag(tag);
                      setIsEditing(true);
                    }}
                    className="mr-2 tm-edit"
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => handleDelete(tag.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No tags available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default TagManagement;
