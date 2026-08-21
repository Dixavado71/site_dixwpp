import { z } from 'zod';

// Schema para cliente (Customer) - sem .default() para compatibilidade com useForm
export const customerCreateSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 caracteres'),
  document: z.string().min(11, 'CPF/CNPJ inválido').optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, 'UF deve ter 2 caracteres').optional(),
    zipCode: z.string().min(8, 'CEP inválido').optional(),
  }).optional(),
  notes: z.string().optional(),
});

export type CustomerCreateFormData = z.infer<typeof customerCreateSchema>;

// Schema para atualização
export const customerUpdateSchema = customerCreateSchema.extend({
  id: z.string().uuid('ID inválido'),
});

export type CustomerUpdateFormData = z.infer<typeof customerUpdateSchema>;

// Schema base para cliente completo (com ID e timestamps)
export const customerSchema = customerCreateSchema.extend({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Customer = z.infer<typeof customerSchema>;

// Schema para filtro de clientes
export const customerFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
  city: z.string().optional(),
});

export type CustomerFilterData = z.infer<typeof customerFilterSchema>;
