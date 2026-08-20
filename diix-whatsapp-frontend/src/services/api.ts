import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import type { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for CSRF token and auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const csrfToken = localStorage.getItem('csrf_token');
    const authToken = localStorage.getItem('auth_token');

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear tokens and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('csrf_token');
      window.location.href = '/login';
    }

    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;