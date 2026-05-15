'use client'

import { forgotPasswordSchema, type ForgotPasswordSchemaType } from '@/schemas/auth.schema'
import { LogoIcon } from '@/components/shared/logo-icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const ForgotPasswordPage = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  })

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      await authService.forgotPassword(data.email)
      sessionStorage.setItem('reset_email', data.email)
      toast.success('Código enviado para seu email')
      router.push('/auth/verify-code')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível enviar o código. Tente novamente.'))
    }
  }

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4 relative'>
      <Link
        href='/auth/sign-in'
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
          <h1 className='text-[1.3rem] font-semibold tracking-tight mb-1'>Esqueceu a senha?</h1>
          <p className='text-[13.5px] text-muted-foreground'>Informe seu e-mail e enviaremos um código de 6 dígitos.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='email' className='text-[13px]'>
              E-mail
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='seu@email.com'
              className='h-10 border-white/15 focus-visible:border-primary'
              {...register('email')}
            />
            {errors.email && <p className='text-[12px] text-destructive'>{errors.email.message}</p>}
          </div>

          <Button className='w-full h-10 mt-1' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar código'}
          </Button>
        </form>

        <p className='text-center text-[13px] text-muted-foreground mt-6'>
          Lembrou a senha?{' '}
          <Link href='/auth/sign-in' className='text-primary hover:underline font-medium'>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
