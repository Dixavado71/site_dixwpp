import axios from 'axios';
import type { 
  FinancialTransaction, CreateFinancialTransactionDTO, UpdateFinancialTransactionDTO,
  ApiResponse, PaginatedResponse, FinancialStats
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

export const financialService = {
  // Listar todas as transações (com paginação e filtros)
  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    type?: string;
    startDate?: string;
    endDate?: string;
    tenantId?: string;
    category?: string;
  }) {
    const response = await api.get<PaginatedResponse<FinancialTransaction>>('/financial', { params });
    return response.data;
  },

  // Buscar transação por ID
  async getById(id: string) {
    const response = await api.get<ApiResponse<FinancialTransaction>>(`/financial/${id}`);
    return response.data;
  },

  // Criar nova transação
  async create(data: CreateFinancialTransactionDTO) {
    const response = await api.post<ApiResponse<FinancialTransaction>>('/financial', data);
    return response.data;
  },

  // Atualizar transação existente
  async update(id: string, data: UpdateFinancialTransactionDTO) {
    const response = await api.put<ApiResponse<FinancialTransaction>>(`/financial/${id}`, data);
    return response.data;
  },

  // Excluir transação
  async delete(id: string) {
    const response = await api.delete<ApiResponse<void>>(`/financial/${id}`);
    return response.data;
  },

  // Atualizar status da transação
  async updateStatus(id: string, status: 'pending' | 'paid' | 'cancelled', paidDate?: string) {
    const response = await api.patch<ApiResponse<FinancialTransaction>>(`/financial/${id}/status`, { 
      status,
      paidDate 
    });
    return response.data;
  },

  // Conciliar transação (marcar como paga)
  async reconcile(id: string, paidDate: string) {
    const response = await api.patch<ApiResponse<FinancialTransaction>>(`/financial/${id}/reconcile`, { 
      paidDate,
      status: 'paid'
    });
    return response.data;
  },

  // Obter estatísticas financeiras
  async getStats(params?: {
    startDate?: string;
    endDate?: string;
    tenantId?: string;
  }) {
    const response = await api.get<ApiResponse<FinancialStats>>('/financial/stats', { params });
    return response.data;
  },

  // Exportar transações (CSV)
  async exportCSV(params?: Record<string, any>) {
    const response = await api.get('/financial/export/csv', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
};
