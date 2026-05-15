'use client'

import { TransactionFilters } from '@/components/transactions/transaction-filters'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { TransactionList } from '@/components/transactions/transaction-list'
import { PageHeader } from '@/components/shared/page-header'
import { transactionService } from '@/lib/api/transactions'
import type { TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

type FilterType = 'todos' | 'receita' | 'despesa'

const TransactionsPage = () => {
  const now = new Date()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('todos')
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [editing, setEditing] = useState<TransactionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const res = await transactionService.getByMonth(month, year)
        setTransactions(res.data)
      } catch {
        toast.error('Erro ao carregar transações')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [month, year, refresh])

  const refreshTransactions = () => setRefresh(r => r + 1)

  const handleEdit = (tx: TransactionType) => {
    setEditing(tx)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { message } = await transactionService.delete(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
      toast.success(message)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao remover transação'))
    }
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) setEditing(null)
  }

  const filtered =
    filter === 'todos'
      ? transactions
      : transactions.filter(t =>
          filter === 'receita' ? t.type === TransactionTypeEnum.INCOME : t.type === TransactionTypeEnum.EXPENSE
        )

  const monthLabel = new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const subtitle = loading
    ? 'Carregando...'
    : `${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)} · ${filtered.length} transações`

  return (
    <div className='flex flex-col h-full overflow-y-auto'>
      <PageHeader
        title='Transações'
        subtitle={subtitle}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            Nova transação
          </Button>
        }
      />
      <div className='flex-1 px-8 py-6 flex flex-col gap-4'>
        <TransactionFilters
          filter={filter}
          onFilterChange={setFilter}
          month={month}
          year={year}
          onMonthChange={(m, y) => {
            setMonth(m)
            setYear(y)
          }}
        />
        <TransactionList transactions={filtered} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <TransactionDialog
        open={open}
        onOpenChange={handleOpenChange}
        transaction={editing}
        onSaved={refreshTransactions}
      />
    </div>
  )
}

export default TransactionsPage
