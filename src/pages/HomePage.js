import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import { isLoggedIn, getUser } from '../utils/auth';

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
    return <div>Loading...</div>; // or a spinner/loading component
  }

  return (
    <div>
      <Navbar user={user} />
      {/* Your homepage content here */}
    </div>
  );
}

export default HomePage;
