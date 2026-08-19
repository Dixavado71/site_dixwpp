import apiClient, { initializeCsrfToken } from './api';
import type { 
  User, 
  Tenant, 
  Client, 
  Product, 
  Service, 
  Promotion, 
  DashboardStats,
  LoginCredentials,
  CreateTenantDTO,
  UpdateTenantDTO,
  CreateClientDTO,
  CreateProductDTO,
  CreateServiceDTO,
  CreatePromotionDTO 
} from '../types';

// Auth Services
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Admin Services
export const adminService = {
  // Tenants
  getTenants: async (page = 1, limit = 10, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    const response = await apiClient.get(`/admin/tenants?${params}`);
    return response.data;
  },
  
  getTenant: async (id: string) => {
    const response = await apiClient.get(`/admin/tenants/${id}`);
    return response.data;
  },
  
  createTenant: async (data: CreateTenantDTO) => {
    const response = await apiClient.post('/admin/tenants', data);
    return response.data;
  },
  
  updateTenant: async (id: string, data: UpdateTenantDTO) => {
    const response = await apiClient.put(`/admin/tenants/${id}`, data);
    return response.data;
  },
  
  deleteTenant: async (id: string) => {
    const response = await apiClient.delete(`/admin/tenants/${id}`);
    return response.data;
  },
  
  toggleTenantStatus: async (id: string) => {
    const response = await apiClient.patch(`/admin/tenants/${id}/status`);
    return response.data;
  },
  
  resetTenantPassword: async (id: string, newPassword: string) => {
    const response = await apiClient.post(`/admin/tenants/${id}/reset-password`, { password: newPassword });
    return response.data;
  },
  
  // Users
  getUsers: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await apiClient.get(`/admin/users?${params}`);
    return response.data;
  },
  
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
  
  getTenantGrowth: async (days = 30) => {
    const response = await apiClient.get(`/admin/dashboard/tenant-growth?days=${days}`);
    return response.data;
  },
};

// Tenant Services
export const tenantService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/tenant/dashboard');
    return response.data;
  },
  
  getMessagesChart: async (days = 30) => {
    const response = await apiClient.get(`/tenant/dashboard/messages-chart?days=${days}`);
    return response.data;
  },
  
  // Clients
  getClients: async (page = 1, limit = 10, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    const response = await apiClient.get(`/tenant/clients?${params}`);
    return response.data;
  },
  
  getClient: async (id: string) => {
    const response = await apiClient.get(`/tenant/clients/${id}`);
    return response.data;
  },
  
  createClient: async (data: CreateClientDTO) => {
    const response = await apiClient.post('/tenant/clients', data);
    return response.data;
  },
  
  updateClient: async (id: string, data: Partial<CreateClientDTO>) => {
    const response = await apiClient.put(`/tenant/clients/${id}`, data);
    return response.data;
  },
  
  deleteClient: async (id: string) => {
    const response = await apiClient.delete(`/tenant/clients/${id}`);
    return response.data;
  },
  
  // Products
  getProducts: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await apiClient.get(`/tenant/products?${params}`);
    return response.data;
  },
  
  getProduct: async (id: string) => {
    const response = await apiClient.get(`/tenant/products/${id}`);
    return response.data;
  },
  
  createProduct: async (data: CreateProductDTO) => {
    const response = await apiClient.post('/tenant/products', data);
    return response.data;
  },
  
  updateProduct: async (id: string, data: Partial<CreateProductDTO>) => {
    const response = await apiClient.put(`/tenant/products/${id}`, data);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/tenant/products/${id}`);
    return response.data;
  },
  
  // Services
  getServices: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await apiClient.get(`/tenant/services?${params}`);
    return response.data;
  },
  
  getService: async (id: string) => {
    const response = await apiClient.get(`/tenant/services/${id}`);
    return response.data;
  },
  
  createService: async (data: CreateServiceDTO) => {
    const response = await apiClient.post('/tenant/services', data);
    return response.data;
  },
  
  updateService: async (id: string, data: Partial<CreateServiceDTO>) => {
    const response = await apiClient.put(`/tenant/services/${id}`, data);
    return response.data;
  },
  
  deleteService: async (id: string) => {
    const response = await apiClient.delete(`/tenant/services/${id}`);
    return response.data;
  },
  
  // Promotions
  getPromotions: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await apiClient.get(`/tenant/promotions?${params}`);
    return response.data;
  },
  
  getPromotion: async (id: string) => {
    const response = await apiClient.get(`/tenant/promotions/${id}`);
    return response.data;
  },
  
  createPromotion: async (data: CreatePromotionDTO) => {
    const response = await apiClient.post('/tenant/promotions', data);
    return response.data;
  },
  
  updatePromotion: async (id: string, data: Partial<CreatePromotionDTO>) => {
    const response = await apiClient.put(`/tenant/promotions/${id}`, data);
    return response.data;
  },
  
  deletePromotion: async (id: string) => {
    const response = await apiClient.delete(`/tenant/promotions/${id}`);
    return response.data;
  },
  
  // Settings
  updateProfile: async (data: { name?: string; companyName?: string }) => {
    const response = await apiClient.put('/tenant/settings/profile', data);
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post('/tenant/settings/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  },
};
