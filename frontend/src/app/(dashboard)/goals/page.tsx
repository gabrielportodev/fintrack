'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { GoalDialog } from '@/components/goals/goal-dialog'
import { GoalList } from '@/components/goals/goal-list'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/utils'
import { goalService } from '@/lib/api/goals'
import type { GoalType } from '@/types/goal'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

const getLast12Months = () => {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return {
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())
    }
  })
}

const GoalsPage = () => {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [goals, setGoals] = useState<GoalType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<GoalType | null>(null)
  const [refresh, setRefresh] = useState(0)

  const months = getLast12Months()

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true)
      try {
        const res = await goalService.getByMonth(month, year)
        setGoals(res.data)
      } catch {
        toast.error('Erro ao carregar metas')
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [month, year, refresh])

  const handleMonthChange = (val: string) => {
    const [m, y] = val.split('-').map(Number)
    setMonth(m)
    setYear(y)
  }

  const handleNew = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const handleEdit = (goal: GoalType) => {
    setEditing(goal)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { message } = await goalService.delete(id)
      setGoals(prev => prev.filter(g => g.id !== id))
      toast.success(message)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao remover meta'))
    }
  }

  const refreshGoals = () => setRefresh(r => r + 1)

  const activeCount = goals.length
  const currentLabel = months.find(m2 => m2.month === month && m2.year === year)?.label ?? ''
  const subtitle = loading
    ? ''
    : `${currentLabel} · ${activeCount} ${activeCount === 1 ? 'meta ativa' : 'metas ativas'}`

  return (
    <div className='flex flex-col h-full overflow-y-auto'>
      <PageHeader
        title='Metas'
        subtitle={subtitle}
        action={
          <div className='flex items-center gap-3'>
            <Select value={`${month}-${year}`} onValueChange={handleMonthChange}>
              <SelectTrigger className='w-40'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map(m2 => (
                  <SelectItem key={`${m2.month}-${m2.year}`} value={`${m2.month}-${m2.year}`}>
                    {m2.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleNew}>
              <Plus size={16} />
              Nova meta
            </Button>
          </div>
        }
      />
      <div className='flex-1 px-8 py-6'>
        <GoalList goals={goals} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <GoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        goal={editing}
        defaultMonth={month}
        defaultYear={year}
        onSaved={refreshGoals}
      />
    </div>
  )
}

export default GoalsPage
