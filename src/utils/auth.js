import axios from 'axios';

export const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return !!token; 
};

export const getUser = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.get('https://localhost:7264/api/Account/GetCurrentUser', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; 
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  }
  return null;
};

export const logout = () => {
  sessionStorage.removeItem("token"); 
  window.location.href = "/login"; 
};
