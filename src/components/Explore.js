import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/Explore.css';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPlaces();
  }, [currentPage, pageSize]);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('https://localhost:7264/api/Place/GetAllPaginated', {
        params: {
          currentPage,
          pageSize,
        },
      });
      const data = response.data;
      setPlaces(data.data || []);
      setTotalPages(data.pageCount || 0);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const shortenDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
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

  return (
    <div className="mp-explore" id="explore">
      <div className='mp-explore-heading'>
        <h1>Places To Visit</h1>
      </div>

      <div className="mp-ex-pagination-controls">
        <label htmlFor="pageSize">Items per page:</label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className='mp-form-select'>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>

      <div className="mp-card-container">
        {places.length > 0 ? (
          places.map(place => (
            <div className="mp-card" key={place.id}>
              <img
                className="mp-card__background"
                src={place.images[0]}
                alt={`Photo of ${place.name}`}
                width="1920"
                height="2193"
              />
              <div className="mp-card__content">
                <div className="mp-card__content--container">
                  <h2 className="mp-card__title">{place.name}</h2>
                  <p className="mp-card__description">
                    {shortenDescription(place.description, 4)}
                  </p>
                </div>
                <Link to={`/place/${place.id}`}>
                  <button className="button-81">Read more</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No places found</p>
        )}
      </div>

      <div className="mp-ex-pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevious}
        >
          Previous
        </button>

        {getPaginationButtons().map((page, index) => (
          page === '...' ? (
            <span key={index}>...</span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Explore;
