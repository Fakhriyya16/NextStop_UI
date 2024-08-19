import React from 'react';
import BackgroundImage from '../assets/img/smiling-couple-ready-to-travel-happy-sitting-luggage-holding-passports-isolated-white-background-47927717.jpg';
import '../assets/styles/HeroSection.css';

const HeroSection = () => {
  return (
    <header className="mainHeading">
      <div className="mainHeading__content">
        <article className="mainHeading__text">
          <p className="mainHeading__preTitle">Explore</p>
          <h2 className="mainHeading__title">Your Perfect Trip, Planned Just for You</h2>
          <p className="mainHeading__description">
            Start your adventure today with personalized itineraries crafted just for you.
          </p>
          <a href="/start-planning" className="cta">Read More</a>
        </article>
        <figure className="mainHeading__image">
          <img src={BackgroundImage} alt="Travel" />
        </figure>
      </div>
    </header>
  );
};

export default HeroSection;
