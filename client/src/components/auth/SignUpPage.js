import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/SignUpPageStyles.css';


const API_BASE_URL = 'https://pdf-managementapp.onrender.com'; // Replace with your FastAPI backend URL

const SignUpPage = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Password does not match');
    } else {
      axios
        .post(`${API_BASE_URL}/signup?email=${email}&password=${password}`)
        .then((response) => {
          // Handle successful signup
          setLoggedIn(true);
          navigate('/home');
        })
        .catch((error) => {
          // Handle signup error
          setError('Error during signup');
          console.error('Signup error:', error);
        });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
      <h1>Sign Up</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignUp}>
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
          placeholder="Password"
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
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ textAlign: 'center' }}>
          Already signed up? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default SignUpPage;
