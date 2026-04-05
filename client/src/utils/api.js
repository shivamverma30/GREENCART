import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://greencart-backend-psi-five.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
