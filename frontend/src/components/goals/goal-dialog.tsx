'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { goalService } from '@/lib/api/goals'
import { categoryService } from '@/lib/api/categories'
import { aiService } from '@/lib/api/ai'
import { getCategoryIcon } from '@/lib/category-icons'
import { TransactionTypeEnum } from '@/types/transaction'
import type { GoalType } from '@/types/goal'
import type { CategoryType } from '@/types/category'
import { toast } from 'sonner'

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

const currentYear = new Date().getFullYear()
const years = [currentYear - 1, currentYear, currentYear + 1]

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: GoalType | null
  defaultMonth?: number
  defaultYear?: number
  onSaved: () => void
}

export const GoalDialog = ({ open, onOpenChange, goal, defaultMonth, defaultYear, onSaved }: GoalDialogProps) => {
  const nowMonth = defaultMonth ?? new Date().getMonth() + 1
  const nowYear = defaultYear ?? new Date().getFullYear()

  const [name, setName] = useState(goal?.name ?? '')
  const [limitAmount, setLimitAmount] = useState(goal ? String(goal.limitAmount) : '')
  const [month, setMonth] = useState(String(goal?.month ?? nowMonth))
  const [year, setYear] = useState(String(goal?.year ?? nowYear))
  const [categoryId, setCategoryId] = useState(goal?.categoryId ?? '')
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [saving, setSaving] = useState(false)
  const [aiSuggested, setAiSuggested] = useState(false)
  const [suggesting, setSuggesting] = useState(false)

  const stateKey = `${open}-${goal?.id ?? 'new'}`
  const [prevKey, setPrevKey] = useState(stateKey)

  if (prevKey !== stateKey) {
    setPrevKey(stateKey)
    setAiSuggested(false)
    if (goal) {
      setName(goal.name)
      setLimitAmount(String(goal.limitAmount))
      setMonth(String(goal.month))
      setYear(String(goal.year))
      setCategoryId(goal.categoryId)
    } else {
      setName('')
      setLimitAmount('')
      setMonth(String(nowMonth))
      setYear(String(nowYear))
      setCategoryId('')
    }
  }

  useEffect(() => {
    if (!open) return
    categoryService
      .getAll()
      .then(res => setCategories(res.data))
      .catch(() => {})
  }, [open])

  const handleSuggestCategory = async () => {
    const valorValido = !!limitAmount && !isNaN(Number(limitAmount)) && Number(limitAmount) > 0
    if (goal || categoryId || !name.trim() || !valorValido) return

    setSuggesting(true)
    try {
      const { data } = await aiService.suggestCategory({
        description: name.trim(),
        amount: Number(limitAmount),
        type: TransactionTypeEnum.EXPENSE
      })
      if (data?.categoryId) {
        setCategoryId(data.categoryId)
        setAiSuggested(true)
      }
    } catch {
    } finally {
      setSuggesting(false)
    }
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    setAiSuggested(false)
  }

  const handleSave = async () => {
    if (!name.trim() || !limitAmount || !categoryId) {
      toast.error('Preencha todos os campos')
      return
    }
    const amount = parseFloat(limitAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Valor limite deve ser positivo')
      return
    }
    setSaving(true)
    try {
      const payload = { name: name.trim(), limitAmount: amount, month: Number(month), year: Number(year), categoryId }
      if (goal) {
        const { message } = await goalService.update(goal.id, payload)
        toast.success(message)
      } else {
        const { message } = await goalService.create(payload)
        toast.success(message)
      }
      onSaved()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar meta')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-card border-border'>
        <DialogHeader>
          <DialogTitle>{goal ? 'Editar meta' : 'Nova meta'}</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label>Nome</Label>
            <Input
              placeholder='Ex: Limite de alimentação'
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={handleSuggestCategory}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>Valor limite (R$)</Label>
            <Input
              type='number'
              placeholder='0,00'
              value={limitAmount}
              onChange={e => setLimitAmount(e.target.value)}
              onBlur={handleSuggestCategory}
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <Label>Mês</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label>Ano</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center gap-2 min-h-5'>
              <Label>Categoria</Label>
              {suggesting && <span className='text-[10px] text-muted-foreground'>sugerindo…</span>}
              {aiSuggested && !suggesting && (
                <Badge variant='secondary' className='gap-1'>
                  <Sparkles className='size-3' /> Sugerido por IA
                </Badge>
              )}
            </div>
            <Select value={categoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder='Selecionar categoria...' />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {getCategoryIcon(c.icon)} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : goal ? 'Salvar alterações' : 'Salvar meta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
