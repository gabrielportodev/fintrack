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

export const brl = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export const formatDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')

export const formatDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatDateFull = (iso: string) => new Date(iso).toLocaleDateString('pt-BR')
