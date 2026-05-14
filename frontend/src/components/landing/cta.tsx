import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const perks = ['Grátis para sempre', 'Sem cartão', 'Dados seguros']

export const Cta = () => {
  return (
    <section className='py-16 border-t border-border'>
      <div className='max-w-5xl mx-auto px-6'>
        <div
          className='relative rounded-2xl overflow-hidden border border-primary/20 px-10 py-10'
          style={{
            background: 'radial-gradient(80% 120% at 0% 50%, rgba(99,102,241,0.18), transparent), #1A1D27'
          }}
        >
          <div
            className='pointer-events-none absolute inset-0 opacity-[0.03]'
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          />

          <div className='relative flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='flex flex-col gap-2 md:max-w-lg'>
              <h2 className='text-[1.6rem] font-semibold tracking-tight leading-snug'>
                Pronto para entender seu dinheiro de verdade?
              </h2>
              <div className='flex items-center gap-5 mt-1'>
                {perks.map(p => (
                  <span key={p} className='flex items-center gap-1.5 text-[12.5px] text-muted-foreground'>
                    <Check size={12} className='text-[#22C55E]' />
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-3 shrink-0'>
              <Button size='lg' asChild className='px-6'>
                <Link href='/auth/sign-up'>
                  Criar conta grátis
                  <ArrowRight size={15} />
                </Link>
              </Button>
              <Button variant='outline' size='lg' asChild>
                <Link href='/auth/sign-in'>Entrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
