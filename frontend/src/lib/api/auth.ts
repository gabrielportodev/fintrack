import type { UserType, RegisterType, TokenType, MessageResponse, ResetTokenResponse } from '@/types/auth'
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
  },

  forgotPassword: (email: string): Promise<MessageResponse> =>
    api.post<ApiResponse<MessageResponse>>('/api/auth/forgot-password', { email }).then(r => r.data.data),

  verifyCode: (email: string, code: string): Promise<ResetTokenResponse> =>
    api.post<ApiResponse<ResetTokenResponse>>('/api/auth/verify-code', { email, code }).then(r => r.data.data),

  resetPassword: (resetToken: string, newPassword: string, confirmPassword: string): Promise<MessageResponse> =>
    api
      .post<ApiResponse<MessageResponse>>('/api/auth/reset-password', { resetToken, newPassword, confirmPassword })
      .then(r => r.data.data)
}
