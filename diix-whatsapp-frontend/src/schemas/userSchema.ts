import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.enum(['super_admin', 'admin'], { message: 'Role inválido' }),
  tenantId: z.string().optional(),
  status: z.enum(['active', 'inactive'], { message: 'Status inválido' }),
})

export type UserFormData = z.infer<typeof userSchema>
