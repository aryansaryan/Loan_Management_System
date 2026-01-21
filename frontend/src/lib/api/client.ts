import axios from "axios";

/** Shared Axios instance used for all API calls. */
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE_URL,
});

/** Injects JWT token into Authorization header when available. */
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
