import React, { useEffect } from 'react';
import '../css/login.css'; // Add a CSS file for styling if needed
import { useUser } from '../../../context/UserContext';
import { VscAccount } from "react-icons/vsc";
import { routes } from '../../../constants/route_constants.js';

function Login({ setUser }) {
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return (
    <div id="login-container">
      {user ? (
        <div id="login-user-info">
          <div id="login-profile-picture">
            <VscAccount id="login-profile-icon" title={user.user_name + "\n" + user.user_email} />
          </div>
          <button id="logout-button">
            <a href={routes.LOGOUT}>Logout</a>
          </button>
        </div>
      ) : (
        <div>
          {/* Use absolute URL to backend to bypass React Router */}
          <a 
            href={routes.SIGN_IN}
            id="login-button"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default Login; 