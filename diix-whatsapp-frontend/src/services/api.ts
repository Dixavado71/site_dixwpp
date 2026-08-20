import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import type { ApiError } from '../types';

// Base URL correta conforme documentação oficial: http://localhost:7171/api/v1
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7171/api/v1';

// Função auxiliar para obter token CSRF do cookie
const getCsrfTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  // Tenta XSRF-TOKEN (padrão NestJS) ou xsrf-token (variação)
  const match = document.cookie.match(/(?:^|; )(?:XSRF-TOKEN|xsrf-token)=([^;]*)/i);
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
  async (config: InternalAxiosRequestConfig) => {
    // Obtém o token CSRF do cookie XSRF-TOKEN (definido automaticamente pelo backend)
    let csrfToken = getCsrfTokenFromCookie();

    // Se não encontrou token e é uma requisição que modifica dados (POST, PUT, DELETE, PATCH)
    // Faz uma requisição GET simples para forçar o backend a gerar o cookie XSRF-TOKEN
    if (!csrfToken && config.method && ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
      try {
        // Requisição "sonda" para a raiz da API para receber o cookie XSRF-TOKEN
        await axios.get(API_URL.replace('/api/v1', ''), {
          withCredentials: true,
        });
        // Tenta ler o token novamente após a requisição
        csrfToken = getCsrfTokenFromCookie();
      } catch (error) {
        console.warn('Não foi possível obter token CSRF inicial via sonda:', error);
      }
    }

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