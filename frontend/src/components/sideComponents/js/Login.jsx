import React from 'react';
import '../css/login.css'; // Add a CSS file for styling if needed
import { useUser } from '../../../context/UserContext';
import { VscAccount } from "react-icons/vsc";

const Login = () => {
  const { user } = useUser();
  
  return (
    <div className="login-container">
      {user ? (
        <div className="user-info">
          <div className="profile-picture">
            <VscAccount className="profile-icon" title={user.user_name + "\n" + user.user_email} />
          </div>
          <button className="logout-button">
            <a href="http://localhost:3001/logout">Logout</a>
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