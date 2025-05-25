import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import * as authService from "../services/authService";
import '../styles/LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await authService.checkAuthStatus();
        if (isLoggedIn) {
          onLoginSuccess?.();
          // Check for stored valuation state
          const valuationState = localStorage.getItem('valuationState');
          if (valuationState) {
            const { mobileId } = JSON.parse(valuationState);
            navigate(`/valuation/${mobileId}`);
          } else {
            navigate("/mobiles");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };
    checkAuth();
  }, [navigate, onLoginSuccess]);

  const handleLogin = async (data) => {
    try {
      setError("");
      setLoading(true);
      const response = await authService.login(data);
      
      if (response.user) {
        // Notify parent component about successful login
        onLoginSuccess?.();
        navigate("/"); // Always go to mobile listings page after login
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <LoginForm onLogin={handleLogin} disabled={loading} />
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#e0e7ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)",
    padding: "2rem",
  },
  title: {
    textAlign: "center",
    color: "#2563EB",
    marginBottom: "2rem",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  error: {
    color: "crimson",
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  loading: {
    color: "#2563EB",
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
  },
};

export default LoginPage;
