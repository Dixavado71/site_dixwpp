import { z } from 'zod';

// Schema para promoção (Promotion) - sem .default() para compatibilidade com useForm
export const promotionCreateSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed'], { message: 'Tipo deve ser "percentage" ou "fixed"' }),
  value: z.number().positive('Valor deve ser maior que zero'),
  productIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data de início inválida'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data de fim inválida').optional(),
  status: z.enum(['active', 'inactive']).optional(),
  usageLimit: z.number().int().positive().optional(),
  code: z.string().optional(),
  minimumPurchase: z.number().nonnegative().optional(),
});

export type PromotionCreateFormData = z.infer<typeof promotionCreateSchema>;

// Schema para atualização
export const promotionUpdateSchema = promotionCreateSchema.extend({
  id: z.string().uuid('ID inválido'),
});

export type PromotionUpdateFormData = z.infer<typeof promotionUpdateSchema>;

// Schema base para promoção completa (com ID e timestamps)
export const promotionSchema = promotionCreateSchema.extend({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  usedCount: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Promotion = z.infer<typeof promotionSchema>;

// Schema para filtro de promoções
export const promotionFilterSchema = z.object({
  name: z.string().optional(),
  type: z.enum(['percentage', 'fixed']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type PromotionFilterData = z.infer<typeof promotionFilterSchema>;
