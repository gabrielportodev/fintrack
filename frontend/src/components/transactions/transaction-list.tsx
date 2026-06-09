'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import type { TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import { Loading } from '@/components/shared/loading'
import { brl, formatDateFull } from '@/lib/utils'
import { getCategoryIcon } from '@/lib/category-icons'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface TransactionListProps {
  transactions: TransactionType[]
  loading: boolean
  onEdit: (tx: TransactionType) => void
  onDelete: (id: string) => void
}

export const TransactionList = ({ transactions, loading, onEdit, onDelete }: TransactionListProps) => {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  if (loading) {
    return (
      <Card className='p-0 gap-0'>
        <Loading />
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className='p-0 gap-0 items-center justify-center py-16'>
        <p className='text-sm text-muted-foreground'>Nenhuma transação encontrada</p>
      </Card>
    )
  }

  return (
    <>
      <Card className='p-0 gap-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border hover:bg-transparent'>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className='text-right'>Valor</TableHead>
                <TableHead className='w-20'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => {
                const isIncome = tx.type === TransactionTypeEnum.INCOME
                return (
                  <TableRow key={tx.id} className='border-border'>
                    <TableCell>
                      <div className='flex items-center gap-2.5'>
                        <div
                          className='flex items-center justify-center w-7 h-7 rounded-lg text-sm shrink-0'
                          style={{ background: (tx.categoryColor ?? '#888') + '20' }}
                        >
                          {getCategoryIcon(tx.categoryIcon)}
                        </div>
                        <span className='text-sm'>{tx.categoryName}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-sm'>{tx.description}</TableCell>
                    <TableCell className='text-sm text-muted-foreground'>{formatDateFull(tx.date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className='text-[11px] px-2 py-0.5'
                        style={{
                          background: isIncome ? '#22C55E1A' : '#EF44441A',
                          color: isIncome ? '#22C55E' : '#EF4444',
                          borderColor: 'transparent'
                        }}
                      >
                        {isIncome ? (
                          <TrendingUp size={11} className='mr-1' />
                        ) : (
                          <TrendingDown size={11} className='mr-1' />
                        )}
                        {isIncome ? 'Receita' : 'Despesa'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <span
                        className='font-mono text-sm font-semibold'
                        style={{ color: isIncome ? '#22C55E' : '#EF4444' }}
                      >
                        {isIncome ? '+' : '−'}
                        {brl(tx.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onEdit(tx)}
                              className='p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer'
                            >
                              <Pencil size={14} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setPendingDelete(tx.id)}
                              className='p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer'
                            >
                              <Trash2 size={14} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={open => !open && setPendingDelete(null)}
        title='Excluir transação'
        description='Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.'
        onConfirm={() => onDelete(pendingDelete!)}
      />
    </>
  )
}
