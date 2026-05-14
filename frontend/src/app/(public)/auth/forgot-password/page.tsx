import { LogoIcon } from '@/components/shared/logo-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const ForgotPasswordPage = () => {
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
          <p className='text-[13.5px] text-muted-foreground'>
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='email' className='text-[13px]'>
              E-mail
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='seu@email.com'
              className='h-10 border-white/15 focus-visible:border-primary'
            />
          </div>

          <Button className='w-full h-10 mt-1'>Enviar link de redefinição</Button>
        </div>

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
