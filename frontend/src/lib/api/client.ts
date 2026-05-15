import { clearToken, getToken } from '@/lib/token'
import { toast } from 'sonner'
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const AUTH_ROUTES = ['/api/auth/login', '/api/auth/register']

api.interceptors.response.use(
  response => response,
  error => {
    const requestUrl = error.config?.url ?? ''
    const isAuthRoute = AUTH_ROUTES.some(route => requestUrl.includes(route))

    if (error.response?.status === 401 && !isAuthRoute) {
      clearToken()
      window.location.href = '/auth/sign-in'
      toast.error('Sessão expirada')
    }

    return Promise.reject(error)
  }
)
