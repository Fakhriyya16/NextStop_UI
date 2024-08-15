// src/utils/auth.js
import axios from 'axios';

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // Return true if token exists, otherwise false
};

export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.get('https://localhost:7264/api/Account/GetCurrentUser', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Return user details from the response
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem("token"); // Remove token from localStorage
  window.location.href = "/login"; // Redirect to login page
};
