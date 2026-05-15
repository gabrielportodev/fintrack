export type TokenType = {
  accessToken: string
}

export type RegisterType = {
  name: string
  email: string
}

export type UserType = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type VerifyCodeRequest = {
  email: string
  code: string
}

export type ResetPasswordRequest = {
  resetToken: string
  newPassword: string
  confirmPassword: string
}

export type ResetTokenResponse = {
  resetToken: string
}

export type MessageResponse = {
  message: string
}
