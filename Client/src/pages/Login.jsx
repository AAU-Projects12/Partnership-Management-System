import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api";
import { toast } from "react-hot-toast";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      // alert("Logged in successfully!");
      toast.success("Logged in successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main-container bg-white w-screen min-h-screen relative overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="w-full bg-[#014166] shadow-md z-10 py-4 px-6 flex flex-col sm:flex-row items-center sm:justify-start gap-4 text-white text-sm font-bold">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope w-4 h-4"></i>
          <span>Email: vpsci@aau.edu.et</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-phone w-4 h-4"></i>
          <span>+251-118-278433 or +251-111-239706</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        {/* Image*/}
        <div className="relative bg-[#014166] w-full lg:w-1/2 h-[450px] lg:h-auto rounded-br-[300px] overflow-hidden">
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-04/fncovdvbMG.png"
            alt="background"
            className="absolute top-0 left-0 w-full h-full object-cover z-10 opacity-70"
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 text-center relative z-20">
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-04/DXFCdgcvP5.png"
            alt="logo"
            className="w-20 mb-4"
          />
          <h1 className="text-2xl lg:text-3xl font-bold text-black">
            Addis Ababa University
          </h1>
          <p className="text-lg font-medium mt-2">
            PARTNERSHIP MANAGEMENT SYSTEM
          </p>
          <p className="text-[#00578a] mt-4 text-lg">Super Admin Login</p>
          <p className="text-gray-500 mt-2 max-w-md">
            Welcome to the Addis Ababa University Partnership Management System
          </p>

          {/* Input Fields */}
          <form
            onSubmit={handleLogin}
            className="mt-6 w-full max-w-sm flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-[#00588b] rounded-full px-4 py-3 placeholder:text-sm placeholder:text-gray-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              className="border-2 border-[#00588b] rounded-full px-4 py-3 placeholder:text-sm placeholder:text-gray-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button className="flex items-center justify-center bg-[#00588b] text-white px-6 py-3 mt-6 rounded-full gap-2 hover:bg-[#004a75] transition">
              Login
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-04/YvWR34sXt7.png"
                alt="arrow"
                className="w-5 h-5"
              />
            </button>
          </form>
          <p className=" mt-4 text-lg">
            Don't have an account?{" "}
            <Link
              className="text-[#00578a] underline hover:no-underline"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Logos*/}
      <div className="w-full bg-white shadow-md py-6 flex flex-wrap justify-center items-center gap-4 mt-auto px-4">
        {[
          "y0rhtHirob",
          "BXaR8XHk0C",
          "k5PGxTCs0F",
          "HQOmE5SR2A",
          "LW3kEYvpAu",
          "mqbonTYqtm",
          "9yAtzXbiMi",
          "tyAQkk5rfp",
          "3AJeb17BFE",
        ].map((imgId, index) => (
          <img
            key={index}
            src={`https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-04/${imgId}.png`}
            alt={`logo-${index}`}
            className="h-16 w-auto"
          />
        ))}
      </div>
    </div>
  );
}
