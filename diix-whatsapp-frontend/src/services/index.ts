import apiClient, { initializeCsrfToken } from './api';
export { initializeCsrfToken };
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
  CreatePromotionDTO,
  CreateUserDTO,
  UpdateUserDTO,
  TenantSettings,
  UpdateTenantSettingsDTO
} from '../types';

// Auth Services - Based on API documentation
export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Backend espera { identifier, password } conforme documentação
    const response = await apiClient.post('/login', {
      identifier: credentials.identifier,
      password: credentials.password
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/login');
      if (response.data.authenticated) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};

// Admin Services - Based on API documentation
export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // Tenants
  getTenants: async (): Promise<Tenant[]> => {
    const response = await apiClient.get('/admin/tenants');
    return response.data;
  },

  createTenant: async (data: CreateTenantDTO) => {
    const response = await apiClient.post('/admin/tenants', data);
    return response.data;
  },

  updateTenant: async (id: string, data: UpdateTenantDTO) => {
    const response = await apiClient.post(`/admin/tenants/${id}`, data);
    return response.data;
  },

  toggleTenantStatus: async (id: string) => {
    const response = await apiClient.post(`/admin/tenants/${id}/toggle`);
    return response.data;
  },

  deleteTenant: async (id: string) => {
    const response = await apiClient.post(`/admin/tenants/${id}/delete`);
    return response.data;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  createUser: async (data: CreateUserDTO) => {
    const response = await apiClient.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDTO) => {
    const response = await apiClient.post(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.post(`/admin/users/${id}/delete`);
    return response.data;
  },
};

// Tenant Services - Based on API documentation
export const tenantService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/tenant/dashboard');
    return response.data;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/tenant/products');
    return response.data;
  },

  createProduct: async (data: CreateProductDTO) => {
    const response = await apiClient.post('/tenant/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<CreateProductDTO>) => {
    const response = await apiClient.post(`/tenant/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.post(`/tenant/products/${id}/delete`);
    return response.data;
  },

  // Clients
  getClients: async (): Promise<Client[]> => {
    const response = await apiClient.get('/tenant/clients');
    return response.data;
  },

  createClient: async (data: CreateClientDTO) => {
    const response = await apiClient.post('/tenant/clients', data);
    return response.data;
  },

  updateClient: async (id: string, data: Partial<CreateClientDTO>) => {
    const response = await apiClient.post(`/tenant/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: string) => {
    const response = await apiClient.post(`/tenant/clients/${id}/delete`);
    return response.data;
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const response = await apiClient.get('/tenant/services');
    return response.data;
  },

  createService: async (data: CreateServiceDTO) => {
    const response = await apiClient.post('/tenant/services', data);
    return response.data;
  },

  updateService: async (id: string, data: Partial<CreateServiceDTO>) => {
    const response = await apiClient.post(`/tenant/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string) => {
    const response = await apiClient.post(`/tenant/services/${id}/delete`);
    return response.data;
  },

  // Promotions
  getPromotions: async (): Promise<Promotion[]> => {
    const response = await apiClient.get('/tenant/promotions');
    return response.data;
  },

  createPromotion: async (data: CreatePromotionDTO) => {
    const response = await apiClient.post('/tenant/promotions', data);
    return response.data;
  },

  updatePromotion: async (id: string, data: Partial<CreatePromotionDTO>) => {
    const response = await apiClient.post(`/tenant/promotions/${id}`, data);
    return response.data;
  },

  deletePromotion: async (id: string) => {
    const response = await apiClient.post(`/tenant/promotions/${id}/delete`);
    return response.data;
  },

  // Settings
  getSettings: async (): Promise<TenantSettings> => {
    const response = await apiClient.get('/tenant/settings');
    return response.data;
  },

  updateSettings: async (data: UpdateTenantSettingsDTO) => {
    const response = await apiClient.put('/tenant/settings', data);
    return response.data;
  },

  // Tenant Users
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/tenant/users');
    return response.data;
  },

  createUser: async (data: CreateUserDTO) => {
    const response = await apiClient.post('/tenant/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDTO) => {
    const response = await apiClient.post(`/tenant/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.post(`/tenant/users/${id}/delete`);
    return response.data;
  },
};
