import api from './api';
import type { 
  User, 
  LoginCredentials, 
  Tenant, 
  CreateTenantDTO, 
  UpdateTenantDTO,
  Client,
  CreateClientDTO,
  UpdateClientDTO,
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  Service,
  CreateServiceDTO,
  UpdateServiceDTO,
  Promotion,
  CreatePromotionDTO,
  UpdatePromotionDTO,
  TenantSettings,
  UpdateTenantSettingsDTO,
  ApiResponse,
  PaginatedResponse 
} from '../types';

// Auth Service
export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('csrf_token');
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }
};

// Admin Service
export const adminService = {
  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<{ totalTenants: number; totalClients: number; activeTenants: number }>> {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Tenants CRUD
  async getTenants(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Tenant>>> {
    const response = await api.get(`/admin/tenants?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getTenant(id: string): Promise<ApiResponse<Tenant>> {
    const response = await api.get(`/admin/tenants/${id}`);
    return response.data;
  },

  async createTenant(data: CreateTenantDTO): Promise<ApiResponse<Tenant>> {
    const response = await api.post('/admin/tenants', data);
    return response.data;
  },

  async updateTenant(id: string, data: UpdateTenantDTO): Promise<ApiResponse<Tenant>> {
    const response = await api.put(`/admin/tenants/${id}`, data);
    return response.data;
  },

  async deleteTenant(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/admin/tenants/${id}`);
    return response.data;
  },

  async toggleTenantStatus(id: string): Promise<ApiResponse<Tenant>> {
    const response = await api.patch(`/admin/tenants/${id}/toggle-status`);
    return response.data;
  },

  // Clients (Admin view)
  async getClients(tenantId: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Client>>> {
    const response = await api.get(`/admin/tenants/${tenantId}/clients?page=${page}&limit=${limit}`);
    return response.data;
  }
};

// Tenant Service
export const tenantService = {
  // Profile
  async getProfile(): Promise<ApiResponse<Tenant>> {
    const response = await api.get('/tenant/profile');
    return response.data;
  },

  async updateProfile(data: Partial<Tenant>): Promise<ApiResponse<Tenant>> {
    const response = await api.put('/tenant/profile', data);
    return response.data;
  },

  // Settings
  async getSettings(): Promise<ApiResponse<TenantSettings>> {
    const response = await api.get('/tenant/settings');
    return response.data;
  },

  async updateSettings(data: UpdateTenantSettingsDTO): Promise<ApiResponse<TenantSettings>> {
    const response = await api.put('/tenant/settings', data);
    return response.data;
  },

  // Dashboard stats for tenant
  async getDashboardStats(): Promise<ApiResponse<{ totalClients: number; totalProducts: number; totalServices: number; appointmentsToday: number }>> {
    const response = await api.get('/tenant/dashboard');
    return response.data;
  },

  // Clients CRUD
  async getClients(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Client>>> {
    const response = await api.get(`/tenant/clients?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getClient(id: string): Promise<ApiResponse<Client>> {
    const response = await api.get(`/tenant/clients/${id}`);
    return response.data;
  },

  async createClient(data: CreateClientDTO): Promise<ApiResponse<Client>> {
    const response = await api.post('/tenant/clients', data);
    return response.data;
  },

  async updateClient(id: string, data: UpdateClientDTO): Promise<ApiResponse<Client>> {
    const response = await api.put(`/tenant/clients/${id}`, data);
    return response.data;
  },

  async deleteClient(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/tenant/clients/${id}`);
    return response.data;
  },

  // Products CRUD
  async getProducts(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const response = await api.get(`/tenant/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await api.get(`/tenant/products/${id}`);
    return response.data;
  },

  async createProduct(data: CreateProductDTO): Promise<ApiResponse<Product>> {
    const response = await api.post('/tenant/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: UpdateProductDTO): Promise<ApiResponse<Product>> {
    const response = await api.put(`/tenant/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/tenant/products/${id}`);
    return response.data;
  },

  // Services CRUD
  async getServices(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Service>>> {
    const response = await api.get(`/tenant/services?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getService(id: string): Promise<ApiResponse<Service>> {
    const response = await api.get(`/tenant/services/${id}`);
    return response.data;
  },

  async createService(data: CreateServiceDTO): Promise<ApiResponse<Service>> {
    const response = await api.post('/tenant/services', data);
    return response.data;
  },

  async updateService(id: string, data: UpdateServiceDTO): Promise<ApiResponse<Service>> {
    const response = await api.put(`/tenant/services/${id}`, data);
    return response.data;
  },

  async deleteService(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/tenant/services/${id}`);
    return response.data;
  },

  // Promotions CRUD
  async getPromotions(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Promotion>>> {
    const response = await api.get(`/tenant/promotions?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPromotion(id: string): Promise<ApiResponse<Promotion>> {
    const response = await api.get(`/tenant/promotions/${id}`);
    return response.data;
  },

  async createPromotion(data: CreatePromotionDTO): Promise<ApiResponse<Promotion>> {
    const response = await api.post('/tenant/promotions', data);
    return response.data;
  },

  async updatePromotion(id: string, data: UpdatePromotionDTO): Promise<ApiResponse<Promotion>> {
    const response = await api.put(`/tenant/promotions/${id}`, data);
    return response.data;
  },

  async deletePromotion(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/tenant/promotions/${id}`);
    return response.data;
  }
};

// Initialize CSRF Token
export const initializeCsrfToken = async (): Promise<void> => {
  try {
    // Faz uma requisição GET para obter o token CSRF do backend
    // O backend deve definir o cookie XSRF-TOKEN nesta requisição
    await api.get('/csrf-token');
    
    // Após a requisição, o cookie XSRF-TOKEN deve estar definido
    // O interceptor de request já vai pegá-lo automaticamente
    console.log('CSRF token initialized from cookie');
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
    // Se falhar, tentamos continuar sem o token (depende da configuração do backend)
  }
};