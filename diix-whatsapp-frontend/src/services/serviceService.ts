import api from '@/lib/api';
import type { Service, CreateServiceDTO, UpdateServiceDTO } from '@/types';
import type { ApiResponse } from '@/types';

export const serviceService = {
  async getAll(tenantId: string): Promise<Service[]> {
    const response = await api.get<ApiResponse<Service[]>>('/services', { params: { tenantId } });
    return response.data.data;
  },

  async getById(id: string): Promise<Service> {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data;
  },

  async create(data: CreateServiceDTO): Promise<Service> {
    const response = await api.post<ApiResponse<Service>>('/services', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateServiceDTO): Promise<Service> {
    const response = await api.put<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/services/${id}`);
  },

  async toggleStatus(id: string): Promise<Service> {
    const response = await api.patch<ApiResponse<Service>>(`/services/${id}/toggle-status`);
    return response.data.data;
  },
};
