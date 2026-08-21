import { z } from 'zod';

// Schema para criação de transação financeira
export const transactionCreateSchema = z.object({
  type: z.enum(['income', 'expense'], { message: 'Tipo é obrigatório' }),
  description: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  amount: z.number().positive('Valor deve ser maior que zero'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)'),
  status: z.enum(['pending', 'paid', 'cancelled', 'overdue']).default('pending'),
  category: z.string().optional(),
  notes: z.string().max(500, 'Notas devem ter no máximo 500 caracteres').optional(),
  saleId: z.string().optional(),
});

// Schema para atualização de transação financeira
export const transactionUpdateSchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  description: z.string().min(3).optional(),
  amount: z.number().positive().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['pending', 'paid', 'cancelled', 'overdue']).optional(),
  category: z.string().optional(),
  notes: z.string().max(500).optional(),
  paidDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// Schema para filtros de transações financeiras
export const transactionFilterSchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  status: z.enum(['pending', 'paid', 'cancelled', 'overdue']).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
});

// Schema para conciliação financeira
export const reconcileSchema = z.object({
  transactionId: z.string().uuid('ID de transação inválido'),
  paidDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)'),
  paidAmount: z.number().positive('Valor pago deve ser maior que zero'),
  notes: z.string().max(500).optional(),
});

export type TransactionCreateFormData = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdateFormData = z.infer<typeof transactionUpdateSchema>;
export type TransactionFilterFormData = z.infer<typeof transactionFilterSchema>;
export type ReconcileFormData = z.infer<typeof reconcileSchema>;
