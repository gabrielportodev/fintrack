'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { transactionService } from '@/lib/api/transactions'
import type { TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react'
import { categoryService } from '@/lib/api/categories'
import type { CategoryType } from '@/types/category'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { aiService } from '@/lib/api/ai'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: TransactionType | null
  onSaved: () => void
}

export const TransactionDialog = ({ open, onOpenChange, transaction, onSaved }: TransactionDialogProps) => {
  const [txType, setTxType] = useState<TransactionTypeEnum>(transaction?.type ?? TransactionTypeEnum.EXPENSE)
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [date, setDate] = useState(transaction?.date.split('T')[0] ?? new Date().toISOString().split('T')[0])
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '')
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [saving, setSaving] = useState(false)
  const [aiSuggested, setAiSuggested] = useState(false)
  const [suggesting, setSuggesting] = useState(false)

  const stateKey = `${open}-${transaction?.id ?? 'new'}`
  const [prevKey, setPrevKey] = useState(stateKey)

  if (prevKey !== stateKey) {
    setPrevKey(stateKey)
    setAiSuggested(false)
    if (transaction) {
      setTxType(transaction.type)
      setDescription(transaction.description)
      setAmount(String(transaction.amount))
      setDate(transaction.date.split('T')[0])
      setCategoryId(transaction.categoryId)
    } else {
      setTxType(TransactionTypeEnum.EXPENSE)
      setDescription('')
      setAmount('')
      setDate(new Date().toISOString().split('T')[0])
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
    const valorValido = !!amount && !isNaN(Number(amount)) && Number(amount) > 0
    if (transaction || categoryId || !description.trim() || !valorValido) return

    setSuggesting(true)
    try {
      const { data } = await aiService.suggestCategory({
        description: description.trim(),
        amount: Number(amount),
        type: txType
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
    if (!description.trim()) return toast.error('Informe uma descrição')
    if (!amount || isNaN(Number(amount))) return toast.error('Informe um valor válido')
    if (!categoryId) return toast.error('Selecione uma categoria')

    setSaving(true)
    const payload = { description, amount: Number(amount), type: txType, date, categoryId }

    try {
      if (transaction) {
        const { message } = await transactionService.update(transaction.id, payload)
        toast.success(message)
      } else {
        const { message } = await transactionService.create(payload)
        toast.success(message)
      }
      onSaved()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar transação')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-card border-border'>
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label>Tipo</Label>
            <div className='flex gap-2 p-1 rounded-lg bg-background border border-border'>
              <Button
                variant='ghost'
                onClick={() => setTxType(TransactionTypeEnum.EXPENSE)}
                className={`flex-1 gap-2 py-2 h-auto rounded-md text-sm font-medium ${
                  txType === TransactionTypeEnum.EXPENSE
                    ? 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                }`}
              >
                <TrendingDown size={14} /> Despesa
              </Button>
              <Button
                variant='ghost'
                onClick={() => setTxType(TransactionTypeEnum.INCOME)}
                className={`flex-1 gap-2 py-2 h-auto rounded-md text-sm font-medium ${
                  txType === TransactionTypeEnum.INCOME
                    ? 'bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/10 hover:text-[#22C55E]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                }`}
              >
                <TrendingUp size={14} /> Receita
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='desc'>Descrição</Label>
            <Input
              id='desc'
              placeholder='Ex: Almoço no restaurante'
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={handleSuggestCategory}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='value'>Valor (R$)</Label>
            <Input
              id='value'
              type='number'
              placeholder='0,00'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onBlur={handleSuggestCategory}
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <Label>Data</Label>
              <Input type='date' value={date} onChange={e => setDate(e.target.value)} />
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
                  <SelectValue placeholder='Selecionar...' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : transaction ? 'Atualizar' : 'Salvar transação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
