import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.js"; // Modal bileşenini import edin
import "../styles/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false); // Kayıt modalı için state
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // Şifre sıfırlama modalı için state
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basit bir login kontrolü
        if (username === "user" && password === "password") {
            navigate("/home"); // Home sayfasına yönlendir
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group remember-me">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
                <div className="forgot-password">
                    <button
                        className="link-button"
                        onClick={() => setShowForgotPasswordModal(true)}
                    >
                        Forgot password?
                    </button>
                </div>
                <div className="register-link">
                    Don't have an account?{" "}
                    <button
                        className="link-button"
                        onClick={() => setShowRegisterModal(true)}
                    >
                        Register
                    </button>
                </div>
            </form>

            {/* Kayıt Olma Modalı */}
            <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
                <h2>Register</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert("Registration successful!");
                        setShowRegisterModal(false);
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Surname</label>
                        <input type="text" id="surname" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required />
                    </div>
                    <button type="submit" className="modal-button">
                        Register
                    </button>
                </form>
            </Modal>

            {/* Şifremi Unuttum Modalı */}
            <Modal isOpen={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)}>
                <h2>Forgot Password</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert("Password reset link sent to your email!");
                        setShowForgotPasswordModal(false);
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required />
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