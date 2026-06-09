'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Loading } from '@/components/shared/loading'
import { Progress } from '@/components/ui/progress'
import { Pencil, Trash2 } from 'lucide-react'
import type { GoalType } from '@/types/goal'
import { Card } from '@/components/ui/card'
import { getCategoryIcon } from '@/lib/category-icons'
import { brl } from '@/lib/utils'
import { useState } from 'react'

interface GoalListProps {
  goals: GoalType[]
  loading: boolean
  onEdit: (goal: GoalType) => void
  onDelete: (id: string) => void
}

const progressColor = (pct: number) => {
  if (pct >= 90) return '#EF4444'
  if (pct >= 70) return '#F59E0B'
  return '#22C55E'
}

const progressLabel = (pct: number) => {
  if (pct >= 90) return { text: 'Crítico', bg: '#EF44441A', color: '#EF4444' }
  if (pct >= 70) return { text: 'Atenção', bg: '#F59E0B1A', color: '#F59E0B' }
  return { text: 'OK', bg: '#22C55E1A', color: '#22C55E' }
}

export const GoalList = ({ goals, loading, onEdit, onDelete }: GoalListProps) => {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  if (loading) return <Loading />

  if (goals.length === 0) {
    return <div className='py-20 text-center text-sm text-muted-foreground'>Nenhuma meta para este período</div>
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {goals.map(goal => {
          const pct = goal.limitAmount > 0 ? Math.round((goal.spentAmount / goal.limitAmount) * 100) : 0
          const bar = progressColor(pct)
          const badge = progressLabel(pct)
          const remaining = goal.limitAmount - goal.spentAmount

          return (
            <Card key={goal.id} className='p-5 gap-4'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className='flex items-center justify-center w-9 h-9 rounded-lg text-lg shrink-0'
                    style={{ background: (goal.categoryColor ?? '#888') + '20' }}
                  >
                    {getCategoryIcon(goal.categoryIcon)}
                  </div>
                  <div>
                    <p className='font-semibold text-sm'>{goal.name}</p>
                    <p className='text-xs text-muted-foreground'>{goal.categoryName}</p>
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onEdit(goal)}
                        className='p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer'
                      >
                        <Pencil size={13} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Editar</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setPendingDelete(goal.id)}
                        className='p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer'
                      >
                        <Trash2 size={13} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Excluir</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>
                    <span className='font-mono text-foreground font-medium'>{brl(goal.spentAmount)}</span> de{' '}
                    <span className='font-mono'>{brl(goal.limitAmount)}</span>
                  </span>
                  <span
                    className='text-[10px] font-semibold px-2 py-0.5 rounded-full'
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.text}
                  </span>
                </div>
                <Progress value={Math.min(pct, 100)} className='h-2' indicatorStyle={{ background: bar }} />
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>{pct}% utilizado</span>
                  <span>
                    {remaining >= 0 ? (
                      <span className='text-[#22C55E]'>{brl(remaining)} restantes</span>
                    ) : (
                      <span className='text-[#EF4444]'>{brl(Math.abs(remaining))} excedido</span>
                    )}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={open => !open && setPendingDelete(null)}
        title='Excluir meta'
        description='Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.'
        onConfirm={() => onDelete(pendingDelete!)}
      />
    </>
  )
}
