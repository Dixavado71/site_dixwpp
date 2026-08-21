import { z } from 'zod';

// Schema para serviço (Service)
export const serviceSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  cost: z.number().nonnegative().optional(), // Custo do serviço
  duration: z.number().int().positive('Duração deve ser maior que zero').optional(), // em minutos
  categoryId: z.string().uuid('ID da categoria inválido').optional(),
  active: z.boolean().default(true),
  image: z.string().url('URL inválida').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// Schema para criação (sem ID)
export const createServiceSchema = serviceSchema;

// Schema para atualização (com ID)
export const updateServiceSchema = serviceSchema.extend({
  id: z.string().uuid('ID inválido'),
});

export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;

// Schema para filtro de serviços
export const serviceFilterSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  active: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type ServiceFilterData = z.infer<typeof serviceFilterSchema>;
