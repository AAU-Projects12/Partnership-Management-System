import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api" //backend url
})

export const signUp = (userData) => API.post('/auth/signup' , userData);
export const login = (userData) => API.post('/auth/login' , userData);