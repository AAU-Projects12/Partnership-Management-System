// api.jsx
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7004/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signUp = (userData) => API.post("/auth/signup", userData);
export const login = (userData) => API.post("/auth/login", userData);
export const logout = () => API.post("/auth/logout");
export const createPartnership = (partnershipData, isMultipart = false) =>
  API.post("/partnership", partnershipData, isMultipart
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : undefined
  );
export const resetPassword = (data) => API.post("/auth/reset-password", data);
export const getPartnerships = (params) => API.get("/partnership", { params });
export const getPartnershipById = (id) => API.get(`/partnership/${id}`);
export const updatePartnership = (id, data) =>
  API.put(`/partnership/${id}`, data);
export const deletePartnership = (id) => API.delete(`/partnership/${id}`);

export const getUsers = () => API.get("/users");

export const addUser = (userData) => API.post("/superadmin/assign-admin", userData); // Fixed endpoint
export const updateUser = (userId, userData) =>
  API.put(`/superadmin/users/${userId}`, userData);
export const deleteUser = (userId) => API.delete(`/superadmin/users/${userId}`);