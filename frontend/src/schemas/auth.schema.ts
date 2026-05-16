import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

const strongPassword = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Deve ter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Deve ter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Deve ter pelo menos um número')

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: strongPassword
})

export type LoginSchemaType = z.infer<typeof loginSchema>
export type RegisterSchemaType = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido')
})

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Código deve ter 6 dígitos')
    .regex(/^\d{6}$/, 'Código deve conter apenas números')
})

export const resetPasswordSchema = z
  .object({
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
export type VerifyCodeSchemaType = z.infer<typeof verifyCodeSchema>
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
