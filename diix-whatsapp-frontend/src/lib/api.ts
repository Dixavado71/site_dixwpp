import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { HTTP_STATUS } from '@/constants';

// Configuração da instância axios
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de request - adiciona token e logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adiciona token de autenticação
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logging em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptador de response - handle errors e refresh token
api.interceptors.response.use(
  (response) => {
    // Logging em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, {
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle erro 401 - não autorizado
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Tenta refresh token se ainda não tentou
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Faz request para refresh token
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          // Salva novos tokens
          localStorage.setItem('auth_token', newToken);
          localStorage.setItem('refresh_token', newRefreshToken);

          // Retry original request com novo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh falhou - logout
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('mock_user');

          // Redireciona para login
          window.location.href = '/login';

          return Promise.reject(refreshError);
        }
      }
    }

    // Handle erro 403 - forbidden
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      toast.error('Você não tem permissão para realizar esta ação');
      return Promise.reject(error);
    }

    // Handle erro 404 - not found
    if (error.response?.status === HTTP_STATUS.NOT_FOUND) {
      toast.error('Recurso não encontrado');
      return Promise.reject(error);
    }

    // Handle erro 500 - internal server error
    if (error.response?.status === HTTP_STATUS.INTERNAL_ERROR) {
      toast.error('Erro interno do servidor. Tente novamente.');
      return Promise.reject(error);
    }

    // Handle outros erros
    const errorMessage = (error.response?.data as any)?.message || 
                         error.message || 
                         'Erro ao processar requisição';

    // Não mostra toast para erros cancelados
    if (!axios.isCancel(error)) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// Exporta instância e utilitários
export default api;

// Funções utilitárias
export const getAuthToken = () => localStorage.getItem('auth_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setAuthTokens = (token: string, refreshToken: string) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('refresh_token', refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => !!getAuthToken();

// Tipos exportados
export type { AxiosInstance, AxiosError, InternalAxiosRequestConfig };
