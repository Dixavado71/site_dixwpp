import axios from 'axios';
import type { 
  Sale, CreateSaleDTO, UpdateSaleDTO,
  ApiResponse, PaginatedResponse, SalesStats
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

export const saleService = {
  // Listar todas as vendas (com paginação e filtros)
  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    search?: string;
    startDate?: string;
    endDate?: string;
    tenantId?: string;
  }) {
    const response = await api.get<PaginatedResponse<Sale>>('/sales', { params });
    return response.data;
  },

  // Buscar venda por ID
  async getById(id: string) {
    const response = await api.get<ApiResponse<Sale>>(`/sales/${id}`);
    return response.data;
  },

  // Criar nova venda
  async create(data: CreateSaleDTO) {
    const response = await api.post<ApiResponse<Sale>>('/sales', data);
    return response.data;
  },

  // Atualizar venda existente
  async update(id: string, data: UpdateSaleDTO) {
    const response = await api.put<ApiResponse<Sale>>(`/sales/${id}`, data);
    return response.data;
  },

  // Excluir venda
  async delete(id: string) {
    const response = await api.delete<ApiResponse<void>>(`/sales/${id}`);
    return response.data;
  },

  // Atualizar status da venda
  async updateStatus(id: string, status: 'pending' | 'completed' | 'cancelled') {
    const response = await api.patch<ApiResponse<Sale>>(`/sales/${id}/status`, { status });
    return response.data;
  },

  // Obter estatísticas de vendas
  async getStats(params?: {
    startDate?: string;
    endDate?: string;
    tenantId?: string;
  }) {
    const response = await api.get<ApiResponse<SalesStats>>('/sales/stats', { params });
    return response.data;
  },

  // Exportar vendas (CSV)
  async exportCSV(params?: Record<string, any>) {
    const response = await api.get('/sales/export/csv', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
};
