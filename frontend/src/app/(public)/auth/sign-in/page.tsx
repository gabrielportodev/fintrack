'use client'

import { loginSchema, type LoginSchemaType } from '@/schemas/auth.schema'
import { LogoIcon } from '@/components/shared/logo-icon'
import { PasswordInput } from '@/components/ui/password-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const SignInPage = () => {
  const { login, user } = useAuth()
  const router = useRouter()

  if (user) {
    router.replace('/dashboard')
    return null
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await login(data)
      toast.success(response.message)
      router.push('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível fazer login. Tente novamente.'))
    }
  }

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4 relative'>
      <div className='w-full max-w-[360px]'>
        <div className='flex flex-col items-center gap-3 mb-8'>
          <LogoIcon />
          <span className='font-semibold text-[16px] tracking-tight'>Fintrack</span>
        </div>

        <div className='mb-6 text-center'>
          <h1 className='text-[1.3rem] font-semibold tracking-tight mb-1'>Bem-vindo de volta</h1>
          <p className='text-[13.5px] text-muted-foreground'>Insira suas credenciais para continuar.</p>
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

          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password' className='text-[13px]'>
                Senha
              </Label>
              <Link href='/auth/forgot-password' className='text-[12px] text-primary hover:underline'>
                Esqueceu a senha?
              </Link>
            </div>
            <PasswordInput
              id='password'
              placeholder='••••••••'
              className='h-10 border-white/15 focus-visible:border-primary'
              {...register('password')}
            />
            {errors.password && <p className='text-[12px] text-destructive'>{errors.password.message}</p>}
          </div>

          <Button className='w-full h-10 mt-1' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar na conta'}
          </Button>
        </form>

        <p className='text-center text-[13px] text-muted-foreground mt-6'>
          Não tem uma conta?{' '}
          <Link href='/auth/sign-up' className='text-primary hover:underline font-medium'>
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignInPage
