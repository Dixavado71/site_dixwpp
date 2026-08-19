export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tenant';
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  companyName: string;
  slug: string;
  email: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  tenantId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  tenantId: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  tenantId: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
}

export interface DashboardStats {
  totalClients?: number;
  totalProducts?: number;
  totalServices?: number;
  messagesSentToday?: number;
  messagesSentMonth?: number;
  activeCampaigns?: number;
  totalTenants?: number;
  activeTenants?: number;
  totalUsers?: number;
  recurringRevenue?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateTenantDTO {
  name: string;
  companyName: string;
  slug: string;
  email: string;
  password: string;
  plan: 'basic' | 'pro' | 'enterprise';
}

export interface UpdateTenantDTO {
  name?: string;
  companyName?: string;
  plan?: 'basic' | 'pro' | 'enterprise';
  status?: 'active' | 'inactive';
}

export interface CreateClientDTO {
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface CreatePromotionDTO {
  title: string;
  description?: string;
  discount: number;
  startDate: string;
  endDate: string;
}
