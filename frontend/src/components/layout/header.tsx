'use client'

import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

interface HeaderProps {
  title?: string
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <div className='flex items-center justify-between px-8 py-4 border-b border-border bg-background/50 shrink-0'>
      {title && <p className='text-sm font-medium text-muted-foreground'>{title}</p>}
      <div className='ml-auto flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='w-8 h-8 text-muted-foreground'>
          <Bell size={15} />
        </Button>
      </div>
    </div>
  )
}
