import type { ApiResponse } from '@/types/api'
import type { GoalType } from '@/types/goal'
import { api } from '@/lib/api/client'

export const goalService = {
  getByMonth: (month: number, year: number) =>
    api.get<ApiResponse<GoalType[]>>('/api/goals', { params: { month, year } }).then(r => r.data),

  create: (data: { name: string; limitAmount: number; month: number; year: number; categoryId: string }) =>
    api.post<ApiResponse<GoalType>>('/api/goals', data).then(r => r.data),

  update: (id: string, data: { name: string; limitAmount: number; month: number; year: number; categoryId: string }) =>
    api.put<ApiResponse<GoalType>>(`/api/goals/${id}`, data).then(r => r.data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/api/goals/${id}`).then(r => r.data)
}
