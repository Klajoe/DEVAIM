import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.js";
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate("/home");
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerData = {
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      name: formData.get("name"),
      surname: formData.get("surname"),
    };

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        alert("Registration successful!");
        setShowRegisterModal(false);
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      const response = await fetch(
        "http://localhost:8080/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        alert("Password reset link sent to your email!");
        setShowForgotPasswordModal(false);
      } else {
        alert("Failed to send reset link");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <i className="input-icon user-icon"></i>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <i className="input-icon password-icon"></i>
          </div>

          <div className="form-actions">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <button
              type="button"
              className="link-button"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="register-link">
          Don't have an account?{" "}
          <button
            className="link-button"
            onClick={() => setShowRegisterModal(true)}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      >
        <h2>Create Account</h2>
        <p className="modal-subtitle">Join us today!</p>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="surname"
              name="surname"
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="modal-button">
            Create Account
          </button>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      >
        <h2>Reset Password</h2>
        <p className="modal-subtitle">We'll send you a reset link</p>
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              required
            />
          </div>
          <button type="submit" className="modal-button">
            Send Reset Link
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Login;
