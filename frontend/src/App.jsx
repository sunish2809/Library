import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignIn from "./components/SignIn";         // Changed to PascalCase
import AppContent from "./components/AppContent"; // Changed to PascalCase
import ChangeKey from "./components/ChangeKey";   // Changed to PascalCase

const App = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    } else {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("secretKey");
    navigate("/signin");
  };

  return (
    <Routes>
      <Route
        path="/signin"
        element={
          isAuthenticated ? (
            <Navigate to="/app" replace />
          ) : (
            <SignIn onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/app"
        element={
          isAuthenticated ? (
            <AppContent onLogout={handleLogout} />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default App;

