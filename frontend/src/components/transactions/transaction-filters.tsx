'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type FilterType = 'todos' | 'receita' | 'despesa'

interface TransactionFiltersProps {
  filter: FilterType
  onFilterChange: (value: FilterType) => void
  month: number
  year: number
  onMonthChange: (month: number, year: number) => void
}

const getLast12Months = () => {
  const months = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    months.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      value: `${d.getMonth() + 1}-${d.getFullYear()}`
    })
  }
  return months
}

export const TransactionFilters = ({ filter, onFilterChange, month, year, onMonthChange }: TransactionFiltersProps) => {
  const months = getLast12Months()
  const currentValue = `${month}-${year}`

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Select
        value={currentValue}
        onValueChange={val => {
          const [m, y] = val.split('-').map(Number)
          onMonthChange(m, y)
        }}
      >
        <SelectTrigger className='w-44'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map(m => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex items-center gap-1 p-1 rounded-lg bg-muted border border-border'>
        {(['todos', 'receita', 'despesa'] as const).map(f => (
          <Button
            key={f}
            variant='ghost'
            onClick={() => onFilterChange(f)}
            className={`px-3 py-1.5 h-auto rounded-md text-sm font-medium capitalize ${
              filter === f ? 'bg-card text-foreground shadow-sm hover:bg-card' : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
            }`}
          >
            {f === 'todos' ? 'Todos' : f === 'receita' ? 'Receitas' : 'Despesas'}
          </Button>
        ))}
      </div>
    </div>
  )
}
