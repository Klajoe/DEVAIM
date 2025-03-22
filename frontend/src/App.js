import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"; // useLocation import edildi
import Login from "./pages/Login";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Activity from "./pages/Activity";
import Tasks from "./pages/Tasks";
import MergeRequest from "./pages/MergeRequest";
import Todo from "./pages/Todo";
import Monitoring from "./pages/Monitoring";
import CICD from "./pages/CICD";
import Navbar from "./components/Navbar";
import PullRequest from "./pages/PullRequest";

function App() {
  document.addEventListener("DOMContentLoaded", function () {
    // Mevcut event listener'larınız burada kalacak
  });

  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<WithNavbar><Home /></WithNavbar>} />
            <Route path="/members" element={<WithNavbar><Members /></WithNavbar>} />
            <Route path="/activity" element={<WithNavbar><Activity /></WithNavbar>} />
            <Route path="/tasks" element={<WithNavbar><Tasks /></WithNavbar>} />
            <Route path="/merge-request" element={<WithNavbar><MergeRequest /></WithNavbar>} />
            <Route path="/pull-request" element={<WithNavbar><PullRequest /></WithNavbar>} />
            <Route path="/monitoring" element={<WithNavbar><Monitoring /></WithNavbar>} />
            <Route path="/cicd" element={<WithNavbar><CICD /></WithNavbar>} />
            <Route path="/todo" element={<WithNavbar><Todo /></WithNavbar>} />
          </Routes>
        </div>
      </Router>
  );
}

function WithNavbar({ children }) {
  const location = useLocation(); // useLocation hook'u kullanıldı
  console.log("Current Path:", location.pathname); // Mevcut URL'yi konsola yazdır

  return (
      <>
        <Navbar />
        {children}
      </>
  );
}

export default App;