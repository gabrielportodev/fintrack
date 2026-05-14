import { TransactionTypeEnum } from '@/types/transaction'
import { z } from 'zod'

export const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number({ error: 'Valor deve ser um número' }).positive('Valor deve ser positivo'),
  type: z.nativeEnum(TransactionTypeEnum, { error: 'Tipo inválido' }),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().uuid('Categoria inválida')
})

export type TransactionSchemaType = z.infer<typeof transactionSchema>
