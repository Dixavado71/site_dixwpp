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
  email: string;
  phone: string;
  document: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total?: number;
  active?: number;
  inactive?: number;
  totalUsers?: number;
  products?: number;
  clients?: number;
  services?: number;
  promotions?: number;
  users?: number;
  messagesSentToday?: number;
  messagesSentMonth?: number;
  activeCampaigns?: number;
}

export interface LoginCredentials {
  identifier: string; // Pode ser username ou email conforme API
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
  email: string;
  phone: string;
  document: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  slug: string;
}

export interface CreateServiceDTO {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface CreatePromotionDTO {
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
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
