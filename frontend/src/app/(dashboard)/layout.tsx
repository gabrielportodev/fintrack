'use client'

import { AuthGuard } from '@/components/layout/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className='flex h-screen overflow-hidden bg-background'>
        <Sidebar />
        <main className='flex-1 flex flex-col overflow-hidden pt-16 md:pt-0'>{children}</main>
      </div>
    </AuthGuard>
  )
}
