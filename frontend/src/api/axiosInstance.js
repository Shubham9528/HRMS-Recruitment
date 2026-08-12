import axios from 'axios';

// Create the axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to attach the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Read the token from localStorage (as specified for authSlice later)
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

// Response interceptor to catch 401s globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token to log the user out locally
      localStorage.removeItem('token');
      
      // Dispatch logout to Redux store if needed here in the future
      // import { store } from '../app/store';
      // import { logout } from '../features/auth/authSlice';
      // store.dispatch(logout());

      // Redirect to login page
      // Using window.location.href ensures a hard redirect that works outside of React Router context
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
