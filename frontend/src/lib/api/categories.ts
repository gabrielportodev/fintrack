import type { CategoryType } from '@/types/category'
import type { ApiResponse } from '@/types/api'
import { api } from '@/lib/api/client'

export const categoryService = {
  getAll: () => api.get<ApiResponse<CategoryType[]>>('/api/categories').then(r => r.data),

  getById: (id: string) => api.get<ApiResponse<CategoryType>>(`/api/categories/${id}`).then(r => r.data),

  create: (data: { name: string; color: string; icon: string }) =>
    api.post<ApiResponse<CategoryType>>('/api/categories', data).then(r => r.data),

  update: (id: string, data: { name: string; color: string; icon: string }) =>
    api.put<ApiResponse<CategoryType>>(`/api/categories/${id}`, data).then(r => r.data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/api/categories/${id}`).then(r => r.data)
}
