import React, { useState } from "react";
import axios from "axios";
import "./SignIn.css"; // Optional: Create this CSS file for styling

const SignIn = ({ onLogin }) => {
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:3000"; // Adjust if backend runs on a different port

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify`, {
        secretKey,
      });
      if (response.data.message === "Authentication successful") {
        localStorage.setItem("secretKey", secretKey);
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="signin-container">
      <h1 className="title">LIBRARY MANAGEMENT</h1>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="password"
          placeholder="Enter your secret key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />
        <button type="submit">Enter</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SignIn;
