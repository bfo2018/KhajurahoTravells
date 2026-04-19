import axios from "axios";
import { apiBaseUrl } from "../utils/apiBaseUrl";

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("khajuraho_token");

  config.headers["ngrok-skip-browser-warning"] = "true";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    const isExpiredSession =
      error.response?.status === 401 &&
      ["User not found", "Invalid token", "Authentication required"].includes(message);

    if (isExpiredSession) {
      localStorage.removeItem("khajuraho_token");
      localStorage.removeItem("khajuraho_user");
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  }
);

export default api;
