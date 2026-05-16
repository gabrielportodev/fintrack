'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Loading } from '@/components/shared/loading'
import type { CategoryType } from '@/types/category'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDateLong } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

interface CategoryGridProps {
  categories: CategoryType[]
  loading: boolean
  onNew: () => void
  onEdit: (cat: CategoryType) => void
  onDelete: (id: string) => void
}

export const CategoryGrid = ({ categories, loading, onNew, onEdit, onDelete }: CategoryGridProps) => {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  return (
    <div className='flex-1 px-4 py-5 sm:px-8 sm:py-6'>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4'>
        {loading ? (
          <div className='col-span-full'>
            <Loading />
          </div>
        ) : (
          categories.map(cat => (
            <Card key={cat.id} className='p-5 gap-4'>
              <div className='flex items-start justify-between'>
                <div
                  className='flex items-center justify-center w-11 h-11 rounded-xl text-2xl'
                  style={{ background: cat.color + '20', border: `1px solid ${cat.color}30` }}
                >
                  {cat.icon}
                </div>
                <div className='flex items-center gap-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onEdit(cat)}
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
                        onClick={() => setPendingDelete(cat.id)}
                        className='p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer'
                      >
                        <Trash2 size={13} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Excluir</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <p className='font-semibold text-sm'>{cat.name}</p>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full' style={{ background: cat.color }} />
                <p className='text-xs text-muted-foreground'>Criada em {formatDateLong(cat.createdAt)}</p>
              </div>
            </Card>
          ))
        )}

        <Button
          variant='ghost'
          onClick={onNew}
          className='rounded-xl border border-dashed border-border h-full min-h-[140px] flex flex-col gap-2 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5'
        >
          <Plus size={20} />
          <span className='text-sm font-medium'>Nova categoria</span>
        </Button>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={open => !open && setPendingDelete(null)}
        title='Excluir categoria'
        description='Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.'
        onConfirm={() => onDelete(pendingDelete!)}
      />
    </div>
  )
}
