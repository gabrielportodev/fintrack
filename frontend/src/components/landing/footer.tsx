'use client'

import Link from 'next/link'
import { LogoIcon } from '@/components/shared/logo-icon'

const LINKEDIN_URL = 'https://linkedin.com/in/gabrielportodev'
const GITHUB_URL = 'https://github.com/gabrielportodev'
const PORTFOLIO_URL = 'https://gabrielporto.me'

const produto = [
  { label: 'Recursos', id: 'recursos' },
  { label: 'Como funciona', id: 'como-funciona' },
  { label: 'FAQ', id: 'faq' }
]

const contato = [
  { label: 'LinkedIn', href: LINKEDIN_URL },
  { label: 'GitHub', href: GITHUB_URL },
  { label: 'Portfólio', href: PORTFOLIO_URL }
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export const Footer = () => {
  return (
    <footer className='border-t border-border'>
      <div className='max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12'>
        <div className='md:col-span-2 flex flex-col gap-4'>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='flex items-center gap-2.5 w-fit'
          >
            <LogoIcon size={22} />
            <span className='font-semibold text-[15px]'>Fintrack</span>
          </button>
          <p className='text-[13px] text-muted-foreground leading-relaxed max-w-xs'>
            Controle financeiro pessoal simples, visual e poderoso. Acompanhe receitas, despesas e metas em um só lugar.
          </p>
          <div className='flex items-center gap-1.5 mt-1'>
            <span className='w-2 h-2 rounded-full bg-[#22C55E]' />
            <span className='text-[12px] text-muted-foreground'>Todos os sistemas operacionais</span>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='text-[12px] font-semibold text-foreground tracking-widest uppercase mb-1'>Produto</div>
          {produto.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className='cursor-pointer text-[13px] text-muted-foreground hover:text-foreground transition-colors text-left'
            >
              {label}
            </button>
          ))}
          <Link
            href='/auth/sign-up'
            className='text-[13px] text-muted-foreground hover:text-foreground transition-colors'
          >
            Criar conta
          </Link>
          <Link
            href='/auth/sign-in'
            className='text-[13px] text-muted-foreground hover:text-foreground transition-colors'
          >
            Entrar
          </Link>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='text-[12px] font-semibold text-foreground tracking-widest uppercase mb-1'>Contato</div>
          {contato.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group'
            >
              {label}
              <svg
                width='11'
                height='11'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='opacity-0 group-hover:opacity-60 transition-opacity'
              >
                <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                <polyline points='15 3 21 3 21 9' />
                <line x1='10' y1='14' x2='21' y2='3' />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <div className='border-t border-border'>
        <div className='max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-muted-foreground/60'>
          <span>© 2026 Fintrack. Todos os direitos reservados.</span>
          <span>
            Feito por{' '}
            <Link href={PORTFOLIO_URL} target='_blank' className='underline text-foreground'>
              Gabriel Porto
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
