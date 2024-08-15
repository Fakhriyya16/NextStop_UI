import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { isLoggedIn, getUser } from './utils/auth';

function App() {
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (isLoggedIn()) {
      await getUser(); // Fetch user data if needed here or in HomePage
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Handle token-based refresh after login
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
    return <div>Loading...</div>; // or a spinner/loading component
  }

  return (
    <div className="App">
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
