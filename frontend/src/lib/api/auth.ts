import type { UserType, RegisterType, TokenType, MessageResponse, ResetTokenResponse, ProfileType } from '@/types/auth'
import { clearTokens, setToken, setRefreshToken } from '@/lib/token'
import type { ApiResponse } from '@/types/api'
import { api } from '@/lib/api/client'

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<TokenType>>('/api/auth/login', data).then(r => {
      setToken(r.data.data.accessToken)
      setRefreshToken(r.data.data.refreshToken)
      return r.data
    }),

  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<RegisterType>>('/api/auth/register', data).then(r => r.data),

  me: () => api.get<ApiResponse<UserType>>('/api/auth/me').then(r => r.data.data),

  updateProfile: (data: { name: string; email: string }): Promise<UserType> =>
    api.put<ApiResponse<ProfileType>>('/api/auth/me', data).then(r => {
      const { accessToken, refreshToken, ...user } = r.data.data
      setToken(accessToken)
      setRefreshToken(refreshToken)
      return user
    }),

  changePassword: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<MessageResponse> =>
    api.put<ApiResponse<MessageResponse>>('/api/auth/password', data).then(r => r.data.data),

  updateAvatar: (file: File): Promise<UserType> => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .put<ApiResponse<UserType>>('/api/auth/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(r => r.data.data)
  },

  removeAvatar: (): Promise<UserType> =>
    api.delete<ApiResponse<UserType>>('/api/auth/me/avatar').then(r => r.data.data),

  logout: () => {
    clearTokens()
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
