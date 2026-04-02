import axios from "axios";

// Use your Render backend URL
const API = axios.create({
  baseURL: "https://workwave-crnn.onrender.com/api",  // ← Your Render backend URL
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
    console.log("API Request:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;