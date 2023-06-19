import React, { useState } from 'react';
import {BrowserRouter as Router,Route,Navigate,Routes,} from 'react-router-dom';
import SignUpPage from './components/auth/SignUpPage';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/HomePage';
import WelcomePage from './components/WelcomePage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmailGlobally] = useState("");


  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="/signup" element={loggedIn ? <Navigate to="/home" /> : <SignUpPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          
        <Route path="/login" element={loggedIn ? <Navigate to="/home" /> : <LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmailGlobally={setEmailGlobally} />} />
          
        <Route path="/home" element={loggedIn ? <HomePage email={email} /> : <Navigate to="/login" />} />

        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
