import React, { useEffect, useState } from 'react';
import '../css/login.css'; // Add a CSS file for styling if needed

const Login = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch current user on component mount
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/current_user', {
          credentials: 'include' // Important for sending cookies
        });
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  return (
    <div className="login-container">
      {user ? (
        <div className="user-info">
          <button className="logout-button">
            <a href="/api/logout">Logout</a>
          </button>
        </div>
      ) : (
        <div>
          {/* Use absolute URL to backend to bypass React Router */}
          <a 
            href="http://localhost:3001/auth/google" 
            className="login-button"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default Login; 