// import axios from "axios";
// import { navigateTo } from "./navigation/navigationRef";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
//   withCredentials: true,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // List of endpoints that do NOT require authentication
// const PUBLIC_AUTH_ENDPOINTS = [
//   "auth/login-via-password",
//   "auth/signup",
//   "auth/forgot-password",     // add others as needed
//   // "/auth/verify-email",
//   // etc.
// ];

// api.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("token");

//     const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
//       config.url?.startsWith(endpoint) || config.url?.includes(endpoint)
//     ); 

//     if (isPublicAuthRequest) {
//       return config;
//     }

//     if (!token?.trim()) {
//       const noAuthError = new Error("No authentication token available");
//       noAuthError.isAuthError = true;
//       noAuthError.status = 401;
//       navigateTo("/register");           // or "/login" — your choice
//       return Promise.reject(noAuthError);
//     }

//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (!originalRequest) return Promise.reject(error);

//     if (originalRequest.url?.includes("/auth/get-access-token")) {
//       navigateTo("/register");
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {

//         const refreshResponse = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}auth/get-access-token`,
//           { withCredentials: true }
//         );

//         const newToken = refreshResponse.data.accessToken;

//         sessionStorage.setItem("token", newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         return api(originalRequest);
//       } catch (refreshError) {
//         navigateTo("/register");
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import { createApiEngine, applyDelay } from 'axios-engine'; // ← adjust import path/name
// or if it's your local lib: import { createApiEngine } from '@/lib/api-engine';

import { navigateTo } from "./navigation/navigationRef";

// List of endpoints that do NOT require authentication
const PUBLIC_AUTH_ENDPOINTS = [
  "auth/login-via-password",
  "auth/signup",
  "auth/forgot-password",
  // add more as needed, e.g. "auth/verify-email", "auth/reset-password"
];

export const api = createApiEngine({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  applyDelay: applyDelay(),
  // ── Token management ─────────────────────────────────────────────────────
  getToken: () => sessionStorage.getItem("token")?.trim() ?? null,

  // ── Refresh logic (called automatically on 401) ──────────────────────────
  refreshToken: async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/"}auth/get-access-token`,
        { credentials: "include" } // important: sends cookies
      );

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      const newToken = data.accessToken;

      if (!newToken) throw new Error("No access token in refresh response");

      sessionStorage.setItem("token", newToken);
      return newToken;
    } catch (err) {
      console.warn("Token refresh failed", err);
      return null; // ← returning null → triggers onLogout
    }
  },

  // ── Called when refresh fails or refreshToken returns null ───────────────
  onLogout: () => {
    sessionStorage.removeItem("token");
    navigateTo("/register"); // or "/login" — your preference
  },

  // ── Optional: retry network failures (not token errors) ──────────────────
  retry: 1, // or 2–3 if you want

  // ── Logging & delay (useful in dev / testing) ────────────────────────────
  // enableLogging: import.meta.env.DEV,
  // responseDelay: import.meta.env.DEV ? 800 : 0,          // artificial delay

  // ── Extra axios defaults if needed ───────────────────────────────────────
  axiosConfig: {
    withCredentials: true,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  },
});

// Optional: Add request interceptor for public endpoints check
// (the engine already handles Authorization header via getToken, but we skip injection for public routes)
api.getAxiosInstance().interceptors.request.use((config) => {
  const url = config.url || "";

  const isPublic = PUBLIC_AUTH_ENDPOINTS.some((ep) =>
    url.startsWith(ep) || url.includes(`/${ep}`)
  );

  if (isPublic) {
    // Remove Authorization header if accidentally present
    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
  }

  return config;
});

// ── Export the typed methods (same shape as before) ────────────────────────
export default api;