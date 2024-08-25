import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/PlaceDetailPage.css';
import { useParams } from 'react-router-dom';
import { isLoggedIn, getUser } from '../utils/auth.js';
import Navbar from '../components/NavBar.js';
import Footer from '../components/Footer.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';

const PlaceDetailPage = () => {
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`https://localhost:7264/api/Place/GetById/${id}`);
        setPlace(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchPlace();

    const fetchUser = async () => {
      if (isLoggedIn()) {
        const userDetails = await getUser();
        setUser(userDetails);
        checkFavoriteStatus(userDetails.appUserId, id);

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.role.includes('Admin'));
          } catch (error) {
            console.error('Error decoding token', error);
          }
        }
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('https://localhost:7264/api/Review/GetAllPaginated', {
        params: {
          currentPage,
          pageSize,
          placeId: id,
        },
      });

      const data = response.data;
      setReviews(data.data || []);
      setTotalPages(data.pageCount || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkFavoriteStatus = async (userId, placeId) => {
    try {
      const response = await axios.get(`https://localhost:7264/api/Favorite/IsFavorite`, {
        params: {
          placeId,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsFavorite(response.data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleReviewRating = (star) => {
    setReviewRating(star);
  };

  const handleStarHover = (star) => {
    setHoverRating(star);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleNext = () => {
    if (place && activeSlide < place.images.length - 1) {
      setActiveSlide((prevSlide) => prevSlide + 1);
    }
  };

  const handlePrev = () => {
    if (place && activeSlide > 0) {
      setActiveSlide((prevSlide) => prevSlide - 1);
    }
  };

  const isNextDisabled = place && activeSlide === place.images.length - 1;
  const isPrevDisabled = place && activeSlide === 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating === 0 || reviewText.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Review',
        text: 'Please fill in both rating and review text.',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://localhost:7264/api/Review/Create?placeId=${id}`,
        {
          rating: reviewRating,
          comment: reviewText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted',
        text: 'Your review was submitted successfully!',
        confirmButtonText: 'OK',
      });
      setReviewText('');
      setReviewRating(0);
      setHoverRating(0);
      fetchReviews();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Failed to submit review. Please try again.',
        confirmButtonText: 'OK',
      });
      console.error('Error submitting review:', error);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://localhost:7264/api/Review/Delete?id=${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Review Deleted',
        text: 'Review was deleted successfully!',
        confirmButtonText: 'OK',
      });
      fetchReviews();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Deletion Failed',
        text: 'Failed to delete review. Please try again.',
        confirmButtonText: 'OK',
      });
      console.error('Error deleting review:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const pageRange = 3;
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);

    if (totalPages > 5 && startPage > 1) {
      buttons.push(1);
      if (startPage > 2) buttons.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (totalPages > 5 && endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push('...');
      buttons.push(totalPages);
    }

    return buttons;
  };

  const handleAddToFavorites = async () => {
    if (!isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in to add this place to your favorites.',
        confirmButtonText: 'OK',
      });
      return;
    }

    setIsAddingFavorite(true);

    try {
      const token = localStorage.getItem('token');
      
      if (isFavorite) {
        await axios.delete('https://localhost:7264/api/Favorite/Delete', {
          params: { placeId: id },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
        Swal.fire({
          icon: 'info',
          title: 'Removed from Favorites',
          text: 'This place has been removed from your favorites!',
          confirmButtonText: 'OK',
        });
      } else {
        await axios.post('https://localhost:7264/api/Favorite/Create', {
          appUserId: user.appUserId,
          placeId: id,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(true);
        Swal.fire({
          icon: 'success',
          title: 'Added to Favorites',
          text: 'This place has been added to your favorites!',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update Favorite',
        text: 'There was an issue updating the favorites. Please try again.',
        confirmButtonText: 'OK',
      });
      console.error('Error updating favorite:', error);
    } finally {
      setIsAddingFavorite(false);
    }
  };

  if (error) {
    return <div>Error fetching place details: {error.message}</div>;
  }

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <section id="place-detail">
      <Navbar user={user} />
      <div className="pd-wrap">
        <div className="container">
          <div className="go-back">
            <a className="go-back-a" href="/">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a className="go-back-a" href="/">
              Go Back
            </a>
          </div>
          <div className="place-detail-upper">
            <div className="carousel">
              {place.images.length > 1 && (
                <div className="carousel-wrapper">
                  <div
                    className="carousel-images"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {place.images.map((img, index) => (
                      <div key={index} className="carousel-slide">
                        <img src={img} alt={`Image ${index}`} />
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control prev"
                    onClick={handlePrev}
                    disabled={isPrevDisabled}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="carousel-control next"
                    onClick={handleNext}
                    disabled={isNextDisabled}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
            <div className="product-info">
              <div className="product-name">
                {place.name}
                <button
                  className="btn round-black-btn"
                  onClick={handleAddToFavorites}
                  disabled={isAddingFavorite}
                >
                  {isAddingFavorite ? (isFavorite ? 'Removing...' : 'Adding...') : (isFavorite ? 'Remove from Favorites' : 'Add to Favorites')}
                </button>
              </div>
              <div className="reviews-counter">
                <div className="rate">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${place.rating >= star ? 'filled' : ''}`}
                      title={`${star} stars`}
                    >
                      <i className="fas fa-star"></i>
                    </span>
                  ))}
                  <span>
                    {place.reviews?.length > 0
                      ? `${place.reviews.length} Reviews`
                      : 'No Reviews'}
                  </span>
                </div>
              </div>
              <p className="product-dtl">{place.description}</p>
            </div>
          </div>
          <div className="product-info-tabs">
            <div className="review-heading">Reviews</div>
            {reviews.length === 0 ? (
              <p className="no-reviews">There are no reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <h5 className="username-review">{review.user}</h5>
                  <p className="comment-review">{review.comment}</p>
                  {isLoggedIn() && (user?.appUserId === review.appUserId || isAdmin) && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReviewDelete(review.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
            {isLoggedIn() ? (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="your-rating">Your Rating</label>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label
                        key={star}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={() => handleStarLeave()}
                        onClick={() => handleReviewRating(star)}
                      >
                        <i
                          className={`fas fa-star ${reviewRating >= star || hoverRating >= star ? 'filled' : ''
                            }`}
                        ></i>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Submit Review
                </button>
              </form>
            ) : (
              <p className="login-message">
                Please <a href="/login">log in</a> to write a review.
              </p>
            )}
            <div className="pagination-pd">
              {getPaginationButtons().map((page, index) => (
                <button
                  key={index}
                  onClick={() => page !== '...' && handlePageChange(page)}
                  className={`pagination-btn-pd ${currentPage === page ? 'active' : ''
                    }`}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default PlaceDetailPage;
