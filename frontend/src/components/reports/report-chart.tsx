'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MonthlyChartEntry, CategoryEntry } from '@/app/(dashboard)/reports/page'
import { Loading } from '@/components/shared/loading'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { brl } from '@/lib/utils'

interface ReportChartProps {
  monthlyData: MonthlyChartEntry[]
  categoryData: CategoryEntry[]
  loading: boolean
  periodLabel: string
}

const CustomTooltip = ({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: { name: string; value: number; stroke: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-xl'>
      <p className='text-muted-foreground mb-1.5 font-medium'>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.stroke }} className='font-mono'>
          {p.name}: {brl(p.value)}
        </p>
      ))}
    </div>
  )
}

export const ReportChart = ({ monthlyData, categoryData, loading, periodLabel }: ReportChartProps) => {
  return (
    <div className='flex flex-col gap-6'>
      <Card className='p-5 gap-0'>
        <div className='flex items-start justify-between mb-5'>
          <div>
            <p className='font-semibold'>Evolução do saldo</p>
            <p className='text-xs text-muted-foreground mt-0.5'>{periodLabel || 'Últimos meses'}</p>
          </div>
          <div className='flex flex-wrap gap-3 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1.5'>
              <span className='w-8 h-0.5 bg-primary inline-block rounded-full' />
              Saldo
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='w-8 h-0.5 bg-[#22C55E] inline-block rounded-full' />
              Receitas
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='w-8 h-0.5 bg-[#EF4444] inline-block rounded-full' />
              Despesas
            </span>
          </div>
        </div>
        {loading ? (
          <Loading className='h-[220px]' />
        ) : monthlyData.length === 0 ? (
          <div className='flex items-center justify-center h-[220px] text-sm text-muted-foreground'>
            Sem dados para o período
          </div>
        ) : (
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#2D3048' vertical={false} />
              <XAxis dataKey='month' axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type='monotone'
                dataKey='saldo'
                name='Saldo'
                stroke='#6366F1'
                strokeWidth={2}
                dot={{ fill: '#6366F1', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type='monotone'
                dataKey='receitas'
                name='Receitas'
                stroke='#22C55E'
                strokeWidth={2}
                strokeDasharray='4 3'
                dot={false}
              />
              <Line
                type='monotone'
                dataKey='despesas'
                name='Despesas'
                stroke='#EF4444'
                strokeWidth={2}
                strokeDasharray='4 3'
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className='p-0 gap-0'>
        <div className='px-5 py-4 border-b border-border'>
          <p className='font-semibold'>Resumo por categoria</p>
          <p className='text-xs text-muted-foreground mt-0.5'>Despesas do período: {periodLabel}</p>
        </div>
        {loading ? (
          <Loading className='py-10' />
        ) : categoryData.length === 0 ? (
          <div className='py-10 text-center text-sm text-muted-foreground'>Sem despesas no período</div>
        ) : (
          <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border hover:bg-transparent'>
                <TableHead>Categoria</TableHead>
                <TableHead>Total gasto</TableHead>
                <TableHead>% do total</TableHead>
                <TableHead>Barra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map(row => (
                <TableRow key={row.name} className='border-border'>
                  <TableCell>
                    <div className='flex items-center gap-2.5'>
                      <div
                        className='w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0'
                        style={{ background: row.color + '20' }}
                      >
                        {row.icon}
                      </div>
                      <span className='text-sm font-medium'>{row.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='font-mono text-sm font-semibold'>{brl(row.total)}</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-muted-foreground'>{row.pct}%</span>
                  </TableCell>
                  <TableCell className='w-48'>
                    <Progress value={row.pct} className='h-1.5' indicatorStyle={{ background: row.color }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
