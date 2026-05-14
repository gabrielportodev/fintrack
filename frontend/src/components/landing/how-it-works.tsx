type StepType = {
  n: string
  title: string
  body: string
}

const steps: StepType[] = [
  {
    n: '01',
    title: 'Crie sua conta em 2 minutos',
    body: 'Sem burocracia, sem cartão de crédito. Só nome, e-mail e senha — você já está dentro.'
  },
  {
    n: '02',
    title: 'Registre receitas e despesas',
    body: 'Adicione transações manualmente e organize por categorias personalizadas com ícone e cor.'
  },
  {
    n: '03',
    title: 'Acompanhe e evolua',
    body: 'Veja relatórios, controle metas mensais e entenda exatamente onde seu dinheiro vai.'
  }
]

export const HowItWorks = () => (
  <section className='py-24 border-t border-border'>
    <div className='max-w-5xl mx-auto px-6'>
      <div className='text-center mb-16'>
        <div className='text-xs font-semibold text-primary tracking-widest uppercase mb-3'>Como funciona</div>
        <h2 className='text-[2rem] font-semibold tracking-tight'>Do zero ao controle total em minutos.</h2>
      </div>

      <div className='grid md:grid-cols-3 gap-8 relative'>
        <div className='hidden md:block absolute top-6 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-linear-to-r from-transparent via-border to-transparent' />

        {steps.map(({ n, title, body }) => (
          <div key={n} className='flex flex-col items-center text-center gap-4'>
            <div className='relative z-10 w-12 h-12 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center'>
              <span className='font-mono text-sm font-semibold text-primary'>{n}</span>
            </div>
            <h3 className='font-semibold text-base tracking-tight'>{title}</h3>
            <p className='text-sm text-muted-foreground leading-relaxed'>{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
