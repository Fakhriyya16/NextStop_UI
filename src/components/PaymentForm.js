import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import Swal
import '../assets/styles/PaymentForm.css';

const stripePromise = loadStripe('pk_test_51PifDjCEo43jsxZOTV1z9V0Fezms2gXxfMTt17WDg9SdyAy2fSWOXJFIFLeWyzDgihy79iGEiI18gZNDgmMoT5QR00iYphSqnT');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); // Initialize useNavigate
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get('https://localhost:7264/api/Pricing/GetCurrentPrice');
        setPrice(response.data.monthlyPrice);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };

    fetchPrice();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      Swal.fire('Payment error', error.message, 'error');
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axios.post('https://localhost:7264/api/Payment/CreatePaymentIntent', {
        currency: 'usd',
        description: 'Premium Subscription',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const { clientSecret } = response.data;

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        Swal.fire('Payment confirmation error', confirmError.message, 'error');
      } else {
        Swal.fire('Success', 'Payment successful!', 'success');
        navigate('/'); 
      }
    } catch (err) {
      Swal.fire('Payment intent error', err.message, 'error');
    }

    setIsProcessing(false);
  };

  const handleCancel = () => {
    navigate('/'); 
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form example example1">
      <fieldset>
        <div className="row">
          <label htmlFor="card-element">Credit or debit card</label>
          <div className="card-element">
            <CardElement
              options={{
                style: {
                  base: {
                    iconColor: '#c4f0ff',
                    color: '#fff',
                    fontWeight: 500,
                    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                    fontSize: '16px',
                    fontSmoothing: 'antialiased',
                    ':-webkit-autofill': {
                      color: '#fce883',
                    },
                    '::placeholder': {
                      color: '#87BBFD',
                    },
                  },
                  invalid: {
                    iconColor: '#FFC7EE',
                    color: '#FFC7EE',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>
      </fieldset>
      <button type="submit" className="pay-button" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : `Pay Now ${price ? price + '$' : ''}`}
      </button>
      <button type="button" className="cancel-button" onClick={handleCancel} disabled={isProcessing}>
        Cancel
      </button>
    </form>
  );
};

export default PaymentForm;
