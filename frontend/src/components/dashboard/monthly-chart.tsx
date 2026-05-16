'use client'

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loading } from '@/components/shared/loading'
import { Card } from '@/components/ui/card'
import { brl } from '@/lib/utils'

type MonthlyStat = { month: string; receitas: number; despesas: number }
type PieSlice = { name: string; value: number; color: string }

interface MonthlyChartProps {
  monthlyData: MonthlyStat[]
  pieData: PieSlice[]
  loading: boolean
  currentMonthLabel: string
}

const CustomTooltip = ({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: { name: string; value: number; fill: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-xl'>
      <p className='text-muted-foreground mb-1 font-medium'>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill }}>
          {p.name}: {brl(p.value)}
        </p>
      ))}
    </div>
  )
}

export const MonthlyChart = ({ monthlyData, pieData, loading, currentMonthLabel }: MonthlyChartProps) => {
  const top4Pie = pieData.slice(0, 4)
  const label = currentMonthLabel.charAt(0).toUpperCase() + currentMonthLabel.slice(1)

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
      <Card className='col-span-1 p-5 gap-0 lg:col-span-3'>
        <div className='flex items-start justify-between mb-5'>
          <div>
            <p className='font-semibold'>Receitas × Despesas</p>
            <p className='text-xs text-muted-foreground mt-0.5'>Últimos 6 meses</p>
          </div>
          <div className='flex flex-wrap gap-3 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1.5'>
              <span className='w-2.5 h-2.5 rounded-sm bg-primary inline-block' />
              Receitas
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='w-2.5 h-2.5 rounded-sm bg-[#EF4444] inline-block' />
              Despesas
            </span>
          </div>
        </div>
        {loading ? (
          <Loading className='h-[200px]' />
        ) : (
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={monthlyData} barCategoryGap='30%' barGap={4}>
              <XAxis dataKey='month' axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey='receitas' name='Receitas' fill='#6366F1' radius={[4, 4, 0, 0]} />
              <Bar dataKey='despesas' name='Despesas' fill='#EF4444' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className='col-span-1 p-5 gap-0 lg:col-span-2'>
        <div className='mb-4'>
          <p className='font-semibold'>Gastos por categoria</p>
          <p className='text-xs text-muted-foreground mt-0.5'>{label}</p>
        </div>
        {loading ? (
          <Loading className='h-[200px]' />
        ) : pieData.length === 0 ? (
          <div className='flex items-center justify-center h-[200px] text-sm text-muted-foreground'>
            Sem despesas este mês
          </div>
        ) : (
          <>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey='value'
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={val => [brl(Number(val)), '']}
                  contentStyle={{
                    background: '#1A1D27',
                    border: '1px solid #2D3048',
                    borderRadius: 8,
                    fontSize: 12
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-col gap-1.5 mt-1'>
              {top4Pie.map(d => (
                <div key={d.name} className='flex items-center justify-between text-xs'>
                  <span className='flex items-center gap-1.5 text-muted-foreground'>
                    <span className='w-2 h-2 rounded-full inline-block' style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className='font-mono text-foreground'>{brl(d.value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
