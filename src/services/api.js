import axios from "axios";
import { navigateTo } from "./navigation/navigationRef";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// List of endpoints that do NOT require authentication
const PUBLIC_AUTH_ENDPOINTS = [
  "auth/login-via-password",
  "auth/signup",
  "auth/forgot-password",     // add others as needed
  // "/auth/verify-email",
  // etc.
];

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
      config.url?.startsWith(endpoint) || config.url?.includes(endpoint)
    ); 

    if (isPublicAuthRequest) {
      return config;
    }

    if (!token?.trim()) {
      const noAuthError = new Error("No authentication token available");
      noAuthError.isAuthError = true;
      noAuthError.status = 401;
      navigateTo("/register");           // or "/login" — your choice
      return Promise.reject(noAuthError);
    }

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (originalRequest.url?.includes("/auth/get-access-token")) {
      navigateTo("/register");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        const refreshResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}auth/get-access-token`,
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.accessToken;

        sessionStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        navigateTo("/register");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;