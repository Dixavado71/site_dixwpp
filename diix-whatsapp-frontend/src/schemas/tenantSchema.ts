import { z } from 'zod';

// Schema para criação de tenant (todos os campos obrigatórios exceto onde especificado)
export const tenantCreateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  businessName: z.string().optional(),
  document: z.string().min(11, 'Documento inválido').regex(/^\d{11,14}$/, 'CNPJ/CPF inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido').regex(/^\d{10,11}$/, 'Telefone inválido'),
  slug: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  active: z.boolean().default(true),
  plan: z.enum(['basic', 'standard', 'premium', 'enterprise']).default('standard'),
  limits: z.object({
    maxUsers: z.number().int().positive().default(15),
    maxClients: z.number().int().positive().default(500),
    maxProducts: z.number().int().positive().default(1000),
    maxMessages: z.number().int().positive().default(10000),
  }).optional(),
});

// Schema para atualização de tenant
export const tenantUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  businessName: z.string().optional(),
  document: z.string().min(11).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  slug: z.string().optional(),
  active: z.boolean().optional(),
  plan: z.enum(['basic', 'standard', 'premium', 'enterprise']).optional(),
  limits: z.object({
    maxUsers: z.number().int().positive().optional(),
    maxClients: z.number().int().positive().optional(),
    maxProducts: z.number().int().positive().optional(),
    maxMessages: z.number().int().positive().optional(),
  }).optional(),
});

// Schema para plano do tenant
export const tenantPlanSchema = z.object({
  plan: z.enum(['basic', 'standard', 'premium', 'enterprise'], { message: 'Plano obrigatório' }),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)'),
});

// Schema para limites do tenant
export const tenantLimitsSchema = z.object({
  maxUsers: z.number().int().min(1, 'Mínimo de 1 usuário').max(1000, 'Máximo de 1000 usuários'),
  maxClients: z.number().int().min(1, 'Mínimo de 1 cliente').max(100000, 'Máximo de 100000 clientes'),
  maxProducts: z.number().int().min(1, 'Mínimo de 1 produto').max(50000, 'Máximo de 50000 produtos'),
  maxMessages: z.number().int().min(100, 'Mínimo de 100 mensagens').max(1000000, 'Máximo de 1000000 mensagens'),
});

export type TenantCreateFormData = z.infer<typeof tenantCreateSchema>;
export type TenantUpdateFormData = z.infer<typeof tenantUpdateSchema>;
export type TenantPlanFormData = z.infer<typeof tenantPlanSchema>;
export type TenantLimitsFormData = z.infer<typeof tenantLimitsSchema>;
