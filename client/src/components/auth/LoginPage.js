import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/LoginPageStyles.css';


const API_BASE_URL = 'https://pdf-managementapp.onrender.com'; // Replace with your FastAPI backend URL

const LoginPage = ({ setLoggedIn, setEmailGlobally }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    setLoggedIn(true);
    setEmailGlobally(email);
    axios
      .post(`${API_BASE_URL}/login?email=${email}&password=${password}`)
      .then((response) => {
        if (response.status === 200) {
          navigate('/home');
        } else {
          setError('Incorrect email or password');
        }
      })
      .catch((error) => {
        setError('Login error: Incorrect email or password');
        console.error('Login error:', error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/signup">Signup</Link>
      </p>
      <p>
        <Link to="/forgotpassword">Forgot password?</Link>
      </p>
    </div>
    </div>
  );
};

export default LoginPage;
