// src/api/axios.ts
import axios from "axios";

// Cliente axios configurado
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", // 👈 tu backend en Render
  withCredentials: false,
});

// 🔑 Interceptor para incluir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;