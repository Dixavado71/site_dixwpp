import { z } from 'zod';

// Schema para cliente (Client) - sem .default() para compatibilidade com useForm
// Nota: Client no types/index.ts tem: id, name, phone, email?, document?, tenantId, createdAt, updatedAt
export const customerCreateSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 caracteres'),
  document: z.string().optional().or(z.literal('')),
});

export type CustomerCreateFormData = z.infer<typeof customerCreateSchema>;

// Schema para atualização
export const customerUpdateSchema = customerCreateSchema.extend({
  id: z.string().uuid('ID inválido'),
});

export type CustomerUpdateFormData = z.infer<typeof customerUpdateSchema>;
