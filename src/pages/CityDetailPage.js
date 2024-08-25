import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/CityDetailPage.css';  
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { isLoggedIn, getUser } from '../utils/auth';

const CityDetailPage = () => {
    const { name } = useParams();
    const [city, setCity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        if (isLoggedIn()) {
            const userDetails = await getUser();
            setUser(userDetails);
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCity = async () => {
            try {
                const response = await axios.get(`https://localhost:7264/api/City/GetByName/${name}`);
                setCity(response.data);
                console.log(city);
            } catch (error) {
                console.error('Error fetching city:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCity();
    }, [name]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!city) {
        return <p>City not found</p>;
    }

    return (
        <section className="place-detail-page">
            <Navbar user={user} />
            <div className="place-detail-main">
                <Link to="/" className="place-detail-back-btn">
                    &larr; Go Back
                </Link>
                <article className="place-detail-card">
                    <div className="place-detail-image-wrapper">
                        <img src={city.imageUrl} className='place-detail-image' alt="City" />
                    </div>
                    <div className="place-detail-info">
                        <h2 className='place-detail-heading'>{city.name}</h2>
                        <p className='place-detail-description'>{city.description}</p>
                        <div className='place-detail-places'>
                            <h3><a href='/searchplaces'>Search For Places</a></h3>
                        </div>
                    </div>
                </article>
            </div>
            <Footer />
        </section>
    );
};

export default CityDetailPage;
