'use client'

import { AuthProvider } from '@/contexts/auth-context'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
    </AuthProvider>
  )
}
