import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import type { ApiError } from '../types';

// Base URL correta conforme documentação oficial: http://localhost:7171/api/v1
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7171/api/v1';

// Função auxiliar para obter token CSRF do cookie
const getCsrfTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para cookies de sessão
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for CSRF token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtém o token CSRF do cookie XSRF-TOKEN (definido automaticamente pelo backend)
    const csrfToken = getCsrfTokenFromCookie();

    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
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
      // Sessão expirada ou inválida - redirect para login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Erro CSRF - recarregar página para obter novo token
      console.error('Erro CSRF: Token inválido ou ausente. Recarregue a página.');
      window.location.reload();
    }

    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;