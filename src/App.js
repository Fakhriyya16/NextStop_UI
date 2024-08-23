import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ResetPassword from './pages/ResetPassword';
import { isLoggedIn, getUser } from './utils/auth';
import Modal from 'react-modal';
import ConfirmEmail from './pages/ConfirmEmail';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import BuyPremium from './pages/BuyPremiumPage';

Modal.setAppElement('#root');

function App() {
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (isLoggedIn()) {
      await getUser();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/resetpassword" element={<ResetPassword/>} />
          <Route path="/confirmemail" element={<ConfirmEmail/>} />
          <Route path ="/blogs" element={<BlogsPage/>} />
          <Route path="/blog/:id" element={<BlogDetailPage/>} />
          <Route path="/place/:id" element={<PlaceDetailPage/>} />
          <Route path='/favorites' element={<FavoritesPage/>} />
          <Route path='/buypremium' element={<BuyPremium/>} />
        </Routes>
    </div>
  );
}

export default App;
