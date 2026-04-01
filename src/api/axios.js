import axios from "axios";

const API = axios.create({
  // start from here to call backend API
  baseURL: "http://localhost:3000/api"
});

// interceptors : get token from local storage and add it to headers of each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
