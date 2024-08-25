import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/Register.css";
import Image from "../assets/img/empty-frame-with-plane-globe.jpg";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        confirmPassword,
      });
  
      if (response.status === 200) {
        Swal.fire({
          title: 'Registration Successful!',
          text: 'Please check your email for a confirmation link.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        const errors = response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          setError(errors[0]); 
        } else {
          setError("An unexpected error occurred.");
        }
      }
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          setError(errors[0]); 
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#fff" }}>
      <div className="container py-7">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col col-xl-10">
            <div className="register-card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block register-image">
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
                      <h5 className="fw-normal pb-3 text register-hdn" style={{ letterSpacing: "1px" }}>
                        Create a new account
                      </h5>
                      <div className="form-outline mb-3">
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
                      <div className="form-outline mb-3">
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
                      <div className="form-outline mb-2">
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
                      <div className="form-outline mb-2">
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"} 
                            id="formPassword"
                            className="form-control form-control-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <span 
                            className="input-group-text" 
                            onClick={() => setShowPassword(!showPassword)} 
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
                            type={showConfirmPassword ? "text" : "password"} 
                            id="formConfirmPassword"
                            className="form-control form-control-lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <span 
                            className="input-group-text" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
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
                      <div className="mb-2 register-buttons">
                        <button
                          className="btn btn-dark btn-block register-button"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Registering..." : "Register"}
                        </button>
                        <button
                          className="btn btn-dark btn-block cancel-btn register-button"
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
