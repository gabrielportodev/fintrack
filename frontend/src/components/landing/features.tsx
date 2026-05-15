import { TrendingUp, Target, BarChart2, Tag } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Controle de gastos',
    description: 'Cada centavo categorizado. Saiba para onde o dinheiro vai antes do fim do mês.'
  },
  {
    icon: Target,
    title: 'Metas mensais',
    description: 'Defina um teto por categoria e receba alertas antes de estourar.'
  },
  {
    icon: BarChart2,
    title: 'Relatórios visuais',
    description: 'Gráficos limpos e exportáveis em PDF para entender padrões em segundos.'
  },
  {
    icon: Tag,
    title: 'Categorias flexíveis',
    description: 'Crie, edite e personalize categorias com cor e ícone próprios.'
  }
]

export const Features = () => {
  return (
    <section className='py-24 border-t border-border'>
      <div className='max-w-5xl mx-auto px-6'>
        <div className='text-center mb-14'>
          <div className='text-xs font-semibold text-primary tracking-widest uppercase mb-3'>Recursos</div>
          <h2 className='text-[2rem] font-semibold tracking-tight'>Tudo que você precisa, nada que não precisa.</h2>
        </div>
        <div className='grid md:grid-cols-4 gap-4'>
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className='rounded-xl border border-border bg-card p-6'>
              <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-5'>
                <Icon size={18} />
              </div>
              <h3 className='font-semibold text-[15px] mb-1.5'>{title}</h3>
              <p className='text-[13.5px] text-muted-foreground leading-relaxed'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
