import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import "../assets/styles/ResetPassword.css"; 
import Logo from "../assets/img/nextstop-high-resolution-logo-black-transparent.png"

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); 
  const [token, setToken] = useState(""); 
  const [error, setError] = useState("");  // Single error state
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setEmail(urlParams.get('email') || '');
    setToken(urlParams.get('token') || '');
  }, []);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    setError("");  // Clear the error if passwords match
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://localhost:7264/api/Account/ResetPassword",
        {
          email,
          token,
          password,
          confirmPassword
        }
      );

      if (response.status === 200) {
        setSuccess("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");  // Redirect to login page after 2 seconds
        }, 2000);
      } else {
        setError(response.data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainDiv">
      <div className="cardStyle">
        <form id="signupForm" onSubmit={handleSubmit}>
          <img src={Logo} id="signupLogo" alt="Logo" />
          <h2 className="formTitle">Reset Your Password</h2>
          <div className="inputDiv">
            <label className="inputLabel" htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="inputDiv">
            <label className="inputLabel" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validatePassword}  // Validate when the user leaves the confirm password field
            />
          </div>
          {error && <p className="errorMessage">{error}</p>}  {/* Only one error message will be shown here */}
          {success && <p className="successMessage">{success}</p>}
          <div className="buttonWrapper">
            <button
              type="submit"
              id="submitButton"
              className="btn btn-warning"
              disabled={loading}
            >
              <span>Continue</span>
              {loading && <span id="loader" className="loader"></span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
