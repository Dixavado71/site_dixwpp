import axios from 'axios';
import type { 
  Tenant, CreateTenantDTO, UpdateTenantDTO,
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

export const tenantService = {
  // Listar todos os tenants (com paginação e filtros)
  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    search?: string;
    plan?: string;
  }) {
    const response = await api.get<PaginatedResponse<Tenant>>('/tenants', { params });
    return response.data;
  },

  // Buscar tenant por ID
  async getById(id: string) {
    const response = await api.get<ApiResponse<Tenant>>(`/tenants/${id}`);
    return response.data;
  },

  // Criar novo tenant
  async create(data: CreateTenantDTO) {
    const response = await api.post<ApiResponse<Tenant>>('/tenants', data);
    return response.data;
  },

  // Atualizar tenant existente
  async update(id: string, data: UpdateTenantDTO) {
    const response = await api.put<ApiResponse<Tenant>>(`/tenants/${id}`, data);
    return response.data;
  },

  // Excluir tenant
  async delete(id: string) {
    const response = await api.delete<ApiResponse<void>>(`/tenants/${id}`);
    return response.data;
  },

  // Suspender/Ativar tenant
  async toggleStatus(id: string) {
    const response = await api.patch<ApiResponse<Tenant>>(`/tenants/${id}/toggle-status`);
    return response.data;
  },

  // Atualizar plano do tenant
  async updatePlan(id: string, plan: 'basic' | 'standard' | 'premium' | 'enterprise') {
    const response = await api.patch<ApiResponse<Tenant>>(`/tenants/${id}/plan`, { plan });
    return response.data;
  },

  // Atualizar limites do tenant
  async updateLimits(id: string, limits: { 
    maxUsers: number; 
    maxClients: number; 
    maxProducts: number; 
    maxMessages: number;
  }) {
    const response = await api.patch<ApiResponse<Tenant>>(`/tenants/${id}/limits`, { limits });
    return response.data;
  },

  // Obter estatísticas do tenant
  async getStats(id: string) {
    const response = await api.get<ApiResponse<any>>(`/tenants/${id}/stats`);
    return response.data;
  },
};
