export interface User {
  id: string;
  username: string;
  email: string;
  role: 'MASTER' | 'TENANT_ADMIN' | 'TENANT_USER';
  tenantId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  document?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  slug?: string;
  stock?: number;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  tenantId: string;
  name: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  startDate: string;
  endDate: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalTenants?: number;
  activeTenants?: number;
  inactiveTenants?: number;
  totalUsers?: number;
  totalProducts?: number;
  totalClients?: number;
  totalServices?: number;
  totalPromotions?: number;
  messagesSentToday?: number;
  messagesSentMonth?: number;
  activeCampaigns?: number;
  revenue?: number;
}

export interface LoginCredentials {
  identifier: string; // username or email as per API
  password: string;
}

export interface CreateTenantDTO {
  name: string;
  document: string;
  email: string;
  phone: string;
  active?: boolean;
}

export interface UpdateTenantDTO {
  name?: string;
  document?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface CreateClientDTO {
  name: string;
  email?: string;
  phone: string;
  document?: string;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  slug?: string;
  stock?: number;
  active?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  slug?: string;
  stock?: number;
  active?: boolean;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
}

export interface CreatePromotionDTO {
  name: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  startDate: string;
  endDate: string;
  active?: boolean;
}

export interface UpdatePromotionDTO {
  name?: string;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
  role: 'TENANT_ADMIN' | 'TENANT_USER';
  tenantId?: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  role?: 'MASTER' | 'TENANT_ADMIN' | 'TENANT_USER';
  tenantId?: string | null;
}
