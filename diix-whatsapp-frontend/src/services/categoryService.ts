import axios from 'axios';
import type { 
  Category, CreateCategoryDTO, UpdateCategoryDTO,
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

export const categoryService = {
  // Listar todas as categorias (com paginação e filtros)
  async getAll(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const response = await api.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },

  // Buscar categoria por ID
  async getById(id: string) {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  // Criar nova categoria
  async create(data: CreateCategoryDTO) {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  // Atualizar categoria existente
  async update(id: string, data: UpdateCategoryDTO) {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  // Excluir categoria
  async delete(id: string) {
    const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },

  // Reordenar categorias (drag-and-drop)
  async reorder(ids: string[]) {
    const response = await api.patch<ApiResponse<void>>('/categories/reorder', { ids });
    return response.data;
  },

  // Atualizar status da categoria
  async toggleStatus(id: string) {
    const response = await api.patch<ApiResponse<Category>>(`/categories/${id}/toggle-status`);
    return response.data;
  },
};
