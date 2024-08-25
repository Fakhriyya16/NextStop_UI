import React from 'react';
import '../assets/styles/LoadingItinerary.css'; 

const LoadingItinerary = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Itinerary is being generated...</p>
        </div>
    );
};

export default LoadingItinerary;
