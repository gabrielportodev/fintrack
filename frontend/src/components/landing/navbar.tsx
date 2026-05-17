'use client'

import { LogoIcon } from '@/components/shared/logo-icon'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Recursos', id: 'recursos' },
  { label: 'Como funciona', id: 'como-funciona' },
  { label: 'FAQ', id: 'faq' }
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const loginHref = user ? '/dashboard' : '/auth/sign-in'

  return (
    <>
      <header className='sticky top-0 z-40 border-b border-white/6 bg-[#0F1117]/78 backdrop-blur-md'>
        <div className='max-w-6xl mx-auto px-5 md:px-14 flex items-center justify-between h-[52px]'>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='flex items-center gap-2.5'>
            <LogoIcon size={26} />
            <span className='text-base font-semibold tracking-tight'>Fintrack</span>
          </button>

          <nav className='hidden md:flex items-center gap-7 text-sm text-muted-foreground'>
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className='cursor-pointer hover:text-foreground transition-colors'
              >
                {label}
              </button>
            ))}
          </nav>

          <div className='hidden md:flex items-center gap-2'>
            <Button variant='ghost' size='sm' asChild className='text-muted-foreground hover:text-foreground'>
              <Link href={loginHref}>Entrar</Link>
            </Button>
            <Button size='sm' asChild>
              <Link href='/auth/sign-up'>Começar grátis</Link>
            </Button>
          </div>

          <button
            className='md:hidden p-2 -mr-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
            onClick={() => setOpen(true)}
            aria-label='Abrir menu'
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Backdrop — fora do header para não herdar backdrop-blur */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar direita — fora do header */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#0F1117] border-l border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between px-5 h-[52px] border-b border-white/10 shrink-0'>
          <div className='flex items-center gap-2.5'>
            <LogoIcon size={22} />
            <span className='text-sm font-semibold tracking-tight'>Fintrack</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className='p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
            aria-label='Fechar menu'
          >
            <X size={20} />
          </button>
        </div>

        <nav className='flex flex-col p-3 gap-0.5 flex-1 overflow-y-auto'>
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => {
                scrollTo(id)
                setOpen(false)
              }}
              className='text-left px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer'
            >
              {label}
            </button>
          ))}
        </nav>

        <div className='p-4 border-t border-white/10 flex flex-col gap-2 shrink-0'>
          <Button variant='outline' asChild className='w-full'>
            <Link href={loginHref} onClick={() => setOpen(false)}>
              Entrar
            </Link>
          </Button>
          <Button asChild className='w-full'>
            <Link href='/auth/sign-up' onClick={() => setOpen(false)}>
              Começar grátis
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
