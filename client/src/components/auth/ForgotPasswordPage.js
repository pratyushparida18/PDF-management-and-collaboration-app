import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles/ForgotPasswordPageStyles.css';


const API_BASE_URL = 'https://pdf-managementapp.onrender.com'; // Replace with your FastAPI backend URL

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleResetPassword = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Password does not match');
    } else {
      axios
        .post(`${API_BASE_URL}/resetpassword?email=${email}&password=${password}`)
        .then((response) => {
          // Handle successful password reset
          
          navigate('/login'); 
          console.log('Password reset successful');
        })
        .catch((error) => {
          // Handle password reset error
          setError('Error during password reset');
          console.error('Password reset error:', error);
        });
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
      <h1>Forgot Password</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
    </div>
  );
};

export default ForgotPasswordPage;
