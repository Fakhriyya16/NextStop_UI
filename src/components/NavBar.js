import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import Logo from '../assets/img/nextstop-high-resolution-logo-black-transparent.png';
import {jwtDecode} from 'jwt-decode';
import '../assets/styles/Navbar.css';
import { isLoggedIn } from '../utils/auth';

function Navbar() {
  const [countries, setCountries] = useState([]);
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        const userData = await getUser();
        if (userData) {
          setUser(userData);
          const token = localStorage.getItem("token");
          try {
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.role.includes('Admin'));
          } catch (error) {
            console.error('Error decoding token', error);
          }
        }
      }
    };

    axios.get('https://localhost:7264/api/Country/GetAll')
      .then(response => {
        setCountries(response.data);
        console.log(countries);
      })
      .catch(error => {
        console.error('There was an error fetching the countries!', error);
      });

    fetchUser();
  }, []);

  return (
    <nav className="mp-navbar">
      <div className="mp-navbar-logo">
        <Link to="/" >
          <img src={Logo} alt="Logo" className="mp-logo" />
        </Link>
      </div>

      <div className="mp-navbar-right">
        <div className="mp-navbar-destinations">
          <div className="mp-dropdown-container">
            <button className="mp-dropdown-toggle">Available Destinations</button>
            <div className="mp-dropdown-menu">
              {countries.map((country) => (
                <div key={country.id} className="mp-dropdown-item">
                  <a className="mp-country-link">
                    {country.name}
                  </a>
                  {country.cities && country.cities.length > 0 && (
                    <div className="mp-city-dropdown-menu">
                      {country.cities.map((city, index) => (
                        <a
                          key={`${country.id}-${index}`}
                          href={`/city/${encodeURIComponent(city)}`}
                          className="mp-city-dropdown-item"
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

        <div className="mp-navbar-links">
          <Link to="/blogs">Blogs</Link>
          <Link to="/searchplaces">Search Places</Link>
          {user ? ( 
            <div className="mp-account-menu">
              {user.subscriptionType === 'Free' && (
                <Link to="/buypremium" className="mp-premium-link">Buy Premium</Link>
              )}
              {user.subscriptionType === 'Premium' && (
                <a className="mp-premium-plan-text">Premium Plan</a>
              )}
              <Link to={`/profile/${user.appUserId}`}>Profile</Link>
              <Link to="/favorites">Favorites</Link>
              <a href="/" onClick={(e) => { e.preventDefault(); logout(); }} className="mp-logout-button">Logout</a>
              {isAdmin && (
                <Link to="/admin" className="mp-admin-link">Admin Panel</Link>
              )}
            </div>
          ) : (
            <>
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
