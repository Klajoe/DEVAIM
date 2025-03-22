// src/components/Navbar.js
import React from "react";
import {Link, useLocation} from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const location = useLocation();

    return (
        <div className="navbar">
            <Link
                to="/"
                className={`nav-btn ${
                    location.pathname === "/" ? "active" : ""
                }`}
            >
                Home
            </Link>
            <Link
                to="/members"
                className={`nav-btn ${
                    location.pathname === "/members" ? "active" : ""
                }`}
            >
                Members
            </Link>
            <Link
                to="/activity"
                className={`nav-btn ${
                    location.pathname === "/activity" ? "active" : ""
                }`}
            >
                Activity
            </Link>
            <Link
                to="/tasks"
                className={`nav-btn ${location.pathname === "/tasks" ? "active" : ""}`}
            >
                Tasks
            </Link>
            <Link
                to="/merge-request"
                className={`nav-btn ${
                    location.pathname === "/merge-request" ? "active" : ""
                }`}
            >
                Merge Requests
            </Link>
            <Link
                to="/pull-request"
                className={`nav-btn ${location.pathname === "/pull-request" ? "active" : ""}`}
            >
                Pull Requests
            </Link>
            <Link
                to="/monitoring"
                className={`nav-btn ${
                    location.pathname === "/monitoring" ? "active" : ""
                }`}
            >
                Monitoring
            </Link>
            <Link
                to="/cicd"
                className={`nav-btn ${location.pathname === "/cicd" ? "active" : ""}`}
            >
                CI/CD
            </Link>
            <Link
                to="/Todo"
                className={`nav-btn ${location.pathname === "/Todo" ? "active" : ""}`}
            >
                To-do List
            </Link>
        </div>
    );
};

export default Navbar;
