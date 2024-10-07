import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ChangeKey.css"; // Optional: Create and style as needed

const API_URL = "http://localhost:3000"; // Adjust if necessary

const ChangeKey = ({ handleClose }) => {
  const [currentKey, setCurrentKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const secretKey = localStorage.getItem("secretKey");

  const handleChangeKey = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/change-key`,
        {
          currentKey,
          newKey,
        },
        {
          headers: { "x-secret-key": secretKey },
        }
      );
      setMessage(response.data.message);
      setError("");
      setCurrentKey("");
      setNewKey("");
      // Update the secret key in localStorage
      localStorage.setItem("secretKey", newKey);
    } catch (err) {
      setError(err.response?.data?.message || "Error changing secret key");
      setMessage("");
    }
  };

  return (
    <div className="change-key-container">
      <h2>Change Secret Key</h2>
      <form onSubmit={handleChangeKey} className="change-key-form">
        <input
          type="password"
          placeholder="Current Secret Key"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Secret Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          required
        />
        <button type="submit">Change Key</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleClose} className="back-button">
        Close
      </button>
    </div>
  );
};

export default ChangeKey;
