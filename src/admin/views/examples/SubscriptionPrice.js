import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import '../../assets/css/SubscriptionPrice.css'; 

const API_URL = 'https://localhost:7264/api/admin/pricing';

const SubscriptionPrice = () => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchCurrentPrice();
  }, []);

  const fetchCurrentPrice = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/GetCurrentPrice`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCurrentPrice(data.monthlyPrice);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch current price: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlePriceUpdate = async () => {
    if (newPrice === '' || isNaN(newPrice) || newPrice < 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid positive price.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
        await axios.post(`${API_URL}/UpdatePrice`, 
            { newPrice: parseFloat(newPrice) }, 
            {
              headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
      Swal.fire({
        title: 'Success!',
        text: 'Price updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        fetchCurrentPrice();
        setNewPrice('');
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to update price: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Container className="p--container">
      <h1 className="p--heading">Pricing Management</h1>

      <div className="p--current-price">
        <h2>Current Price: {currentPrice}$</h2>
      </div>

      <Form inline className="p--form">
        <FormGroup>
          <Label for="newPrice" className="mr-sm-2">New Price</Label>
          <Input
            type="number"
            id="newPrice"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Enter new price"
            className="mr-sm-2"
            required
          />
        </FormGroup>
        <Button color="primary" onClick={handlePriceUpdate}>Update Price</Button>
      </Form>
    </Container>
  );
};

export default SubscriptionPrice;
