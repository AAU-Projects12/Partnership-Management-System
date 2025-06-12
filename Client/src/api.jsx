import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7004/api", // Ensure this matches your backend
});

// Add request interceptor to include auth token in requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true; // Ensure cookies are sent if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const signUp = (userData) => API.post("/auth/signup", userData);
export const login = (userData) => API.post("/auth/login", userData);
export const logout = () => API.post("/auth/logout");

// Partnership endpoints
export const createPartnership = (partnershipData) =>
  API.post("/partnership", partnershipData);

// User management endpoints
export const getUsers = () => API.get("/users");
// export const addUser = (userData) => API.post("/superadmin/assign-user", userData);
// api.js
export const addUser = (userData) => API.post("/superadmin/assign-user", userData);
export const updateUser = (userId, userData) =>
  API.put(`/superadmin/users/${userId}`, userData);
export const deleteUser = (userId) => API.delete(`/superadmin/users/${userId}`);