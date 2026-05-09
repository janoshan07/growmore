import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
// Only use VITE_API_URL if it's a real URL (starts with http or /)
// Guards against accidentally pasting key=value strings in the Vercel dashboard
const BASE_URL =
  rawApiUrl && (rawApiUrl.startsWith('http') || rawApiUrl === '/api')
    ? rawApiUrl
    : 'https://growmore-08vn.onrender.com/api';

/**
 * Axios instance pre-configured with base URL and JWT auth interceptor
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 — token expired / invalid → force logout
    if (status === 401) {
      localStorage.removeItem('gm_token');
      localStorage.removeItem('gm_user');
      window.location.href = '/login';
    }

    // 502 / 503 / 504 — Render free tier is waking up
    if (status === 502 || status === 503 || status === 504 || !error.response) {
      // Attach a friendly message so the catch block in each page can use it
      error.friendlyMessage =
        '⏳ Server is waking up (free tier). Please wait ~30 seconds and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
