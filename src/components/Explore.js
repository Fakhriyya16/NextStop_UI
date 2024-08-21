import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/Explore.css'; 

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); 
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

  return (
    <div className="explore" id="explore">
      <div className='explore-heading'>
        <h1>Places To Visit</h1>
      </div>

      <div className="ex-pagination-controls">
        <label htmlFor="pageSize">Items per page:</label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className='form-select'>
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="12">12</option>
        </select>
      </div>

      <div className="card-container">
        {places.length > 0 ? (
          places.map(place => (
            <div className="card" key={place.id}>
              <img
                className="card__background"
                src={place.images[0]}
                alt={`Photo of ${place.name}`}
                width="1920"
                height="2193"
              />
              <div className="card__content">
                <div className="card__content--container">
                  <h2 className="card__title">{place.name}</h2>
                  <p className="card__description">
                    {shortenDescription(place.description, 7)}
                  </p>
                </div>
                <button className="button-81">Read more</button>
              </div>
            </div>
          ))
        ) : (
          <p>No places found</p>
        )}
      </div>

      <div className="ex-pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevious}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
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
