import type { TransactionType } from '@/types/transaction'
import { TransactionTypeEnum } from '@/types/transaction'
import { Loading } from '@/components/shared/loading'
import { brl, formatDateShort } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface RecentTransactionsProps {
  transactions: TransactionType[]
  loading: boolean
}

export const RecentTransactions = ({ transactions, loading }: RecentTransactionsProps) => {
  return (
    <Card className='p-0 gap-0'>
      <div className='flex items-center justify-between px-5 py-4 border-b border-border'>
        <p className='font-semibold'>Últimas transações</p>
        <Link href='/transactions' className='text-xs text-primary hover:underline'>
          Ver todas
        </Link>
      </div>

      {loading ? (
        <Loading className='py-10' />
      ) : transactions.length === 0 ? (
        <div className='py-10 text-center text-sm text-muted-foreground'>Nenhuma transação este mês</div>
      ) : (
        <div className='divide-y divide-border'>
          {transactions.map(tx => {
            const isIncome = tx.type === TransactionTypeEnum.INCOME
            return (
              <div key={tx.id} className='flex items-center gap-4 px-5 py-3.5'>
                <div
                  className='flex items-center justify-center w-9 h-9 rounded-lg text-base shrink-0'
                  style={{ background: (tx.categoryColor ?? '#888') + '20' }}
                >
                  {tx.categoryIcon}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>{tx.description}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>{tx.categoryName}</p>
                </div>
                <p className='hidden text-xs text-muted-foreground sm:block'>{formatDateShort(tx.date)}</p>
                <Badge
                  variant='outline'
                  className='hidden text-[10px] px-2 py-0 sm:flex'
                  style={{
                    background: isIncome ? '#22C55E1A' : '#EF44441A',
                    color: isIncome ? '#22C55E' : '#EF4444',
                    borderColor: 'transparent'
                  }}
                >
                  {isIncome ? 'Receita' : 'Despesa'}
                </Badge>
                <p
                  className='font-mono text-sm font-semibold w-28 text-right'
                  style={{ color: isIncome ? '#22C55E' : '#EF4444' }}
                >
                  {isIncome ? '+' : '−'}
                  {brl(tx.amount)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
