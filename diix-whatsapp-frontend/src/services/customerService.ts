import api from '@/lib/api';
import type { Client, CreateClientDTO, UpdateClientDTO } from '@/types';
import type { ApiResponse } from '@/types';

export const customerService = {
  async getAll(tenantId: string): Promise<Client[]> {
    const response = await api.get<ApiResponse<Client[]>>(`/customers?tenantId=${tenantId}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Client> {
    const response = await api.get<ApiResponse<Client>>(`/customers/${id}`);
    return response.data.data;
  },

  async create(data: CreateClientDTO): Promise<Client> {
    const response = await api.post<ApiResponse<Client>>('/customers', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateClientDTO): Promise<Client> {
    const response = await api.put<ApiResponse<Client>>(`/customers/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },

  async toggleStatus(id: string): Promise<Client> {
    const response = await api.patch<ApiResponse<Client>>(`/customers/${id}/toggle-status`);
    return response.data.data;
  },
};
