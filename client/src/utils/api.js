import axios from 'axios';

// Create a single configured instance of axios
const api = axios.create({
  // Use VITE_API_URL if set (production), otherwise fallback to empty string (proxied to server in dev)
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Request interceptor to automatically attach authorization header if JWT token is stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
