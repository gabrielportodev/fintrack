import { TrendingUp, TrendingDown, Wallet, ArrowLeftRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { brl } from '@/lib/utils'

interface SummaryCardsProps {
  income: number
  expense: number
  balance: number
  count: number
  loading: boolean
}

export const SummaryCards = ({ income, expense, balance, count, loading }: SummaryCardsProps) => {
  const cards = [
    { label: 'Saldo atual', value: loading ? '—' : brl(balance), accent: '#6366F1', icon: Wallet },
    { label: 'Receitas do mês', value: loading ? '—' : brl(income), accent: '#22C55E', icon: TrendingUp },
    { label: 'Despesas do mês', value: loading ? '—' : brl(expense), accent: '#EF4444', icon: TrendingDown },
    { label: 'Transações', value: loading ? '—' : String(count), accent: '#94A3B8', icon: ArrowLeftRight }
  ]

  return (
    <div className='grid grid-cols-4 gap-4'>
      {cards.map(({ label, value, accent, icon: Icon }) => (
        <Card key={label} className='p-5 gap-0'>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-sm text-muted-foreground font-medium'>{label}</span>
            <div
              className='flex items-center justify-center w-8 h-8 rounded-lg'
              style={{ background: accent + '1A', color: accent }}
            >
              <Icon size={15} />
            </div>
          </div>
          <p className='font-mono text-2xl font-semibold tracking-tight'>{value}</p>
        </Card>
      ))}
    </div>
  )
}
