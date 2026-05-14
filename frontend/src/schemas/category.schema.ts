import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser um hexadecimal válido (ex: #FF5733)'),
  icon: z.string().min(1, 'Ícone é obrigatório')
})

export type CategorySchemaType = z.infer<typeof categorySchema>
