'use client'

import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { clearToken, getToken } from '@/lib/token'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const isAuthorized = useMemo(() => {
    const token = getToken()

    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = new Date().getTime() / 1000
      const isExpired = payload.exp < now

      return !isExpired
    } catch {
      clearToken()
      return false
    }
  }, [])

  useEffect(() => {
    if (!isAuthorized) {
      router.replace('/auth/sign-in')
    }
  }, [isAuthorized, router])

  if (!isAuthorized) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
}
