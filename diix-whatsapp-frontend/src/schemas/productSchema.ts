import { z } from 'zod';

// Schema para produto (Product) - sem .default() para compatibilidade com useForm
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  cost: z.number().min(0, 'Custo não pode ser negativo').optional(),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo').optional(),
  categoryId: z.string().min(1, 'Categoria obrigatória').optional(),
  sku: z.string().min(1, 'SKU obrigatório').optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type ProductCreateFormData = z.infer<typeof productCreateSchema>;

// Schema para atualização
export const productUpdateSchema = productCreateSchema.extend({
  id: z.string().uuid('ID inválido'),
});

export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;

// Schema base para produto completo (com ID e timestamps)
export const productSchema = productCreateSchema.extend({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;

// Schema para filtro de produtos
export const productFilterSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type ProductFilterData = z.infer<typeof productFilterSchema>;
