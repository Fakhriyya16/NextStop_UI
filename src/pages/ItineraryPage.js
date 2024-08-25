import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../assets/styles/ItineraryPage.css';

const ItineraryPage = () => {
    const { id } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const response = await axios.get(`https://localhost:7264/api/Itinerary/GetById/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setItinerary(response.data);
            } catch (error) {
                console.error('Error fetching itinerary:', error);
                setError('An error occurred while fetching the itinerary. Please try again later.');
            }
        };

        fetchItinerary();
    }, [id]);

    const groupPlacesByCategory = (places) => {
        return places.reduce((acc, place) => {
            if (!acc[place.category]) {
                acc[place.category] = [];
            }
            acc[place.category].push(place);
            return acc;
        }, {});
    };

    if (error) {
        return <div className="id-error-message">{error}</div>;
    }

    if (!itinerary) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <section id='itinerary-page'>
            <Navbar user={itinerary.user} />
            <div className="itinerary-page">
                <h2 className='ip-heading'>Your Itinerary</h2>
                <a href="/" className='ip-back'>Go Back</a>
                {itinerary.itineraryDays.map(day => (
                    <div key={day.dayNumber} className="itinerary-day">
                        <h3 className='id-h3'>Day {day.dayNumber}</h3>
                        <div className="id-categories-container">
                            {Object.entries(groupPlacesByCategory(day.itineraryPlaces)).map(([categoryName, places]) => (
                                <div key={categoryName} className="id-category-column">
                                    <h4 className='id-h4'>{categoryName}</h4>
                                    <ul>
                                        {places.map(place => (
                                            <li key={place.id}>{place.placeName}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </section>
    );
};

export default ItineraryPage;
