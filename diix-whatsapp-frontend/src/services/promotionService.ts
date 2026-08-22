import api from '@/lib/api';
import type { Promotion, CreatePromotionDTO, UpdatePromotionDTO } from '@/types';
import type { ApiResponse } from '@/types';

export const promotionService = {
  async getAll(tenantId: string): Promise<Promotion[]> {
    const response = await api.get<ApiResponse<Promotion[]>>(`/promotions?tenantId=${tenantId}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Promotion> {
    const response = await api.get<ApiResponse<Promotion>>(`/promotions/${id}`);
    return response.data.data;
  },

  async create(data: CreatePromotionDTO): Promise<Promotion> {
    const response = await api.post<ApiResponse<Promotion>>('/promotions', data);
    return response.data.data;
  },

  async update(id: string, data: UpdatePromotionDTO): Promise<Promotion> {
    const response = await api.put<ApiResponse<Promotion>>(`/promotions/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/promotions/${id}`);
  },

  async toggleStatus(id: string): Promise<Promotion> {
    const response = await api.patch<ApiResponse<Promotion>>(`/promotions/${id}/toggle-status`);
    return response.data.data;
  },
};
