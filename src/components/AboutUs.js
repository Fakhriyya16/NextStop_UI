import React from 'react';
import '../assets/styles/AboutUs.css';
import MainImage from '../assets/img/premium_photo-1679830513869-cd3648acb1db.avif';

const AboutUs = () => {
    return (
        <div id="about-us" className="responsive-container-block bigContainer">
            <div className="responsive-container-block Container">
                <div className="imgContainer">
                    <img className="mainImg" src={MainImage} alt="Main Image" />
                </div>
                <div className="responsive-container-block textSide">
                    <h1 className="about-heading">
                        About Us
                    </h1>
                    <p className="text-blk subHeading">
                        Welcome to NextStop, your ultimate travel companion for exploring cities with ease and excitement. Our platform is designed to help you uncover the best a city has to offer, from iconic sightseeing spots and top-rated restaurants to hidden gems and local favorites. Whether you're planning a weekend getaway or a longer vacation, we provide you with comprehensive guides to make your journey unforgettable.
                        <br />
                        <br />
                        With our intuitive interface, you can effortlessly browse through various cities, discover must-see attractions, and find dining options that suit your taste. Our premium feature takes your travel experience to the next level by generating personalized itineraries that group destinations by their proximity, ensuring you make the most of your time and explore efficiently.
                    </p>
                    <a href="#explore">
                        <button className="explorebtn" >
                            Start Exploring
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
