import { z } from 'zod';

// Schema para categorias
export const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']),
  order: z.number().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Schema para tenants
export const tenantSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  businessName: z.string().optional(),
  document: z.string().min(11, 'Documento inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  slug: z.string().optional(),
  active: z.boolean().default(true),
  plan: z.enum(['basic', 'standard', 'premium', 'enterprise']).optional(),
  limits: z.object({
    maxUsers: z.number().int().positive(),
    maxClients: z.number().int().positive(),
    maxProducts: z.number().int().positive(),
    maxMessages: z.number().int().positive(),
  }).optional(),
});

export type TenantFormData = z.infer<typeof tenantSchema>;

// Schema para usuários
export const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  role: z.enum(['admin', 'tenant', 'admin-global', 'admin-tenant']),
  tenantId: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

// Schema para produtos
export const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  stock: z.number().int().nonnegative().optional(),
  active: z.boolean().default(true),
  categoryId: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Schema para vendas
export const saleSchema = z.object({
  clientId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    serviceId: z.string().optional(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1, 'Adicione pelo menos um item'),
  paymentMethod: z.enum(['cash', 'credit', 'debit', 'pix', 'other']).optional(),
  notes: z.string().optional(),
});

export type SaleFormData = z.infer<typeof saleSchema>;

// Schema para transações financeiras
export const financialTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  amount: z.number().positive('Valor deve ser maior que zero'),
  dueDate: z.string(),
  status: z.enum(['pending', 'paid', 'cancelled']),
  category: z.string().optional(),
  notes: z.string().optional(),
  saleId: z.string().optional(),
});

export type FinancialTransactionFormData = z.infer<typeof financialTransactionSchema>;

// Schema para configurações de admin
export const adminSettingsSchema = z.object({
  general: z.object({
    appName: z.string().min(2, 'Nome da aplicação é obrigatório'),
    supportEmail: z.string().email('Email de suporte inválido'),
    maintenanceMode: z.boolean(),
  }),
  security: z.object({
    sessionTimeout: z.number().int().positive(),
    requireTwoFactor: z.boolean(),
    passwordMinLength: z.number().int().min(6).max(20),
  }),
  notifications: z.object({
    emailEnabled: z.boolean(),
    smsEnabled: z.boolean(),
    pushEnabled: z.boolean(),
  }),
  integrations: z.object({
    paymentGateway: z.string(),
    crmIntegration: z.string(),
    apiKeys: z.record(z.string()).optional(),
  }),
  appearance: z.object({
    theme: z.enum(['dark', 'light']),
    primaryColor: z.string(),
    logoUrl: z.string().optional(),
  }),
});

export type AdminSettingsFormData = z.infer<typeof adminSettingsSchema>;
