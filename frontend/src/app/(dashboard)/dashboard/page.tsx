'use client'

import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { MonthlyChart } from '@/components/dashboard/monthly-chart'
import { transactionService } from '@/lib/api/transactions'
import type { TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import { useAuth } from '@/contexts/auth-context'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

type MonthlyStat = { month: string; receitas: number; despesas: number }
type PieSlice = { name: string; value: number; color: string }

const DashboardPage = () => {
  const { user } = useAuth()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 })
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const rangeStart = new Date(year, month - 1 - 5, 1)
        const startMonth = rangeStart.getMonth() + 1
        const startYear = rangeStart.getFullYear()

        const [txRes, summaryRangeRes] = await Promise.all([
          transactionService.getByMonth(month, year),
          transactionService.getSummaryRange(startMonth, startYear, month, year)
        ])
        setTransactions(txRes.data)

        const currentSummary = summaryRangeRes.data.find(s => s.month === month && s.year === year)
        setSummary({
          income: currentSummary?.income ?? 0,
          expense: currentSummary?.expense ?? 0,
          balance: currentSummary?.balance ?? 0
        })

        setMonthlyStats(
          summaryRangeRes.data.map(s => ({
            month: new Date(s.year, s.month - 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
            receitas: Number(s.income),
            despesas: Number(s.expense)
          }))
        )
      } catch {
        toast.error('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [month, year])

  const pieData: PieSlice[] = Object.values(
    transactions
      .filter(t => t.type === TransactionTypeEnum.EXPENSE)
      .reduce<Record<string, PieSlice>>((acc, t) => {
        if (!acc[t.categoryName]) {
          acc[t.categoryName] = { name: t.categoryName, value: 0, color: t.categoryColor ?? '#888' }
        }
        acc[t.categoryName].value += t.amount
        return acc
      }, {})
  ).sort((a, b) => b.value - a.value)

  const monthLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const firstName = user?.name.split(' ')[0] ?? 'Usuário'

  return (
    <div className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
      <header className='flex items-end justify-between px-4 py-5 border-b border-border shrink-0 sm:px-8 sm:py-7'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight sm:text-2xl'>Olá, {firstName}</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
          </p>
        </div>
      </header>
      <div className='flex-1 px-4 py-5 flex flex-col gap-6 sm:px-8 sm:py-6'>
        <SummaryCards
          income={summary.income}
          expense={summary.expense}
          balance={summary.balance}
          count={transactions.length}
          loading={loading}
        />
        <MonthlyChart monthlyData={monthlyStats} pieData={pieData} loading={loading} currentMonthLabel={monthLabel} />
        <RecentTransactions transactions={transactions.slice(0, 5)} loading={loading} />
      </div>
    </div>
  )
}

export default DashboardPage
