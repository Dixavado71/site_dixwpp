import { z } from 'zod';

// Schema para configurações gerais
export const generalSettingsSchema = z.object({
  appName: z.string().min(2, 'Nome da aplicação deve ter pelo menos 2 caracteres'),
  supportEmail: z.string().email('Email de suporte inválido'),
  maintenanceMode: z.boolean().default(false),
});

// Schema para configurações de segurança
export const securitySettingsSchema = z.object({
  sessionTimeout: z.number().int().positive('Timeout deve ser positivo').min(5, 'Mínimo de 5 minutos').max(1440, 'Máximo de 24 horas'),
  requireTwoFactor: z.boolean().default(false),
  passwordMinLength: z.number().int().min(6, 'Mínimo de 6 caracteres').max(20, 'Máximo de 20 caracteres'),
});

// Schema para configurações de notificações
export const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean().default(true),
  smsEnabled: z.boolean().default(false),
  pushEnabled: z.boolean().default(true),
});

// Schema para configurações de integrações
export const integrationSettingsSchema = z.object({
  paymentGateway: z.enum(['Stripe', 'Pagar.me', 'Mercado Pago', 'PagSeguro'], { message: 'Gateway obrigatório' }),
  crmIntegration: z.string().url('URL inválida').optional().or(z.literal('')),
  apiKeys: z.record(z.string(), z.string()).optional(),
});

// Schema para configurações de aparência
export const appearanceSettingsSchema = z.object({
  theme: z.enum(['dark', 'light'], { message: 'Tema obrigatório' }),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (use formato hex #RRGGBB)'),
  logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

// Schema completo de configurações
export const settingsSchema = z.object({
  general: generalSettingsSchema,
  security: securitySettingsSchema,
  notifications: notificationSettingsSchema,
  integrations: integrationSettingsSchema,
  appearance: appearanceSettingsSchema,
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
export type IntegrationSettingsFormData = z.infer<typeof integrationSettingsSchema>;
export type AppearanceSettingsFormData = z.infer<typeof appearanceSettingsSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
