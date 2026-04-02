import axios from "axios";

// Use different URLs based on environment
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://workwave-crnn.onrender.com/api'  // ← Replace with your Render backend URL
  : 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;