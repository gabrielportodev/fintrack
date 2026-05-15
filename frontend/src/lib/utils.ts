import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(err: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback
  }
  return fallback
}
