import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
  return (
    <header className='flex items-center justify-between px-8 py-6 border-b border-border shrink-0'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
        {subtitle && <p className='text-sm text-muted-foreground mt-0.5'>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}
