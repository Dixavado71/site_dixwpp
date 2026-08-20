import apiClient, { fetchCsrfToken } from './api';
export { initializeCsrfToken } from './api';
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
  UpdateClientDTO,
  CreateProductDTO,
  UpdateProductDTO,
  CreateServiceDTO,
  UpdateServiceDTO,
  CreatePromotionDTO,
  UpdatePromotionDTO,
  CreateUserDTO,
  UpdateUserDTO
} from '../types';

// Auth Services - Based on API documentation
export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Passo 1: Obter cookie de sessão e token CSRF antes do login
    // Isso é crucial para a validação CSRF funcionar corretamente
    await fetchCsrfToken();
    
    // Passo 2: Enviar login com o token CSRF (adicionado automaticamente pelo interceptor)
    // API endpoint: POST /api/v1/auth/login
    const response = await apiClient.post('/api/v1/auth/login', {
      username: credentials.identifier,
      password: credentials.password
    });
    return response.data;
  },

  logout: async () => {
    // API endpoint: POST /api/v1/auth/logout
    const response = await apiClient.post('/api/v1/auth/logout');
    return response.data;
  },

  checkAuthStatus: async () => {
    // API endpoint: GET /api/v1/auth/login - Check authentication status
    const response = await apiClient.get('/api/v1/auth/login');
    return response.data;
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/api/v1/auth/login');
      if (response.data.authenticated && response.data.user) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};

// Admin Services - Based on API documentation
// All endpoints follow the pattern: /api/v1/admin/*
export const adminService = {
  // Dashboard - GET /api/v1/admin/dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/api/v1/admin/dashboard');
    return response.data;
  },

  // Tenants - All endpoints: /api/v1/admin/tenants/*
  getTenants: async (): Promise<Tenant[]> => {
    const response = await apiClient.get('/api/v1/admin/tenants');
    return response.data;
  },

  createTenant: async (data: CreateTenantDTO) => {
    const response = await apiClient.post('/api/v1/admin/tenants', data);
    return response.data;
  },

  updateTenant: async (id: string, data: UpdateTenantDTO) => {
    const response = await apiClient.post(`/api/v1/admin/tenants/${id}`, data);
    return response.data;
  },

  toggleTenantStatus: async (id: string) => {
    const response = await apiClient.post(`/api/v1/admin/tenants/${id}/toggle`);
    return response.data;
  },

  deleteTenant: async (id: string) => {
    const response = await apiClient.post(`/api/v1/admin/tenants/${id}/delete`);
    return response.data;
  },

  // Users - All endpoints: /api/v1/admin/users/*
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/v1/admin/users');
    return response.data;
  },

  createUser: async (data: CreateUserDTO) => {
    const response = await apiClient.post('/api/v1/admin/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDTO) => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/delete`);
    return response.data;
  },
};

// Tenant Services - Based on API documentation
// All endpoints follow the pattern: /api/v1/tenant/*
export const tenantService = {
  // Dashboard - GET /api/v1/tenant/dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/api/v1/tenant/dashboard');
    return response.data;
  },

  // Products - All endpoints: /api/v1/tenant/products/*
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/api/v1/tenant/products');
    return response.data;
  },

  createProduct: async (data: CreateProductDTO) => {
    const response = await apiClient.post('/api/v1/tenant/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: UpdateProductDTO) => {
    const response = await apiClient.post(`/api/v1/tenant/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.post(`/api/v1/tenant/products/${id}/delete`);
    return response.data;
  },

  // Clients - All endpoints: /api/v1/tenant/clients/*
  getClients: async (): Promise<Client[]> => {
    const response = await apiClient.get('/api/v1/tenant/clients');
    return response.data;
  },

  createClient: async (data: CreateClientDTO) => {
    const response = await apiClient.post('/api/v1/tenant/clients', data);
    return response.data;
  },

  updateClient: async (id: string, data: UpdateClientDTO) => {
    const response = await apiClient.post(`/api/v1/tenant/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: string) => {
    const response = await apiClient.post(`/api/v1/tenant/clients/${id}/delete`);
    return response.data;
  },

  // Services - All endpoints: /api/v1/tenant/services/*
  getServices: async (): Promise<Service[]> => {
    const response = await apiClient.get('/api/v1/tenant/services');
    return response.data;
  },

  createService: async (data: CreateServiceDTO) => {
    const response = await apiClient.post('/api/v1/tenant/services', data);
    return response.data;
  },

  updateService: async (id: string, data: UpdateServiceDTO) => {
    const response = await apiClient.post(`/api/v1/tenant/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string) => {
    const response = await apiClient.post(`/api/v1/tenant/services/${id}/delete`);
    return response.data;
  },

  // Promotions - All endpoints: /api/v1/tenant/promotions/*
  getPromotions: async (): Promise<Promotion[]> => {
    const response = await apiClient.get('/api/v1/tenant/promotions');
    return response.data;
  },

  createPromotion: async (data: CreatePromotionDTO) => {
    const response = await apiClient.post('/api/v1/tenant/promotions', data);
    return response.data;
  },

  updatePromotion: async (id: string, data: UpdatePromotionDTO) => {
    const response = await apiClient.post(`/api/v1/tenant/promotions/${id}`, data);
    return response.data;
  },

  deletePromotion: async (id: string) => {
    const response = await apiClient.post(`/api/v1/tenant/promotions/${id}/delete`);
    return response.data;
  },

  // Tenant Users - All endpoints: /api/v1/tenant/users/*
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/v1/tenant/users');
    return response.data;
  },

  createUser: async (data: CreateUserDTO) => {
    const response = await apiClient.post('/api/v1/tenant/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDTO) => {
    const response = await apiClient.post(`/api/v1/tenant/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.post(`/api/v1/tenant/users/${id}/delete`);
    return response.data;
  },
};
