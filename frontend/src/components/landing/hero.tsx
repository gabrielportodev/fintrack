import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const mockCards = [
  { label: 'Saldo', value: 'R$ 12.840', color: 'text-primary' },
  { label: 'Receitas', value: 'R$ 10.350', color: 'text-[#22C55E]' },
  { label: 'Despesas', value: 'R$ 4.287', color: 'text-[#EF4444]' },
  { label: 'Transações', value: '47', color: 'text-foreground' }
]

const mockBars = [
  { r: 70, d: 55, m: 'dez' },
  { r: 60, d: 48, m: 'jan' },
  { r: 75, d: 50, m: 'fev' },
  { r: 65, d: 58, m: 'mar' },
  { r: 88, d: 62, m: 'abr' },
  { r: 88, d: 38, m: 'mai' }
]

const BgDashboard = () => (
  <div className='flex w-full h-full'>
    <aside className='w-[220px] bg-[#13151F] border-r border-white/5 shrink-0 p-5'>
      <div className='flex items-center gap-2 mb-6'>
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
          <rect x='2' y='2' width='20' height='20' rx='6' fill='#6366F1' />
          <path d='M8 16V8h7' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' />
          <path d='M8 12h5' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' />
          <circle cx='16.5' cy='15.5' r='2' stroke='#fff' strokeWidth='1.8' />
        </svg>
        <span className='text-sm font-semibold text-white'>Fintrack</span>
      </div>
      <div className='flex flex-col gap-1'>
        {['Dashboard', 'Transações', 'Categorias', 'Metas', 'Relatórios'].map((item, i) => (
          <div
            key={item}
            className='px-3 py-2 rounded-lg text-[13px] font-medium'
            style={{
              color: i === 0 ? '#6366F1' : '#94A3B8',
              background: i === 0 ? 'rgba(99,102,241,0.1)' : 'transparent'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </aside>

    <div className='flex-1 bg-[#0F1117] p-7'>
      <div className='text-lg font-semibold text-white mb-1'>Olá, Gabriel</div>
      <div className='text-xs text-[#94A3B8] mb-5'>Maio de 2026</div>
      <div className='grid grid-cols-4 gap-3 mb-5'>
        {mockCards.map(card => (
          <div key={card.label} className='rounded-xl border border-white/5 bg-[#1A1D27] p-3'>
            <div className='text-[11px] text-[#94A3B8] mb-1'>{card.label}</div>
            <div className={`font-mono text-base font-semibold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>
      <div className='rounded-xl border border-white/5 bg-[#1A1D27] p-4'>
        <div className='text-xs text-[#94A3B8] mb-3'>Receitas vs Despesas</div>
        <div className='flex items-end gap-3 h-28'>
          {mockBars.map(({ r, d, m }) => (
            <div key={m} className='flex-1 flex flex-col items-center gap-1 h-full'>
              <div className='w-full flex-1 flex items-end gap-0.5'>
                <div className='flex-1 rounded-t-sm bg-[#22C55E] opacity-85' style={{ height: `${(r / 88) * 100}%` }} />
                <div className='flex-1 rounded-t-sm bg-[#EF4444] opacity-85' style={{ height: `${(d / 88) * 100}%` }} />
              </div>
              <span className='text-[10px] text-[#94A3B8] uppercase'>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const perks = ['Grátis para sempre', 'Sem cartão', '2 min para começar']

export const Hero = () => {
  return (
    <section className='relative flex flex-col items-center text-center px-6 pt-24 pb-10 overflow-hidden'>
      <div
        className='pointer-events-none absolute -top-52 left-1/2 -translate-x-1/2 w-[900px] h-[600px]'
        style={{ background: 'radial-gradient(closest-side, rgba(99,102,241,0.22), transparent)' }}
      />

      <div
        className='pointer-events-none absolute inset-0 opacity-[0.28]'
        style={{
          filter: 'blur(2px)',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 30%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 30%, #000 60%, transparent 100%)'
        }}
      >
        <BgDashboard />
      </div>

      <div className='relative max-w-3xl mx-auto w-full'>
        <div className='inline-flex items-center gap-2 px-1.5 py-1 pr-3 rounded-full border border-border bg-card/70 backdrop-blur-sm text-xs text-muted-foreground mb-7'>
          <span className='bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold text-[11px]'>Novo</span>
          Relatórios automáticos por categoria
          <ChevronRight size={13} />
        </div>

        <h1 className='text-[clamp(2.8rem,6vw,3.75rem)] font-semibold tracking-[-0.035em] leading-[1.05] mb-5'>
          Suas finanças,
          <br />
          <span className='text-muted-foreground'>com clareza absoluta.</span>
        </h1>

        <p className='text-lg text-muted-foreground max-w-md mx-auto leading-relaxed mb-8'>
          Acompanhe receitas, despesas e metas em um só lugar. Nada de planilhas — só os números que importam, do jeito
          certo.
        </p>

        <div className='flex items-center justify-center gap-2.5 mb-7'>
          <Button size='lg' asChild>
            <Link href='/auth/sign-up'>
              Começar grátis
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button variant='outline' size='lg' asChild>
            <Link href='/auth/sign-in'>Entrar</Link>
          </Button>
        </div>

        <div className='flex items-center justify-center gap-7 text-[12.5px] text-muted-foreground/70'>
          {perks.map(p => (
            <span key={p} className='flex items-center gap-1.5'>
              <Check size={13} className='text-[#22C55E]' />
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className='relative mt-16 w-full max-w-[1000px] mx-auto'>
        <div
          className='rounded-2xl overflow-hidden border border-border bg-card text-left'
          style={{ boxShadow: '0 30px 80px -20px rgba(99,102,241,0.22), 0 0 0 1px rgba(255,255,255,0.02)' }}
        >
          <div className='flex h-[340px] sm:h-[420px] md:h-[480px]'>
            <aside className='hidden sm:flex w-[160px] md:w-[200px] bg-[#13151F] border-r border-white/5 flex-col shrink-0'>
              <div className='p-4 md:p-5 flex items-center gap-2.5'>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
                  <rect x='2' y='2' width='20' height='20' rx='6' fill='#6366F1' />
                  <path d='M8 16V8h7' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' />
                  <path d='M8 12h5' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' />
                  <circle cx='16.5' cy='15.5' r='2' stroke='#fff' strokeWidth='1.8' />
                </svg>
                <span className='text-sm font-semibold'>Fintrack</span>
              </div>
              <nav className='px-2 md:px-3 flex flex-col gap-0.5'>
                {[
                  { label: 'Dashboard', active: true },
                  { label: 'Transações', active: false },
                  { label: 'Categorias', active: false },
                  { label: 'Metas', active: false },
                  { label: 'Relatórios', active: false }
                ].map(item => (
                  <div
                    key={item.label}
                    className='px-3 py-2 rounded-lg text-[12px] md:text-[13px] font-medium'
                    style={{
                      color: item.active ? '#6366F1' : '#94A3B8',
                      background: item.active ? 'rgba(99,102,241,0.1)' : 'transparent'
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </nav>
            </aside>

            <div className='flex-1 bg-[#0F1117] p-3.5 sm:p-5 md:p-6 overflow-hidden'>
              <div className='flex justify-between items-end mb-3 sm:mb-5'>
                <div>
                  <div className='text-sm sm:text-base md:text-lg font-semibold'>Olá, Gabriel</div>
                  <div className='text-[11px] text-muted-foreground mt-0.5'>Maio de 2026</div>
                </div>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4'>
                {mockCards.map(card => (
                  <div key={card.label} className='rounded-xl border border-white/5 bg-[#1A1D27] p-2.5 sm:p-3.5'>
                    <p className='text-[10px] sm:text-[11px] text-muted-foreground mb-1 sm:mb-1.5'>{card.label}</p>
                    <p className={`font-mono text-sm sm:text-base md:text-[17px] font-semibold ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className='rounded-xl border border-white/5 bg-[#1A1D27] p-3 sm:p-4'>
                <div className='text-[11px] font-medium text-muted-foreground mb-2 sm:mb-3'>Receitas vs Despesas</div>
                <div className='flex items-end gap-1.5 sm:gap-3 md:gap-4 h-[100px] sm:h-[130px] md:h-[160px] pb-1'>
                  {mockBars.map(({ r, d, m }) => {
                    const max = 88
                    return (
                      <div key={m} className='flex-1 flex flex-col items-center gap-1 sm:gap-1.5 h-full'>
                        <div className='w-full flex-1 flex items-end gap-0.5 sm:gap-1'>
                          <div
                            className='flex-1 rounded-t-sm'
                            style={{ height: `${(r / max) * 100}%`, background: '#22C55E', opacity: 0.85 }}
                          />
                          <div
                            className='flex-1 rounded-t-sm'
                            style={{ height: `${(d / max) * 100}%`, background: '#EF4444', opacity: 0.85 }}
                          />
                        </div>
                        <span className='text-[9px] sm:text-[10px] text-muted-foreground uppercase'>{m}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className='absolute bottom-0 left-0 right-0 h-32 pointer-events-none'
          style={{ background: 'linear-gradient(to top, #0F1117, transparent)' }}
        />
      </div>
    </section>
  )
}
