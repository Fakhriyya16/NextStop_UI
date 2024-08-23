import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logout } from "../utils/auth";
import '../assets/styles/Navbar.css';
import { Link } from 'react-router-dom';
import Logo from '../assets/img/nextstop-high-resolution-logo-black-transparent.png';

function Navbar({ user }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7264/api/Country/GetAll')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the countries!', error);
      });
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" >
          <img src={Logo} alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-right">
        <div className="navbar-destinations">
          <div className="dropdown-container">
            <button className="dropdown-toggle">Available Destinations</button>
            <div className="dropdown-menu">
              {countries.map((country) => (
                <div key={country.id} className="dropdown-item">
                  <a href={`/country/${country.id}`} className="country-link">
                    {country.name}
                  </a>
                  {country.cities && country.cities.length > 0 && (
                    <div className="city-dropdown-menu">
                      {country.cities.map((city, index) => (
                        <a
                          key={`${country.id}-${index}`}
                          href={`/country/${country.id}/city/${encodeURIComponent(city)}`}
                          className="city-dropdown-item"
                        >
                          {city}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="navbar-links">
          {user ? (
            <div className="account-menu">
              <Link to="/blogs">Blogs</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/itineraries">Saved Itineraries</Link>
              <Link to="/favorites">Favorites</Link>
              {user?.subscriptionType === 'Free' && (
                <Link to="/buypremium" className="premium-link">Buy Premium</Link>
              )}
              {user?.subscriptionType === 'Premium' && (
                <span className="premium-plan">Premium Plan</span>
              )}
              <a href="/" onClick={(e) => { e.preventDefault(); logout(); }} className="logout-button">Logout</a>
            </div>
          ) : (
            <>
              <Link to="/blogs">Blogs</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
