import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/Login.css";
import Logo from "../assets/img/nextstop-high-resolution-logo.png";
import Image from "../assets/img/empty-frame-with-plane-globe.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from 'react-modal';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("https://localhost:7264/api/Account/Login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.message);
        window.location.href = "/";
      } else {
        setError(response.data.errors[0] || "An unexpected error occurred.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.errors[0] || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
  
    try {
      const response = await axios.post(
        "https://localhost:7264/api/Account/ForgetPassword",
        { email: forgotEmail },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      setForgotMessage("If an account with this email exists, you will receive an email with instructions to reset your password.");
    } catch (error) {
      if (error.response) {
        const errors = error.response.data;
        const errorMessages = Array.isArray(errors) ? errors.join(', ') : errors;
  
        setForgotError(errorMessages || "An error occurred. Please try again later.");
      } else {
        setForgotError("An unexpected error occurred. Please try again later.");
      }
    }
  };
  
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForgotEmail("");
    setForgotError("");
    setForgotMessage("");
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#fff" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src={Image}
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <img src={Logo} className="logo" />
                      </div>
                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>
                        Sign into your account
                      </h5>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="form2Example17">
                          Email address
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="form2Example27"
                            className="form-control form-control-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <span className="input-group-text" role="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        <label className="form-label" htmlFor="form2Example27">
                          Password
                        </label>
                      </div>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </button>
                        <a className="btn btn-dark btn-lg btn-block cancel-btn" href="/">
                          Cancel
                        </a>
                      </div>
                      <a className="small text-muted" href="#!" onClick={openModal}>
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Don't have an account?{" "}
                        <a href="/Register" style={{ color: "#393f81" }}>
                          Register here
                        </a>
                      </p>
                      <a href="#!" className="small text-muted">
                        Terms of use.
                      </a>
                      <a href="#!" className="small text-muted">
                        Privacy policy
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Forgot Password"
        className="forgot-password-modal"
        overlayClassName="forgot-password-modal-overlay"
      >
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control mt-2"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning reset-link mt-3">
            Send Reset Link
          </button>
          {forgotMessage && <p className="success-message">{forgotMessage}</p>}
          {forgotError && <p className="error-message">{forgotError}</p>}
        </form>
        <button onClick={closeModal} className="btn btn-secondary mt-3 ">
          Close
        </button>
      </Modal>
    </section>
  );
};

export default Login;
