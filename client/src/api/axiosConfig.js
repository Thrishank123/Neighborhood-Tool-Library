import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Axios interceptor - Token from localStorage:", token ? "Present" : "Missing");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Axios interceptor - Authorization header set");
  } else {
    console.log("Axios interceptor - No token found, no Authorization header set");
  }
  return config;
});

export default api;
