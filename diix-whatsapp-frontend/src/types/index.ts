// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tenant' | 'admin-global' | 'admin-tenant';
  tenantId?: string;
}

export interface LoginCredentials {
  email: string;
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
  plan?: 'basic' | 'standard' | 'premium' | 'enterprise';
  limits?: {
    maxUsers: number;
    maxClients: number;
    maxProducts: number;
    maxMessages: number;
  };
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
  limits?: {
    maxUsers: number;
    maxClients: number;
    maxProducts: number;
    maxMessages: number;
  };
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
  limits?: {
    maxUsers: number;
    maxClients: number;
    maxProducts: number;
    maxMessages: number;
  };
}

// Category types
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  parentId?: string | null;
  status: 'active' | 'inactive';
  order: number;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface CreateCategoryDTO {
  name: string;
  icon?: string;
  color?: string;
  parentId?: string | null;
  status?: 'active' | 'inactive';
  order?: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  icon?: string;
  color?: string;
  parentId?: string | null;
  status?: 'active' | 'inactive';
  order?: number;
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
  category?: Category;
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
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  duration: number;
  active?: boolean;
  categoryId?: string;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  active?: boolean;
  categoryId?: string;
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

// Sales types
export interface Sale {
  id: string;
  tenantId: string;
  clientId?: string;
  client?: Client;
  items: SaleItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: 'cash' | 'credit' | 'debit' | 'pix' | 'other';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId?: string;
  product?: Product;
  serviceId?: string;
  service?: Service;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateSaleDTO {
  clientId?: string;
  items: {
    productId?: string;
    serviceId?: string;
    quantity: number;
    unitPrice: number;
  }[];
  paymentMethod?: 'cash' | 'credit' | 'debit' | 'pix' | 'other';
  notes?: string;
}

// Financial types
export interface FinancialTransaction {
  id: string;
  tenantId: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  category?: string;
  notes?: string;
  saleId?: string;
  sale?: Sale;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFinancialTransactionDTO {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  dueDate: string;
  status?: 'pending' | 'paid' | 'cancelled';
  category?: string;
  notes?: string;
  saleId?: string;
}

export interface UpdateFinancialTransactionDTO {
  type?: 'income' | 'expense';
  description?: string;
  amount?: number;
  dueDate?: string;
  status?: 'pending' | 'paid' | 'cancelled';
  category?: string;
  notes?: string;
  paidDate?: string;
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
  id: string;
  general: {
    appName: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    requireTwoFactor: boolean;
    passwordMinLength: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
  integrations: {
    paymentGateway: string;
    crmIntegration: string;
    apiKeys: Record<string, string>;
  };
  appearance: {
    theme: 'dark' | 'light';
    primaryColor: string;
    logoUrl?: string;
  };
}

export interface UpdateAdminSettingsDTO {
  general?: {
    appName?: string;
    supportEmail?: string;
    maintenanceMode?: boolean;
  };
  security?: {
    sessionTimeout?: number;
    requireTwoFactor?: boolean;
    passwordMinLength?: number;
  };
  notifications?: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
  };
  integrations?: {
    paymentGateway?: string;
    crmIntegration?: string;
    apiKeys?: Record<string, string>;
  };
  appearance?: {
    theme?: 'dark' | 'light';
    primaryColor?: string;
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

// Dashboard stats types
export interface AdminDashboardStats {
  totalTenants: number;
  activeTenants: number;
  totalClients: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface SalesStats {
  totalSold: number;
  averageTicket: number;
  conversionRate: number;
  totalSales: number;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingTransactions: number;
}