import React from 'react';
import '../assets/styles/Footer.css'

const Footer = () => {
  return (
    <footer className="mp-footer">
      <div className="mp-footer-container">
        <div className="mp-footer-section">
          <h3>Contact Us</h3>
          <p>Email: nextstop@gmail.com</p>
          <p>Phone: +1 (234) 567-8901</p>
          <p>Address: 123 Main Street, Baku, Azerbaijan</p>
        </div>
        <div className="mp-footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">About Us</a></li>
            <li><a href="/generateitinerary">Itinerary Generator</a></li>
            <li><a href="/blogs">Blogs</a></li>
          </ul>
        </div>
        <div className="mp-footer-section">
          <h3>Follow Us</h3>
          <div className="mp-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="mp-footer-bottom">
        <p>&copy; {new Date().getFullYear()} Your Website. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
