import { z } from 'zod';

// Schema para cliente (Customer)
export const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
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
  active: z.boolean().default(true),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// Schema para criação (sem ID)
export const createCustomerSchema = customerSchema;

// Schema para atualização (todos os campos opcionais exceto ID)
export const updateCustomerSchema = customerSchema.extend({
  id: z.string().uuid('ID inválido'),
});

export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;

// Schema para filtro de clientes
export const customerFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
  city: z.string().optional(),
});

export type CustomerFilterData = z.infer<typeof customerFilterSchema>;
