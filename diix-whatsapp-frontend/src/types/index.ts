// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tenant';
  tenantId?: string;
  isActive?: boolean;
  lastLogin?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

// Tenant types
export interface Tenant {
  id: string;
  name: string;
  businessName?: string;
  slug?: string;
  document: string;
  email: string;
  phone: string;
  active: boolean;
  plan: 'basic' | 'standard' | 'premium' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantDTO {
  name: string;
  businessName?: string;
  document: string;
  slug?: string;
  email: string;
  phone?: string;
  password?: string;
  active?: boolean;
  plan?: 'basic' | 'standard' | 'premium' | 'enterprise';
}

export interface UpdateTenantDTO {
  name?: string;
  businessName?: string;
  document?: string;
  slug?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  plan?: 'basic' | 'standard' | 'premium' | 'enterprise';
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
  stock?: number;
  slug?: string;
  active: boolean;
  tenantId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  active?: boolean;
  categoryId?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  active?: boolean;
  categoryId?: string;
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

// Category types
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
  order: number;
  active: boolean;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
  order?: number;
  active?: boolean;
  tenantId?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  order?: number;
  active?: boolean;
}

// Sales/Transaction types
export interface Sale {
  id: string;
  tenantId: string;
  clientId: string;
  clientName: string;
  items: SaleItem[];
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'pix' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId?: string;
  serviceName?: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateSaleDTO {
  clientId: string;
  items: {
    productId?: string;
    serviceName?: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'pix' | 'bank_transfer';
}

// Financial types
export interface FinancialTransaction {
  id: string;
  tenantId: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFinancialTransactionDTO {
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentMethod?: string;
}

export interface UpdateFinancialTransactionDTO {
  type?: 'income' | 'expense';
  category?: string;
  description?: string;
  amount?: number;
  status?: 'pending' | 'paid' | 'cancelled';
  dueDate?: string;
  paidDate?: string;
  paymentMethod?: string;
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

// Admin Settings types
export interface AdminSettings {
  general: {
    siteName: string;
    supportEmail: string;
    maxTenants: number;
  };
  security: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
  integrations: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    whatsappEnabled: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    logoUrl?: string;
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
  error?: string;
  errors?: Record<string, string[]>;
}