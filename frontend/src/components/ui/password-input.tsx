'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function PasswordInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className='relative'>
      <Input type={visible ? 'text' : 'password'} className={cn('pr-9', className)} {...props} />
      <button
        type='button'
        tabIndex={-1}
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        className='absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground'
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

export { PasswordInput }
