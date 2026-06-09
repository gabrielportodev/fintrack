'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { categoryService } from '@/lib/api/categories'
import type { CategoryType } from '@/types/category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CATEGORY_ICON_OPTIONS, getCategoryIcon, normalizeCategoryIconName } from '@/lib/category-icons'
import { useState } from 'react'
import { toast } from 'sonner'

const colorOptions = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#22C55E',
  '#10B981',
  '#06B6D4',
  '#3B82F6',
  '#0EA5E9',
  '#A16207',
  '#D946EF',
  '#64748B'
]

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: CategoryType | null
  onSaved: () => void
}

export const CategoryDialog = ({ open, onOpenChange, category, onSaved }: CategoryDialogProps) => {
  const [name, setName] = useState(category?.name ?? '')
  const [selectedColor, setSelectedColor] = useState(category?.color ?? '#6366F1')
  const [selectedIcon, setSelectedIcon] = useState(normalizeCategoryIconName(category?.icon))
  const [saving, setSaving] = useState(false)

  const stateKey = `${open}-${category?.id ?? 'new'}`
  const [prevKey, setPrevKey] = useState(stateKey)

  if (prevKey !== stateKey) {
    setPrevKey(stateKey)
    if (category) {
      setName(category.name)
      setSelectedColor(category.color)
      setSelectedIcon(normalizeCategoryIconName(category.icon))
    } else {
      setName('')
      setSelectedColor('#6366F1')
      setSelectedIcon('utensils')
    }
  }

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Informe um nome para a categoria')
    setSaving(true)
    try {
      if (category) {
        const { message } = await categoryService.update(category.id, {
          name,
          color: selectedColor,
          icon: selectedIcon
        })
        toast.success(message)
      } else {
        const { message } = await categoryService.create({ name, color: selectedColor, icon: selectedIcon })
        toast.success(message)
      }
      onSaved()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar categoria')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-card border-border'>
        <DialogHeader>
          <DialogTitle>{category ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='cat-name'>Nome</Label>
            <Input id='cat-name' placeholder='Ex: Alimentação' value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>Cor</Label>
            <div className='flex flex-wrap gap-2'>
              {colorOptions.map(color => (
                <Button
                  key={color}
                  variant='ghost'
                  onClick={() => setSelectedColor(color)}
                  className='w-7 h-7 min-w-0 rounded-lg p-0 hover:bg-transparent hover:scale-110 transition-transform'
                  style={{
                    background: color,
                    outline: selectedColor === color ? `2px solid ${color}` : 'none',
                    outlineOffset: 2
                  }}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Label>Ícone</Label>
            <div className='flex flex-wrap gap-2'>
              {CATEGORY_ICON_OPTIONS.map(iconName => (
                <Button
                  key={iconName}
                  variant='ghost'
                  size='icon'
                  onClick={() => setSelectedIcon(iconName)}
                  className={`w-9 h-9 rounded-lg text-lg ${
                    selectedIcon === iconName
                      ? 'bg-primary/20 border border-primary/50 hover:bg-primary/20'
                      : 'bg-muted hover:bg-muted/80 border border-transparent'
                  }`}
                >
                  {getCategoryIcon(iconName)}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex items-center gap-3 p-3 rounded-lg bg-background border border-border'>
            <div
              className='flex items-center justify-center w-10 h-10 rounded-xl text-xl'
              style={{ background: selectedColor + '20' }}
            >
              {getCategoryIcon(selectedIcon)}
            </div>
            <div>
              <p className='text-sm font-medium'>{name || 'Pré-visualização'}</p>
              <p className='text-xs text-muted-foreground'>{category ? 'Editando categoria' : 'Nova categoria'}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : category ? 'Atualizar' : 'Salvar categoria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
