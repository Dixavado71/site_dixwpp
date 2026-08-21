import axios from 'axios';
import type {
  User, CreateUserDTO, UpdateUserDTO,
  ApiResponse, PaginatedResponse
} from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // Listar todos os usuários (com paginação e filtros)
  async getAll(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    status?: string;
  }) {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  // Buscar usuário por ID
  async getById(id: string) {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // Criar novo usuário
  async create(data: CreateUserDTO) {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  // Atualizar usuário existente
  async update(id: string, data: UpdateUserDTO) {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  // Excluir usuário
  async delete(id: string) {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  // Suspender/Ativar usuário
  async toggleStatus(id: string) {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return response.data;
  },
};
