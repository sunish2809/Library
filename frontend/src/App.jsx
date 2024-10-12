import { createBrowserRouter } from "react-router-dom";
import { RouterProvider, redirect } from "react-router-dom";
import SignIn from "./components/SignIn";
import AppContent from "./components/AppContent"; // Changed to PascalCase
import { useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("secretKey");
  };

  const router = createBrowserRouter([
    {
      path: "/signin",
      element: <SignIn onLogin={handleLogin} />,
      loader: () => {
        // Redirect to /app if the user is already authenticated
        if (isAuthenticated) {
          throw redirect("/app");
        }
        return null; // Otherwise continue to signin page
      },
    },
    {
      path: "/app",
      element: <AppContent onLogout={handleLogout} />,
      loader: () => {
        if (!isAuthenticated) {
          throw redirect("/signin");
        }
        return null;
      },
    },
    {
      path: "*",
      loader: () => {
        // Redirect all unmatched routes to signin
        throw redirect("/signin");
      },
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
