'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const items = [
  {
    q: 'O Fintrack é realmente gratuito?',
    a: 'Sim. O plano gratuito cobre todas as funcionalidades essenciais: transações ilimitadas, categorias personalizadas, metas mensais e relatórios básicos. Sem cartão, sem cobranças surpresa.'
  },
  {
    q: 'Meus dados financeiros estão seguros?',
    a: 'Todos os dados são armazenados com criptografia em repouso e em trânsito. Nunca compartilhamos suas informações com terceiros e você pode exportar ou deletar tudo a qualquer momento.'
  },
  {
    q: 'Preciso conectar minha conta bancária?',
    a: 'Não. O Fintrack é um sistema de registro manual — você tem controle total sobre o que entra e o que não entra. Sem integração com bancos, sem tokens de acesso à sua conta.'
  },
  {
    q: 'Posso usar em mais de um dispositivo?',
    a: 'Sim. A conta é sincronizada e funciona em qualquer navegador. Basta entrar com seu e-mail e senha.'
  },
  {
    q: 'Como funcionam as metas mensais?',
    a: 'Você define um valor limite por categoria e por mês. O Fintrack calcula automaticamente quanto você já gastou naquela categoria e exibe o progresso com alertas visuais quando estiver se aproximando do limite.'
  },
  {
    q: 'Posso exportar os relatórios?',
    a: 'Sim. Na tela de Relatórios, você pode exportar um PDF com o resumo do período selecionado, incluindo gráficos e tabelas por categoria.'
  }
]

export const Faq = () => {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className='py-24 border-t border-border'>
      <div className='max-w-3xl mx-auto px-6'>
        <div className='text-center mb-14'>
          <div className='text-xs font-semibold text-primary tracking-widest uppercase mb-3'>FAQ</div>
          <h2 className='text-[2rem] font-semibold tracking-tight'>Perguntas frequentes</h2>
        </div>

        <div className='flex flex-col divide-y divide-border'>
          {items.map(({ q, a }, i) => (
            <div key={i} className='py-5'>
              <button
                className='w-full flex items-center justify-between gap-4 text-left group'
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className='font-medium text-[15px] group-hover:text-primary transition-colors'>{q}</span>
                <span className='shrink-0 w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary'>
                  {open === i ? <Minus size={13} /> : <Plus size={13} />}
                </span>
              </button>
              {open === i && <p className='mt-3 text-[14px] text-muted-foreground leading-relaxed pr-11'>{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
