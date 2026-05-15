import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export const PageWrapper = ({ children, className }: PageWrapperProps) => {
  return <div className={cn('flex-1 px-8 py-6 flex flex-col gap-6 overflow-y-auto', className)}>{children}</div>
}
