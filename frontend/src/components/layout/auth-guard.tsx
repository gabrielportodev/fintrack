'use client'

import { Loading } from '@/components/shared/loading'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/sign-in')
    }
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return <>{children}</>
}
