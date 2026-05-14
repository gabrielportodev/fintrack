import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Fintrack — Controle financeiro pessoal',
  description: 'Gerencie suas finanças pessoais com simplicidade e clareza.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' className={cn('h-full antialiased', inter.variable, jetbrainsMono.variable)}>
      <body className='min-h-full flex flex-col font-sans bg-background text-foreground'>{children}</body>
    </html>
  )
}
