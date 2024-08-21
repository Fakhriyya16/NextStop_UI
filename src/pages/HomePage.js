import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import { isLoggedIn, getUser } from '../utils/auth';
import AboutUs from '../components/AboutUs';
import Explore from '../components/Explore';
import Promotion from '../components/Promotion';
import BlogCarousel from '../components/BlogCarousel';
import Footer from '../components/Footer'

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar user={user} />
      <HeroSection />
      <AboutUs />
      <Explore/>
      <Promotion />
      <BlogCarousel />
      <Footer/>
    </div>
  );
}

export default HomePage;
