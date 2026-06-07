'use client'

import { Sparkles, X, Send, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { aiService } from '@/lib/api/ai'
import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGESTOES = ['Quanto gastei esse mês?', 'Quais minhas maiores categorias de gasto?']

export const AiChatWidget = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (pergunta: string) => {
    const texto = pergunta.trim()
    if (!texto || loading) return

    setMessages(prev => [...prev, { role: 'user', content: texto }])
    setInput('')
    setLoading(true)
    try {
      const { data } = await aiService.ask(texto)
      setMessages(prev => [...prev, { role: 'assistant', content: data }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Não consegui responder agora. Tente novamente em instantes.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className='fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg'
        aria-label='Abrir assistente de IA'
      >
        <Sparkles className='size-5' />
      </Button>
    )
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 flex h-112 w-88 max-w-[calc(100vw-3rem)] flex-col rounded-xl border border-border bg-card shadow-2xl'>
      <header className='flex items-center justify-between border-b border-border px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Sparkles className='size-4 text-primary' />
          <span className='text-sm font-semibold'>Assistente Fintrack</span>
        </div>
        <Button variant='ghost' size='icon' className='size-7' onClick={() => setOpen(false)} aria-label='Fechar'>
          <X className='size-4' />
        </Button>
      </header>

      <div className='flex-1 space-y-3 overflow-y-auto px-4 py-3'>
        {messages.length === 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-muted-foreground'>Pergunte sobre seus gastos. Por exemplo:</p>
            {SUGESTOES.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className='rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-muted'
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
              m.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted text-foreground'
            )}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Loader2 className='size-4 animate-spin' /> Pensando…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          send(input)
        }}
        className='flex items-center gap-2 border-t border-border p-3'
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Quanto gastei com comida em maio?'
          disabled={loading}
        />
        <Button type='submit' size='icon' disabled={loading || !input.trim()} aria-label='Enviar'>
          <Send className='size-4' />
        </Button>
      </form>
    </div>
  )
}
