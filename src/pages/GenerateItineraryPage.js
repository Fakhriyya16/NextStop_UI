import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/LoadingItinerary'; 
import '../assets/styles/GenerateItineraryPage.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { isLoggedIn, getUser } from '../utils/auth.js';
import Swal from 'sweetalert2';

const GenerateItineraryPage = () => {
    const [city, setCity] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn()) {
                const userDetails = await getUser();
                setUser(userDetails);
                if (userDetails.subscriptionType !== 'Premium') {
                    Swal.fire({
                        title: 'Premium Subscription Required',
                        text: 'You need a premium subscription to generate itineraries.',
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonText: 'Buy Premium',
                        cancelButtonText: 'Cancel',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/buypremium'; 
                        }
                    });
                }
            } else {
                Swal.fire({
                    title: 'Login Required',
                    text: 'You need to be logged in to generate an itinerary.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login',
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login'; 
                    }
                });
            }
        };

        const fetchCategoriesAndCities = async () => {
            try {
                const [categoriesResponse, citiesResponse] = await Promise.all([
                    axios.get('https://localhost:7264/api/Category/GetAllNames'),
                    axios.get('https://localhost:7264/api/City/GetAllNames'),
                ]);
                setCategories(categoriesResponse.data);
                setCities(citiesResponse.data);
            } catch (error) {
                console.error('Error fetching categories or cities:', error);
            }
        };

        fetchUser();
        fetchCategoriesAndCities();
    }, []);

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true); 

        try {
            const response = await axios.post('https://localhost:7264/api/Itinerary/GenerateItinerary', {
                cityId: city,
                numberOfDays: numberOfDays,
                categories: selectedCategories,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setTimeout(() => {
                window.location.href = `/itinerary/${response.data.id}`;
            }, 2000);
        } catch (err) {
            console.error('Error generating itinerary:', err);
            setLoading(false); 
        }
    };

    return (
        <section id='generate-itinerary'>
            <Navbar user={user} />
            <div className="generate-itinerary-page">
                <h2 className='gi-heading'>Generate Your Itinerary</h2>
                <form onSubmit={handleSubmit}>
                    <div className="gi-form-group gi-box">
                        <label>City:</label>
                        <select 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            required
                        >
                            <option className='gi-option' value="" disabled>Select a city</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="gi-form-group">
                        <label>Number of Days (Max 7):</label>
                        <input
                            type="number"
                            value={numberOfDays}
                            onChange={(e) => setNumberOfDays(Math.min(Math.max(e.target.value, 1), 7))}
                            required
                        />
                    </div>
                    <div className="gi-form-group">
                        <label>Categories:</label>
                        <div className="gi-categories">
                            {categories.map(category => (
                                <label key={category.id}>
                                    <input
                                        type="checkbox"
                                        value={category.id}
                                        onChange={handleCategoryChange}
                                    />
                                    {category.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <button className='gi-button' type="submit">Generate Itinerary</button>
                </form>

                {loading && <Loading />} 
            </div>
            <Footer />
        </section>
    );
};

export default GenerateItineraryPage;
