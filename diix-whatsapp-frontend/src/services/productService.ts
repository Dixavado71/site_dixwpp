import api from '@/lib/api';
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/types';
import type { ApiResponse } from '@/types';

export const productService = {
  async getAll(tenantId: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(`/products?tenantId=${tenantId}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  async create(data: CreateProductDTO): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async toggleStatus(id: string): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`/products/${id}/toggle-status`);
    return response.data.data;
  },
};
