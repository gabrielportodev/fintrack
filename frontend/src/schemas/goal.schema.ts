import { z } from 'zod'

export const goalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  limitAmount: z.number({ error: 'Limite deve ser um número' }).positive('Limite deve ser positivo'),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  categoryId: z.string().uuid('Categoria inválida')
})

export type GoalSchemaType = z.infer<typeof goalSchema>
