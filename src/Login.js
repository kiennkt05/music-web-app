import React, { useState } from "react";
import "./styles/login.css"; // Add styles for the login page

const Login = ({ setIsLoggedIn }) => {
  const handleLogin = () => {
    setIsLoggedIn(true); // Set the user as logged in
  };

  return (
    <div className="login-container">
      <h1>🎧 Music Web App 🎧</h1>
      <form className="login-form">
        <input type="text" placeholder="Username" className="login-input" />
        <input type="password" placeholder="Password" className="login-input" />
        <button type="button" className="login-button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
