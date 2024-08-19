import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/Login.css";
import Image from "../assets/img/empty-frame-with-plane-globe.jpg";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Separate state for confirm password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://localhost:7264/api/Account/Register", {
        name,
        surname,
        email,
        password,
        confirmPassword, // Include confirmPassword in the request payload
      });

      if (response.status === 200) {
        navigate("/login");
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

  return (
    <section className="vh-100" style={{ backgroundColor: "#fff" }}>
      <div className="container py-4 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src={Image}
                    alt="register form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit}>
                      <h5 className="fw-normal pb-3 text" style={{ letterSpacing: "1px" }}>
                        Create a new account
                      </h5>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="formName"
                          className="form-control form-control-lg"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="formName">
                          Name
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="formSurname"
                          className="form-control form-control-lg"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="formSurname">
                          Surname
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="formEmail"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="formEmail">
                          Email address
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            id="formPassword"
                            className="form-control form-control-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <span 
                            className="input-group-text" 
                            onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        <label className="form-label" htmlFor="formPassword">
                          Password
                        </label>
                      </div>
                      <div className="form-outline mb-2">
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                            id="formConfirmPassword"
                            className="form-control form-control-lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <span 
                            className="input-group-text" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle showConfirmPassword state
                            style={{ cursor: "pointer" }}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        <label className="form-label" htmlFor="formConfirmPassword">
                          Confirm Password
                        </label>
                      </div>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <div className="mb-2">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Registering..." : "Register"}
                        </button>
                        <button
                          className="btn btn-dark btn-lg btn-block cancel-btn"
                          type="button"
                          onClick={() => navigate("/")}
                        >
                          Cancel
                        </button>
                      </div>
                      <p className= "pb-lg-2" style={{ color: "#393f81" }}>
                        Already have an account?{" "}
                        <a href="/login" style={{ color: "#393f81" }}>
                          Login here
                        </a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
