'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LogoIcon } from '@/components/shared/logo-icon'
import { getErrorMessage, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { authService } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const COOLDOWN_SECONDS = 60
const CODE_LENGTH = 6

const VerifyCodePage = () => {
  const router = useRouter()
  const [email] = useState(() => sessionStorage.getItem('reset_email') ?? '')
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (!email) {
      router.replace('/auth/forgot-password')
      return
    }
    inputRefs.current[0]?.focus()
  }, [email, router])

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const submitCode = useCallback(
    async (code: string) => {
      if (loading) return
      setLoading(true)
      setError('')
      try {
        const result = await authService.verifyCode(email, code)
        sessionStorage.setItem('reset_token', result.resetToken)
        router.push('/auth/reset-password')
      } catch (err) {
        setError(getErrorMessage(err, 'Código inválido ou expirado.'))
        setDigits(Array(CODE_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      } finally {
        setLoading(false)
      }
    },
    [email, loading, router]
  )

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const char = value.slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    setError('')

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (char && index === CODE_LENGTH - 1) {
      const code = next.join('')
      if (code.length === CODE_LENGTH) submitCode(code)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = [...digits]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setDigits(next)
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()
    if (pasted.length === CODE_LENGTH) submitCode(pasted)
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    try {
      const { message } = await authService.forgotPassword(email)
      toast.success(message)
      setCooldown(COOLDOWN_SECONDS)
      setDigits(Array(CODE_LENGTH).fill(''))
      setError('')
      inputRefs.current[0]?.focus()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível reenviar o código.'))
    }
  }

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4 relative'>
      <Link
        href='/auth/forgot-password'
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
          <h1 className='text-[1.3rem] font-semibold tracking-tight mb-1'>Verifique seu email</h1>
          <p className='text-[13.5px] text-muted-foreground'>
            Enviamos um código de 6 dígitos para <span className='text-foreground font-medium'>{email}</span>
          </p>
        </div>

        <div className='flex gap-2 justify-center mb-4'>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => {
                inputRefs.current[i] = el
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={loading}
              className={cn(
                'w-11 h-12 text-center text-lg font-semibold rounded-md border bg-transparent outline-none transition-colors',
                'border-white/15 focus:border-primary',
                error && 'border-destructive focus:border-destructive',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            />
          ))}
        </div>

        {error && <p className='text-[12px] text-destructive text-center mb-4'>{error}</p>}

        <p className='text-center text-[13px] text-muted-foreground'>
          Não recebeu o código?{' '}
          <button
            type='button'
            onClick={handleResend}
            disabled={cooldown > 0}
            className='text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline'
          >
            {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
          </button>
        </p>

        {loading && (
          <div className='mt-4'>
            <Button className='w-full h-10' disabled>
              Verificando...
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyCodePage
