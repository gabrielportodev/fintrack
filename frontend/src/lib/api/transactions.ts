import type { MonthlySummaryType, TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import type { ApiResponse } from '@/types/api'
import { api } from '@/lib/api/client'

export const transactionService = {
  getAll: () => api.get<ApiResponse<TransactionType[]>>('/api/transactions').then(r => r.data),

  getByMonth: (month: number, year: number) =>
    api
      .get<ApiResponse<TransactionType[]>>('/api/transactions/month', {
        params: { month, year }
      })
      .then(r => r.data),

  getById: (id: string) => api.get<ApiResponse<TransactionType>>(`/api/transactions/${id}`).then(r => r.data),

  create: (data: {
    description: string
    amount: number
    type: TransactionTypeEnum
    date: string
    categoryId: string
  }) => api.post<ApiResponse<TransactionType>>('/api/transactions', data).then(r => r.data),

  update: (
    id: string,
    data: { description: string; amount: number; type: TransactionTypeEnum; date: string; categoryId: string }
  ) => api.put<ApiResponse<TransactionType>>(`/api/transactions/${id}`, data).then(r => r.data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/api/transactions/${id}`).then(r => r.data),

  getSummary: (month: number, year: number) =>
    api
      .get<ApiResponse<MonthlySummaryType>>('/api/transactions/summary', {
        params: { month, year }
      })
      .then(r => r.data)
}
