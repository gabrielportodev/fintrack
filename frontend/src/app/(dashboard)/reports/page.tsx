'use client'

import { ReportFilters } from '@/components/reports/report-filters'
import { ReportSummary } from '@/components/reports/report-summary'
import { ReportChart } from '@/components/reports/report-chart'
import { PageHeader } from '@/components/shared/page-header'
import { transactionService } from '@/lib/api/transactions'
import type { TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import { generateReportPDF } from '@/lib/report-pdf'
import { useAuth } from '@/contexts/auth-context'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const MONTH_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MONTH_ABBR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const getLast12Months = () => {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const m = d.getMonth() + 1
    const y = d.getFullYear()
    return { month: m, year: y, label: `${MONTH_SHORT[m - 1]} ${y}` }
  })
}

const getMonthsInRange = (startM: number, startY: number, endM: number, endY: number) => {
  if (startY > endY || (startY === endY && startM > endM)) return []
  const result: { month: number; year: number }[] = []
  let y = startY,
    m = startM
  while (y < endY || (y === endY && m <= endM)) {
    result.push({ month: m, year: y })
    if (++m > 12) {
      m = 1
      y++
    }
  }
  return result
}

export type MonthlyChartEntry = { month: string; receitas: number; despesas: number; saldo: number }
export type CategoryEntry = { name: string; icon: string; color: string; total: number; pct: number }

const ReportsPage = () => {
  const { user } = useAuth()
  const now = new Date()
  const curMonth = now.getMonth() + 1
  const curYear = now.getFullYear()

  const rawStart = curMonth - 5
  const defaultStartMonth = rawStart <= 0 ? rawStart + 12 : rawStart
  const defaultStartYear = rawStart <= 0 ? curYear - 1 : curYear

  const [startMonth, setStartMonth] = useState(defaultStartMonth)
  const [startYear, setStartYear] = useState(defaultStartYear)
  const [endMonth, setEndMonth] = useState(curMonth)
  const [endYear, setEndYear] = useState(curYear)
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState<MonthlyChartEntry[]>([])
  const [categoryData, setCategoryData] = useState<CategoryEntry[]>([])
  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([])
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 })
  const [isExporting, setIsExporting] = useState(false)

  const months12 = getLast12Months()

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const range = getMonthsInRange(startMonth, startYear, endMonth, endYear)
        if (range.length === 0) {
          setMonthlyData([])
          setCategoryData([])
          setAllTransactions([])
          setTotals({ income: 0, expense: 0, balance: 0 })
          return
        }

        const firstMonth = range[0]
        const lastMonth = range[range.length - 1]

        const [summariesRes, txRangeRes] = await Promise.all([
          transactionService.getSummaryRange(firstMonth.month, firstMonth.year, lastMonth.month, lastMonth.year),
          transactionService.getByRange(firstMonth.month, firstMonth.year, lastMonth.month, lastMonth.year)
        ])

        setMonthlyData(
          summariesRes.data.map(s => ({
            month: MONTH_ABBR[s.month - 1],
            receitas: s.income,
            despesas: s.expense,
            saldo: s.balance
          }))
        )

        const income = summariesRes.data.reduce((sum, s) => sum + s.income, 0)
        const expense = summariesRes.data.reduce((sum, s) => sum + s.expense, 0)
        setTotals({ income, expense, balance: income - expense })

        const flatTx = txRangeRes.data
        setAllTransactions(flatTx)

        const allExpenses = flatTx.filter(tx => tx.type === TransactionTypeEnum.EXPENSE)
        const catMap = new Map<string, CategoryEntry>()
        for (const tx of allExpenses) {
          if (!catMap.has(tx.categoryId)) {
            catMap.set(tx.categoryId, {
              name: tx.categoryName ?? '',
              icon: tx.categoryIcon ?? '',
              color: tx.categoryColor ?? '#888',
              total: 0,
              pct: 0
            })
          }
          catMap.get(tx.categoryId)!.total += tx.amount
        }
        const totalExp = [...catMap.values()].reduce((s, c) => s + c.total, 0)
        setCategoryData(
          [...catMap.values()]
            .sort((a, b) => b.total - a.total)
            .map(c => ({ ...c, pct: totalExp > 0 ? Math.round((c.total / totalExp) * 1000) / 10 : 0 }))
        )
      } catch {
        toast.error('Erro ao carregar relatório')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [startMonth, startYear, endMonth, endYear])

  const startLabel = months12.find(m => m.month === startMonth && m.year === startYear)?.label ?? ''
  const endLabel = months12.find(m => m.month === endMonth && m.year === endYear)?.label ?? ''
  const periodLabel = startLabel && endLabel ? `${startLabel} → ${endLabel}` : ''

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      generateReportPDF({
        monthlyData,
        categoryData,
        totals,
        allTransactions,
        startMonth,
        startYear,
        endMonth,
        endYear,
        periodLabel,
        userName: user?.name
      })
      toast.success('PDF exportado com sucesso')
    } catch {
      toast.error('Erro ao exportar PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
      <PageHeader
        title='Relatórios'
        subtitle='Visão geral do período selecionado'
        action={
          <ReportFilters
            months={months12}
            startMonth={startMonth}
            startYear={startYear}
            endMonth={endMonth}
            endYear={endYear}
            onStartChange={(m, y) => {
              setStartMonth(m)
              setStartYear(y)
            }}
            onEndChange={(m, y) => {
              setEndMonth(m)
              setEndYear(y)
            }}
            onExport={handleExportPDF}
            isExporting={isExporting}
          />
        }
      />
      <div className='flex-1 px-4 py-5 flex flex-col gap-6 sm:px-8 sm:py-6'>
        <ReportSummary
          income={totals.income}
          expense={totals.expense}
          balance={totals.balance}
          loading={loading}
          periodLabel={periodLabel}
        />
        <ReportChart
          monthlyData={monthlyData}
          categoryData={categoryData}
          loading={loading}
          periodLabel={periodLabel}
        />
      </div>
    </div>
  )
}

export default ReportsPage
