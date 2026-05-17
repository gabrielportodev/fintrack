export enum TransactionTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export type TransactionType = {
  id: string
  description: string
  amount: number
  type: TransactionTypeEnum
  date: string
  categoryId: string
  categoryName: string
  categoryColor: string
  categoryIcon: string
  createdAt: string
}

export type MonthlySummaryType = {
  income: number
  expense: number
  balance: number
}

export type MonthlySummaryRangeType = {
  month: number
  year: number
  income: number
  expense: number
  balance: number
}
