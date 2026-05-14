'use client'

import { LogoIcon } from '@/components/shared/logo-icon'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const navLinks = [
  { label: 'Recursos', id: 'recursos' },
  { label: 'Como funciona', id: 'como-funciona' },
  { label: 'FAQ', id: 'faq' }
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export const Navbar = () => {
  return (
    <header className='sticky top-0 z-50 border-b border-white/6 bg-[#0F1117]/78 backdrop-blur-md'>
      <div className='max-w-6xl mx-auto px-14 flex items-center justify-between h-[52px]'>
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
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' asChild className='text-muted-foreground hover:text-foreground'>
            <Link href='/auth/sign-in'>Entrar</Link>
          </Button>
          <Button size='sm' asChild>
            <Link href='/auth/sign-up'>Começar grátis</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
