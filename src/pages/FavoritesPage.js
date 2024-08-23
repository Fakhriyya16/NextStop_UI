import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/FavoritesPage.css';
import { isLoggedIn, getUser } from '../utils/auth.js';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn()) {
                const userDetails = await getUser();
                setUser(userDetails);
            }
        };

        fetchUser();

        const fetchFavorites = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7264/api/Favorite/GetAllPaginatedForUser?currentPage=${currentPage}&pageSize=${pageSize}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );

                console.log(response.data);
                setFavorites(response.data.data);
                setTotalPages(response.data.pageCount);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [currentPage, pageSize]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleRemoveFromFavorites = async (placeId) => {
        try {
            await axios.delete('https://localhost:7264/api/Favorite/Delete', {
                params: { placeId: placeId },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            await Swal.fire({
                icon: 'success',
                title: 'Removed from favorites!',
                text: 'The place has been removed from your favorites.',
                confirmButtonText: 'Okay'
            });

            setFavorites(favorites.filter(favorite => favorite.placeId !== placeId));
        } catch (error) {
            console.error('Error removing from favorites:', error);

            await Swal.fire({
                icon: 'error',
                title: 'Failed to remove from favorites.',
                text: 'There was an issue removing the place from your favorites.',
                confirmButtonText: 'Okay'
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <section id="favorites-page">
            <Navbar user={user} />
            <div className="container mt-5 favorites-cnt">
                <h2 className="mb-4 text-center favorite-h">Your Favorites</h2>
                {favorites.length === 0 ? (
                    <div className="text-center">
                        <h4 className='favorite-empty'>Your favorites list is empty.</h4>
                        <p className='favorite-empty-suggestion'>Add some places to your favorites to see them here.</p>
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {favorites.map((favorite, index) => (
                                <div key={index} className="col-md-6 col-lg-4 mb-4">
                                    <Link to={`/place/${favorite.placeId}`}>
                                    <div className="card favorite-card">
                                        <img
                                            src={favorite.mainImage}
                                            className="card-img-top"
                                            alt={favorite.placeName}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{favorite.placeName}</h5>
                                            <p className="card-text">
                                                {favorite.cityName}, {favorite.countryName}
                                            </p>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleRemoveFromFavorites(favorite.placeId)}
                                            >
                                                Remove from Favorites
                                            </button>
                                        </div>
                                    </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="btn btn-primary"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="mx-3">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="btn btn-primary"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </section>
    );
};

export default FavoritesPage;
