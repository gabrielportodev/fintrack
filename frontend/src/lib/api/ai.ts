import type { TransactionTypeEnum } from '@/types/transaction'
import type { ApiResponse } from '@/types/api'
import { api } from '@/lib/api/client'

export type CategorySuggestion = {
  categoryId: string | null
  categoryName: string | null
  confidence: number
}

export const aiService = {
  suggestCategory: (data: { description: string; amount: number; type: TransactionTypeEnum }) =>
    api.post<ApiResponse<CategorySuggestion>>('/api/ai/suggest-category', data).then(r => r.data),

  ask: (pergunta: string) => api.post<ApiResponse<string>>('/api/ai/consulta', { pergunta }).then(r => r.data)
}
