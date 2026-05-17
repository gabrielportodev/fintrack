'use client'

import type { LoginSchemaType, RegisterSchemaType } from '@/schemas/auth.schema'
import { createContext, useContext, useEffect, useState } from 'react'
import type { UserType, RegisterType, TokenType } from '@/types/auth'
import { useLoading } from '@/hooks/use-loading'
import type { ApiResponse } from '@/types/api'
import { authService } from '@/lib/api/auth'
import { getToken } from '@/lib/token'

type AuthContextType = {
  user: UserType | null
  isLoading: boolean
  login: (data: LoginSchemaType) => Promise<ApiResponse<TokenType>>
  register: (data: Omit<RegisterSchemaType, 'acceptTerms'>) => Promise<ApiResponse<RegisterType>>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('Erro ao encontrar contexto de autenticação. Tente novamente.')
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const { loading, startLoading, stopLoading } = useLoading(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      stopLoading()
      return
    }

    let cancelled = false
    startLoading()
    authService
      .me()
      .then(user => {
        if (!cancelled) setUser(user)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) stopLoading()
      })

    return () => {
      cancelled = true
    }
  }, [startLoading, stopLoading])

  const login = async (data: LoginSchemaType) => {
    const response = await authService.login(data)
    const me = await authService.me()
    setUser(me)
    return response
  }

  const register = async (data: Omit<RegisterSchemaType, 'acceptTerms'>) => {
    return authService.register(data)
  }

  const logout = () => {
    setUser(null)
    authService.logout()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading: loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
