import axios from "axios";
import { getToken, clearToken, SESSION_EXPIRED_EVENT } from "../utils/auth";

const api = axios.create({
  // Set VITE_API_URL in .env (or on Vercel) to point at the deployed backend
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
});

// Attach the token to every request automatically
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If the server says the token is invalid or expired, log out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && !isAuthCall && getToken()) {
      clearToken();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  }
);

// Turns any request error into a message a user can read
export const errorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request && !error.response) {
    return "Can't reach the server. Check that the backend is running.";
  }
  return fallback;
};

export default api;
