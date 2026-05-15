import type { MonthlyChartEntry, CategoryEntry } from '@/app/(dashboard)/reports/page'
import type { TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import { brl, formatDateFull } from '@/lib/utils'
import jsPDF from 'jspdf'

export interface ReportPDFData {
  monthlyData: MonthlyChartEntry[]
  categoryData: CategoryEntry[]
  totals: { income: number; expense: number; balance: number }
  allTransactions: TransactionType[]
  startMonth: number
  startYear: number
  endMonth: number
  endYear: number
  periodLabel: string
  userName?: string
}

type RGB = [number, number, number]

const PURPLE: RGB = [99, 102, 241]
const GREEN: RGB = [34, 197, 94]
const RED: RGB = [239, 68, 68]
const MUTED: RGB = [120, 120, 140]
const DARK: RGB = [30, 30, 30]
const ROW_BG: RGB = [245, 245, 250]
const WHITE: RGB = [255, 255, 255]
const SECTION_LINE: RGB = [220, 220, 230]

const MONTH_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const formatPeriod = (startMonth: number, startYear: number, endMonth: number, endYear: number) => {
  const start = `${MONTH_ABBR[startMonth - 1]} ${startYear}`
  const end = `${MONTH_ABBR[endMonth - 1]} ${endYear}`
  return start === end ? start : `${start} - ${end}`
}

function checkPageBreak(pdf: jsPDF, y: number, needed: number, pageH: number): number {
  if (y + needed > pageH - 16) {
    pdf.addPage()
    return 24
  }
  return y
}

function sectionDivider(pdf: jsPDF, y: number, W: number): number {
  pdf.setDrawColor(...SECTION_LINE)
  pdf.setLineWidth(0.3)
  pdf.line(14, y, W - 14, y)
  return y + 8
}

function sectionTitle(pdf: jsPDF, text: string, y: number): number {
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...DARK)
  pdf.text(text, 14, y)
  // linha decorativa abaixo do título
  pdf.setDrawColor(...PURPLE)
  pdf.setLineWidth(0.5)
  pdf.line(14, y + 2, 14 + pdf.getTextWidth(text), y + 2)
  return y + 8
}

function tableHeader(pdf: jsPDF, y: number, W: number, cols: { text: string; x: number }[]): number {
  pdf.setFillColor(...PURPLE)
  pdf.roundedRect(14, y, W - 28, 8, 1, 1, 'F')
  pdf.setTextColor(...WHITE)
  pdf.setFontSize(7.5)
  pdf.setFont('helvetica', 'bold')
  for (const col of cols) pdf.text(col.text, col.x, y + 5.5)
  return y + 8
}

function tableRow(pdf: jsPDF, y: number, W: number, index: number, cells: { text: string; x: number; color?: RGB }[]) {
  if (index % 2 === 0) {
    pdf.setFillColor(...ROW_BG)
    pdf.rect(14, y, W - 28, 7, 'F')
  }
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  for (const cell of cells) {
    pdf.setTextColor(...(cell.color ?? ([40, 40, 40] as RGB)))
    pdf.text(cell.text, cell.x, y + 5)
  }
}

export function generateReportPDF(data: ReportPDFData) {
  const { monthlyData, categoryData, totals, allTransactions, startMonth, startYear, endMonth, endYear, userName } =
    data

  const pdf = new jsPDF('p', 'mm', 'a4')
  const W = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  let y = 0

  // ── Cabeçalho ──────────────────────────────────────────────────────────────
  // Fundo roxo
  pdf.setFillColor(...PURPLE)
  pdf.rect(0, 0, W, 36, 'F')

  // Faixa decorativa inferior do header
  pdf.setFillColor(79, 70, 229) // roxo mais escuro
  pdf.rect(0, 30, W, 6, 'F')

  // Logo / nome
  pdf.setTextColor(...WHITE)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Fintrack', 14, 14)

  // Subtítulo
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Relatório Financeiro Pessoal', 14, 22)

  // Período — lado direito
  const period = formatPeriod(startMonth, startYear, endMonth, endYear)
  pdf.setFontSize(8)
  pdf.setTextColor(200, 200, 255)
  pdf.text('Período', W - 14, 13, { align: 'right' })
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...WHITE)
  pdf.text(period, W - 14, 21, { align: 'right' })

  // Usuário — se fornecido
  if (userName) {
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(200, 200, 255)
    pdf.text(`Gerado para: ${userName}`, W - 14, 28, { align: 'right' })
  }

  y = 46

  // ── Resumo executivo ────────────────────────────────────────────────────────
  y = sectionTitle(pdf, 'Resumo do período', y)

  const summaryCards = [
    { label: 'Total de Receitas', value: totals.income, color: GREEN, border: GREEN },
    { label: 'Total de Despesas', value: totals.expense, color: RED, border: RED },
    {
      label: 'Saldo do Período',
      value: totals.balance,
      color: totals.balance >= 0 ? GREEN : RED,
      border: PURPLE
    }
  ]

  const cardW = (W - 28 - 8) / 3
  summaryCards.forEach((card, i) => {
    const x = 14 + i * (cardW + 4)

    // fundo do card
    pdf.setFillColor(...ROW_BG)
    pdf.roundedRect(x, y, cardW, 24, 2, 2, 'F')

    // borda esquerda colorida
    pdf.setFillColor(...card.border)
    pdf.roundedRect(x, y, 3, 24, 1, 1, 'F')

    // label
    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...MUTED)
    pdf.text(card.label, x + 7, y + 8)

    // valor
    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...card.color)
    pdf.text(brl(card.value), x + 7, y + 19)
  })
  y += 32

  y = sectionDivider(pdf, y, W)

  // ── Indicadores financeiros ─────────────────────────────────────────────────
  y = checkPageBreak(pdf, y, 70, pageH)
  y = sectionTitle(pdf, 'Indicadores financeiros', y)

  const nMonths = monthlyData.length || 1
  const savingsRate = totals.income > 0 ? ((totals.income - totals.expense) / totals.income) * 100 : 0
  const avgIncome = totals.income / nMonths
  const avgExpense = totals.expense / nMonths
  const maxExpenseMonth = monthlyData.reduce(
    (best, cur) => (cur.despesas > best.despesas ? cur : best),
    monthlyData[0] ?? { month: '-', despesas: 0, receitas: 0, saldo: 0 }
  )
  const maxIncomeMonth = monthlyData.reduce(
    (best, cur) => (cur.receitas > best.receitas ? cur : best),
    monthlyData[0] ?? { month: '-', despesas: 0, receitas: 0, saldo: 0 }
  )

  const indicators: { label: string; value: string; color: RGB }[] = [
    { label: 'Taxa de poupança', value: `${savingsRate.toFixed(1)}%`, color: savingsRate >= 0 ? GREEN : RED },
    { label: 'Média mensal de receitas', value: brl(avgIncome), color: GREEN },
    { label: 'Média mensal de despesas', value: brl(avgExpense), color: RED },
    { label: 'Mês com maior gasto', value: maxExpenseMonth.month.toUpperCase(), color: MUTED },
    { label: 'Mês com maior receita', value: maxIncomeMonth.month.toUpperCase(), color: GREEN }
  ]

  const halfW = (W - 28 - 4) / 2
  indicators.forEach((ind, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 14 + col * (halfW + 4)
    const iy = y + row * 17

    pdf.setFillColor(...ROW_BG)
    pdf.roundedRect(x, iy, halfW, 14, 2, 2, 'F')

    // borda esquerda
    pdf.setFillColor(...PURPLE)
    pdf.roundedRect(x, iy, 3, 14, 1, 1, 'F')

    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...MUTED)
    pdf.text(ind.label, x + 7, iy + 5.5)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...ind.color)
    pdf.text(ind.value, x + 7, iy + 11.5)
  })
  y += Math.ceil(indicators.length / 2) * 17 + 10

  y = sectionDivider(pdf, y, W)

  // ── Evolução mensal ─────────────────────────────────────────────────────────
  y = checkPageBreak(pdf, y, 22 + monthlyData.length * 7, pageH)
  y = sectionTitle(pdf, 'Evolução mensal', y)
  y = tableHeader(pdf, y, W, [
    { text: 'Mês', x: 18 },
    { text: 'Receitas', x: 72 },
    { text: 'Despesas', x: 117 },
    { text: 'Saldo', x: 160 }
  ])

  monthlyData.forEach((row, i) => {
    y = checkPageBreak(pdf, y, 7, pageH)
    tableRow(pdf, y, W, i, [
      { text: row.month.toUpperCase(), x: 18 },
      { text: brl(row.receitas), x: 72, color: GREEN },
      { text: brl(row.despesas), x: 117, color: RED },
      { text: brl(row.saldo), x: 160, color: row.saldo >= 0 ? GREEN : RED }
    ])
    y += 7
  })
  y += 10

  y = sectionDivider(pdf, y, W)

  // ── Despesas por categoria ──────────────────────────────────────────────────
  if (categoryData.length > 0) {
    y = checkPageBreak(pdf, y, 22 + categoryData.length * 7, pageH)
    y = sectionTitle(pdf, 'Despesas por categoria', y)
    y = tableHeader(pdf, y, W, [
      { text: 'Categoria', x: 18 },
      { text: 'Total gasto', x: 120 },
      { text: '% do total', x: 162 }
    ])

    categoryData.forEach((cat, i) => {
      y = checkPageBreak(pdf, y, 7, pageH)
      tableRow(pdf, y, W, i, [
        { text: cat.name, x: 18 },
        { text: brl(cat.total), x: 120, color: RED },
        { text: `${cat.pct}%`, x: 162, color: MUTED }
      ])
      y += 7
    })
    y += 10

    y = sectionDivider(pdf, y, W)
  }

  // ── Top 5 maiores despesas ──────────────────────────────────────────────────
  const top5Expenses = [...allTransactions]
    .filter(tx => tx.type === TransactionTypeEnum.EXPENSE)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  if (top5Expenses.length > 0) {
    y = checkPageBreak(pdf, y, 22 + top5Expenses.length * 7, pageH)
    y = sectionTitle(pdf, 'Top 5 maiores despesas', y)
    y = tableHeader(pdf, y, W, [
      { text: '#', x: 18 },
      { text: 'Descrição', x: 28 },
      { text: 'Categoria', x: 105 },
      { text: 'Data', x: 150 },
      { text: 'Valor', x: 172 }
    ])

    top5Expenses.forEach((tx, i) => {
      y = checkPageBreak(pdf, y, 7, pageH)
      tableRow(pdf, y, W, i, [
        { text: `${i + 1}`, x: 18 },
        { text: tx.description.slice(0, 35), x: 28 },
        { text: (tx.categoryName ?? '').slice(0, 20), x: 105, color: MUTED },
        { text: formatDateFull(tx.date), x: 150, color: MUTED },
        { text: brl(tx.amount), x: 172, color: RED }
      ])
      y += 7
    })
    y += 10

    y = sectionDivider(pdf, y, W)
  }

  // ── Top 5 maiores receitas ──────────────────────────────────────────────────
  const top5Income = [...allTransactions]
    .filter(tx => tx.type === TransactionTypeEnum.INCOME)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  if (top5Income.length > 0) {
    y = checkPageBreak(pdf, y, 22 + top5Income.length * 7, pageH)
    y = sectionTitle(pdf, 'Top 5 maiores receitas', y)
    y = tableHeader(pdf, y, W, [
      { text: '#', x: 18 },
      { text: 'Descrição', x: 28 },
      { text: 'Categoria', x: 105 },
      { text: 'Data', x: 150 },
      { text: 'Valor', x: 172 }
    ])

    top5Income.forEach((tx, i) => {
      y = checkPageBreak(pdf, y, 7, pageH)
      tableRow(pdf, y, W, i, [
        { text: `${i + 1}`, x: 18 },
        { text: tx.description.slice(0, 35), x: 28 },
        { text: (tx.categoryName ?? '').slice(0, 20), x: 105, color: MUTED },
        { text: formatDateFull(tx.date), x: 150, color: MUTED },
        { text: brl(tx.amount), x: 172, color: GREEN }
      ])
      y += 7
    })
  }

  // ── Rodapé em todas as páginas ──────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPages = (pdf as any).internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p)

    pdf.setFillColor(245, 245, 250)
    pdf.rect(0, pageH - 12, W, 12, 'F')

    pdf.setDrawColor(...SECTION_LINE)
    pdf.setLineWidth(0.3)
    pdf.line(0, pageH - 12, W, pageH - 12)

    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(150, 150, 170)
    pdf.text(
      `Gerado por Fintrack — fintrack.gabrielporto.me  |  ${new Date().toLocaleDateString('pt-BR')}`,
      14,
      pageH - 4.5
    )
    pdf.text(`Página ${p} de ${totalPages}`, W - 14, pageH - 4.5, { align: 'right' })
  }

  pdf.save(
    `fintrack-relatorio-${String(startMonth).padStart(2, '0')}-${startYear}_${String(endMonth).padStart(2, '0')}-${endYear}.pdf`
  )
}
