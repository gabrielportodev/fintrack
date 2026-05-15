import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { brl } from '@/lib/utils'

interface ReportSummaryProps {
  income: number
  expense: number
  balance: number
  loading: boolean
  periodLabel: string
}

export const ReportSummary = ({ income, expense, balance, loading, periodLabel }: ReportSummaryProps) => {
  const cards = [
    { label: 'Total de receitas', value: income, icon: TrendingUp, color: '#22C55E' },
    { label: 'Total de despesas', value: expense, icon: TrendingDown, color: '#EF4444' },
    { label: 'Saldo do período', value: balance, icon: Wallet, color: '#6366F1' }
  ]

  return (
    <div className='grid grid-cols-3 gap-4'>
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className='p-5 gap-0'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm text-muted-foreground font-medium'>{label}</span>
            <div
              className='flex items-center justify-center w-8 h-8 rounded-lg'
              style={{ background: color + '1A', color }}
            >
              <Icon size={15} />
            </div>
          </div>
          {loading ? (
            <div className='h-8 w-32 rounded bg-muted animate-pulse' />
          ) : (
            <p className='font-mono text-2xl font-semibold tracking-tight' style={{ color }}>
              {brl(value)}
            </p>
          )}
          <p className='text-xs text-muted-foreground mt-1.5'>{periodLabel}</p>
        </Card>
      ))}
    </div>
  )
}
