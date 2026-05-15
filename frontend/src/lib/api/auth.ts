import type { UserType, RegisterType, TokenType } from '@/types/auth'
import { clearToken, setToken } from '@/lib/token'
import type { ApiResponse } from '@/types/api'
import { api } from '@/lib/api/client'

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<TokenType>>('/api/auth/login', data).then(r => {
      setToken(r.data.data.accessToken)
      return r.data
    }),

  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<RegisterType>>('/api/auth/register', data).then(r => r.data),

  me: () => api.get<ApiResponse<UserType>>('/api/auth/me').then(r => r.data.data),

  logout: () => {
    clearToken()
    window.location.href = '/auth/sign-in'
  }
}
