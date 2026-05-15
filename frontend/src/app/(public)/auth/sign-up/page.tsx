'use client'

import { registerSchema, type RegisterSchemaType } from '@/schemas/auth.schema'
import { GoogleIcon } from '@/components/shared/google-icon'
import { LogoIcon } from '@/components/shared/logo-icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/utils'
import { authService } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const SignUpPage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      await authService.register(data)
      toast.success('Conta criada com sucesso!', { description: 'Faça login para continuar.' })
      router.push('/auth/sign-in')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível criar a conta. Tente novamente.'))
    }
  }

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4 relative'>
      <Link
        href='/'
        className='absolute top-6 left-6 flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft size={14} />
        Início
      </Link>

      <div className='w-full max-w-[360px]'>
        <div className='flex flex-col items-center gap-3 mb-8'>
          <LogoIcon />
          <span className='font-semibold text-[16px] tracking-tight'>Fintrack</span>
        </div>

        <div className='mb-6 text-center'>
          <h1 className='text-[1.3rem] font-semibold tracking-tight mb-1'>Criar sua conta</h1>
          <p className='text-[13.5px] text-muted-foreground'>Grátis para sempre. Sem cartão de crédito.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='name' className='text-[13px]'>
              Nome completo
            </Label>
            <Input
              id='name'
              type='text'
              placeholder='Seu nome'
              className='h-10 border-white/15 focus-visible:border-primary'
              {...register('name')}
            />
            {errors.name && <p className='text-[12px] text-destructive'>{errors.name.message}</p>}
          </div>

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
            <Label htmlFor='password' className='text-[13px]'>
              Senha
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='Mínimo 6 caracteres'
              className='h-10 border-white/15 focus-visible:border-primary'
              {...register('password')}
            />
            {errors.password && <p className='text-[12px] text-destructive'>{errors.password.message}</p>}
          </div>

          <Button className='w-full h-10 mt-1' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta grátis'}
          </Button>
        </form>

        <div className='relative my-5'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-white/8' />
          </div>
          <div className='relative flex justify-center text-[11px] uppercase tracking-widest'>
            <span className='bg-background px-3 text-muted-foreground/50'>ou</span>
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full h-10 gap-2.5 border-white/15 hover:border-white/25 bg-transparent hover:bg-white/4'
          type='button'
        >
          <GoogleIcon />
          <span className='text-[13.5px]'>Continuar com Google</span>
        </Button>

        <p className='text-center text-[13px] text-muted-foreground mt-6'>
          Já tem uma conta?{' '}
          <Link href='/auth/sign-in' className='text-primary hover:underline font-medium'>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage
