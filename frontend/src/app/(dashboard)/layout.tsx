'use client'

import { AuthGuard } from '@/components/layout/auth-guard'
import { LogoIcon } from '@/components/shared/logo-icon'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className='flex h-screen overflow-hidden bg-background'>
        <Sidebar mobileOpen={sidebarOpen} onMobileOpenChange={setSidebarOpen} />
        <main className='flex-1 flex flex-col overflow-hidden min-w-0'>
          <div className='flex items-center gap-3 px-4 py-3 border-b border-border shrink-0 md:hidden'>
            <Button variant='outline' size='icon' onClick={() => setSidebarOpen(true)} className='rounded-lg shrink-0'>
              <Menu size={18} />
            </Button>
            <div className='flex items-center gap-2'>
              <LogoIcon />
              <span className='text-base font-semibold tracking-tight'>Fintrack</span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
