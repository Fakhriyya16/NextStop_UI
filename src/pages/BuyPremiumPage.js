import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import '../assets/styles/BuyPremiumPage.css';

const stripePromise = loadStripe('pk_test_51PifDjCEo43jsxZOTV1z9V0Fezms2gXxfMTt17WDg9SdyAy2fSWOXJFIFLeWyzDgihy79iGEiI18gZNDgmMoT5QR00iYphSqnT');

const BuyPremiumPage = () => {
  return (
    <div className="buy-premium-page">
      <h2>Buy Premium Subscription</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default BuyPremiumPage;
