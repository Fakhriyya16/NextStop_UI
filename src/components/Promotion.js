import React from 'react';
import '../assets/styles/Promotion.css'; 

const PremiumPromotion = () => {
  return (
    <div className="premium-promotion">
      <div className="premium-content">
        <h2>Plan Your Dream Itinerary</h2>
        <p>Unlock exclusive features with our Premium Plan. Create personalized itineraries tailored to your preferences and enjoy a seamless travel experience.</p>
        <a href='/buypremium' className="mp-button-premium">Upgrade to Premium</a>
      </div>
    </div>
  );
};

export default PremiumPromotion;
