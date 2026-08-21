import { z } from 'zod';

// Schema para promoção (Promotion)
export const promotionSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed'], {
    errorMap: () => ({ message: 'Tipo deve ser "percentage" ou "fixed"' }),
  }),
  value: z.number().positive('Valor deve ser maior que zero'),
  products: z.array(z.string().uuid()).optional(), // IDs dos produtos aplicáveis
  services: z.array(z.string().uuid()).optional(), // IDs dos serviços aplicáveis
  startDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Data de início inválida'
  ),
  endDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Data de fim inválida'
  ).optional(),
  active: z.boolean().default(true),
  usageLimit: z.number().int().positive().optional(), // Limite de usos
  usedCount: z.number().int().nonnegative().default(0), // Contagem de usos
  code: z.string().optional(), // Código promocional
  minimumPurchase: z.number().nonnegative().optional(), // Compra mínima para aplicar
});

export type PromotionFormData = z.infer<typeof promotionSchema>;

// Schema para criação (sem ID)
export const createPromotionSchema = promotionSchema;

// Schema para atualização (com ID)
export const updatePromotionSchema = promotionSchema.extend({
  id: z.string().uuid('ID inválido'),
});

export type UpdatePromotionFormData = z.infer<typeof updatePromotionSchema>;

// Schema para filtro de promoções
export const promotionFilterSchema = z.object({
  name: z.string().optional(),
  type: z.enum(['percentage', 'fixed']).optional(),
  active: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type PromotionFilterData = z.infer<typeof promotionFilterSchema>;
