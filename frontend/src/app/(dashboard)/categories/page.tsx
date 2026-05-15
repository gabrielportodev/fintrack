'use client'

import { CategoryDialog } from '@/components/categories/category-dialog'
import { CategoryGrid } from '@/components/categories/category-grid'
import { PageHeader } from '@/components/shared/page-header'
import { categoryService } from '@/lib/api/categories'
import type { CategoryType } from '@/types/category'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

const CategoriesPage = () => {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [editing, setEditing] = useState<CategoryType | null>(null)
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll()
        setCategories(res.data)
      } catch {
        toast.error('Erro ao carregar categorias')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [refresh])

  const refreshCategories = () => setRefresh(r => r + 1)

  const handleEdit = (cat: CategoryType) => {
    setEditing(cat)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { message } = await categoryService.delete(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success(message)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao remover categoria'))
    }
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) setEditing(null)
  }

  return (
    <div className='flex flex-col h-full overflow-y-auto'>
      <PageHeader
        title='Categorias'
        subtitle={loading ? 'Carregando...' : `${categories.length} categorias criadas`}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            Nova categoria
          </Button>
        }
      />
      <CategoryGrid
        categories={categories}
        loading={loading}
        onNew={() => setOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CategoryDialog open={open} onOpenChange={handleOpenChange} category={editing} onSaved={refreshCategories} />
    </div>
  )
}

export default CategoriesPage
