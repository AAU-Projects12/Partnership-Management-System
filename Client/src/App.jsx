import React from "react";
import "./index.css";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PartnershipDashboard from "./partnership.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Users from "./pages/users.jsx";
import AddPartnership from "./pages/add-partnership.jsx";


export default function Main() {
  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#014166",
            color: "#fff",
          },
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/partnership" element={<PartnershipDashboard />} />
          <Route path="/add-partnership" element={<AddPartnership />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Dashboard />} />
          <Route path="/profile" element={<Dashboard />} />
          
        </Routes>
      </Router>
    </>
  );
}
