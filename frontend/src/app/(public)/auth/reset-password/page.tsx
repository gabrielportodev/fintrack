'use client'

import { resetPasswordSchema, type ResetPasswordSchemaType } from '@/schemas/auth.schema'
import { LogoIcon } from '@/components/shared/logo-icon'
import { PasswordInput } from '@/components/ui/password-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const ResetPasswordPage = () => {
  const router = useRouter()
  const [resetToken] = useState(() =>
    typeof window !== 'undefined' ? (sessionStorage.getItem('reset_token') ?? '') : ''
  )

  useEffect(() => {
    if (!resetToken) router.replace('/auth/forgot-password')
  }, [resetToken, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' }
  })

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    try {
      const { message } = await authService.resetPassword(resetToken, data.newPassword, data.confirmPassword)
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_token')
      toast.success(message)
      router.push('/auth/sign-in')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível redefinir a senha. Tente novamente.'))
    }
  }

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4 relative'>
      <Link
        href='/auth/verify-code'
        className='absolute top-6 left-6 flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>

      <div className='w-full max-w-[360px]'>
        <div className='flex flex-col items-center gap-3 mb-8'>
          <LogoIcon />
          <span className='font-semibold text-[16px] tracking-tight'>Fintrack</span>
        </div>

        <div className='mb-6 text-center'>
          <h1 className='text-[1.3rem] font-semibold tracking-tight mb-1'>Nova senha</h1>
          <p className='text-[13.5px] text-muted-foreground'>Escolha uma senha segura para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='newPassword' className='text-[13px]'>
              Nova senha
            </Label>
            <PasswordInput
              id='newPassword'
              placeholder='Mínimo 8 caracteres'
              className='h-10 border-white/15 focus-visible:border-primary'
              {...register('newPassword')}
            />
            {errors.newPassword && <p className='text-[12px] text-destructive'>{errors.newPassword.message}</p>}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='confirmPassword' className='text-[13px]'>
              Confirmar senha
            </Label>
            <PasswordInput
              id='confirmPassword'
              placeholder='Repita a nova senha'
              className='h-10 border-white/15 focus-visible:border-primary'
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className='text-[12px] text-destructive'>{errors.confirmPassword.message}</p>}
          </div>

          <Button className='w-full h-10 mt-1' type='submit' disabled={isSubmitting || !resetToken}>
            {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
