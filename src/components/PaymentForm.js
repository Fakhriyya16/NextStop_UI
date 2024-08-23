import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../assets/styles/PaymentForm.css'; 

const stripePromise = loadStripe('pk_test_51PifDjCEo43jsxZOTV1z9V0Fezms2gXxfMTt17WDg9SdyAy2fSWOXJFIFLeWyzDgihy79iGEiI18gZNDgmMoT5QR00iYphSqnT');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return; 

    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error('Payment error:', error);
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
      console.log(response);
      const { clientSecret } = response.data;

      console.log(clientSecret);

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
      } else {
        alert('Payment successful!');
      }
    } catch (err) {
      console.error('Payment intent error:', err);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button type="submit" className="pay-button" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;
