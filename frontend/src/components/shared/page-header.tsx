import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
  return (
    <header className='flex flex-col gap-3 px-4 py-4 border-b border-border shrink-0 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6'>
      <div className='min-w-0'>
        <h1 className='text-xl font-semibold tracking-tight sm:text-2xl'>{title}</h1>
        {subtitle && <p className='text-sm text-muted-foreground mt-0.5'>{subtitle}</p>}
      </div>
      {action && <div className='shrink-0'>{action}</div>}
    </header>
  )
}
