// WelcomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLoginNavigation = () => {
    navigate('/login');
  };

  const handleSignUpNavigation = () => {
    navigate('/signup');
  };

  return (
    <>
    <div className="outer-div">
      <div className="container" >
        <h1>Welcome to PDF Management and Collaboration App</h1>
      </div>
      <div className="container">
        <button onClick={handleLoginNavigation} id='button1'>Login</button>
        <button onClick={handleSignUpNavigation}>Signup</button>
      </div>
    </div>
    </>
  );
};

export default WelcomePage;
