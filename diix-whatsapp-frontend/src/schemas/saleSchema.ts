import { z } from 'zod';

// Schema para criação de venda
export const saleCreateSchema = z.object({
  clientId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    serviceId: z.string().optional(),
    quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
    unitPrice: z.number().positive('Preço deve ser maior que zero'),
  })).min(1, 'Adicione pelo menos um item'),
  paymentMethod: z.enum(['cash', 'credit', 'debit', 'pix', 'other']).optional(),
  notes: z.string().max(500, 'Notas devem ter no máximo 500 caracteres').optional(),
});

// Schema para atualização de venda
export const saleUpdateSchema = z.object({
  clientId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    serviceId: z.string().optional(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1).optional(),
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']).optional(),
  paymentMethod: z.enum(['cash', 'credit', 'debit', 'pix', 'other']).optional(),
  notes: z.string().max(500).optional(),
});

// Schema para filtros de venda
export const saleFilterSchema = z.object({
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']).optional(),
  paymentMethod: z.enum(['cash', 'credit', 'debit', 'pix', 'other']).optional(),
  clientId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
});

export type SaleCreateFormData = z.infer<typeof saleCreateSchema>;
export type SaleUpdateFormData = z.infer<typeof saleUpdateSchema>;
export type SaleFilterFormData = z.infer<typeof saleFilterSchema>;
