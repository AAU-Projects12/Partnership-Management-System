import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { login } from "../api.jsx";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(null);
  const { login: loginContext } = useContext(UserContext);
  const navigate = useNavigate();

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLockoutRemaining(null);

    if (isEmailValid && isPasswordValid) {
      try {
        const response = await login({ email, password });
        const userData = response.data;
        // Look for token in response.data (typical REST API pattern)
        let token = userData?.token;
        // 2. Check if token is in response headers (common in some APIs)
        if (!token) {
          token =
            response.headers?.authorization?.replace("Bearer ", "") ||
            response.headers?.["x-auth-token"] ||
            response.headers?.["authToken"];
        }
        // Only proceed if a real token is found
        if (token && userData) {
          loginContext(userData, token);
          toast.success("Logged in successfully!");
          navigate("/partnership");
        } else {
          toast.error(
            "Login failed: No authentication token received. Please contact your administrator."
          );
          console.error(
            "Login response did not include a proper token:",
            userData
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response) {
          if (error.response.status === 400) {
            const errorData = error.response.data;
            if (errorData.remainingAttempts !== undefined) {
              toast.error(errorData.error);
              // Show remaining attempts warning
              if (errorData.remainingAttempts <= 2) {
                toast.error(`Warning: Only ${errorData.remainingAttempts} attempts remaining before account lockout!`);
              }
            } else {
              toast.error("Invalid email or password");
            }
          } else if (error.response.status === 423) {
            // Account locked
            const errorData = error.response.data;
            setLockoutRemaining(errorData.lockoutRemaining || 15);
            toast.error(errorData.error);
          } else if (error.response.status === 500) {
            toast.error("Server error. Please try again later.");
          } else {
            toast.error(error.response.data.error || "Login failed");
          }
        } else {
          toast.error("Network error. Please check your connection.");
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    email && !isEmailValid(email)
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={lockoutRemaining !== null}
                />
                {email && !isEmailValid(email) && (
                  <p className="text-red-500 text-xs mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    password && !isPasswordValid(password)
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={lockoutRemaining !== null}
                />
                {password && !isPasswordValid(password) && (
                  <p className="text-red-500 text-xs mt-1">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>
            </div>

            {lockoutRemaining !== null && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Account Locked
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Your account has been temporarily locked due to too many failed login attempts.
                        Please try again in <strong>{lockoutRemaining} minutes</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || lockoutRemaining !== null || !isEmailValid(email) || !isPasswordValid(password)}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
