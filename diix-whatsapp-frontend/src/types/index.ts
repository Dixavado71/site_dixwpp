// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tenant';
  tenantId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Tenant types
export interface Tenant {
  id: string;
  businessName: string;
  slug: string;
  document: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantDTO {
  businessName: string;
  document: string;
  slug: string;
  email: string;
  password: string;
}

export interface UpdateTenantDTO {
  businessName?: string;
  document?: string;
  slug?: string;
  active?: boolean;
}

// Client types
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  document?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDTO {
  name: string;
  phone: string;
  email?: string;
  document?: string;
}

export interface UpdateClientDTO {
  name?: string;
  phone?: string;
  email?: string;
  document?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  active?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  active?: boolean;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  active: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  duration: number;
  active?: boolean;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  active?: boolean;
}

// Promotion types
export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount: number;
  startDate: string;
  endDate: string;
  active: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionDTO {
  title: string;
  description?: string;
  discount: number;
  startDate: string;
  endDate: string;
  active?: boolean;
}

export interface UpdatePromotionDTO {
  title?: string;
  description?: string;
  discount?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

// Settings types
export interface TenantSettings {
  id: string;
  tenantId: string;
  businessName: string;
  whatsappNumber: string;
  timezone: string;
  notificationPreferences: {
    newAppointment: boolean;
    appointmentReminder: boolean;
    promotionExpiring: boolean;
    marketingMessages: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTenantSettingsDTO {
  businessName?: string;
  whatsappNumber?: string;
  timezone?: string;
  notificationPreferences?: {
    newAppointment?: boolean;
    appointmentReminder?: boolean;
    promotionExpiring?: boolean;
    marketingMessages?: boolean;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}