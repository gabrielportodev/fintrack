import { LogoIcon } from '@/components/shared/logo-icon'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Termos de Uso — Fintrack'
}

const TermosPage = () => {
  return (
    <div className='min-h-screen bg-background px-4 py-12 relative'>
      <Link
        href='/'
        className='fixed top-6 left-6 flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft size={14} />
        Início
      </Link>

      <div className='max-w-[680px] mx-auto'>
        <div className='flex flex-col items-center gap-3 mb-10'>
          <LogoIcon />
          <span className='font-semibold text-[16px] tracking-tight'>Fintrack</span>
        </div>

        <h1 className='text-[1.6rem] font-semibold tracking-tight mb-2'>Termos de Uso</h1>
        <p className='text-[13px] text-muted-foreground mb-10'>Última atualização: maio de 2026</p>

        <div className='flex flex-col gap-8 text-[14px] leading-relaxed text-foreground/90'>
          <section>
            <h2 className='font-semibold text-[15px] mb-3'>1. Aceitação dos termos</h2>
            <p>
              Ao criar uma conta no Fintrack, você declara que leu, entendeu e concorda com estes Termos de Uso. Se você
              não concordar com algum ponto, não utilize o serviço.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>2. Descrição do serviço</h2>
            <p>
              O Fintrack é uma plataforma gratuita de controle de finanças pessoais que permite registrar receitas,
              despesas, categorias e metas mensais. O serviço é fornecido &ldquo;como está&rdquo;, sem garantias de
              disponibilidade contínua ou ausência de erros.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>3. Responsabilidades do usuário</h2>
            <ul className='list-disc list-inside flex flex-col gap-2 text-foreground/80'>
              <li>Manter suas credenciais de acesso em sigilo</li>
              <li>Informar dados verídicos no cadastro</li>
              <li>Não utilizar o serviço para fins ilegais ou fraudulentos</li>
              <li>Não tentar comprometer a segurança ou a disponibilidade da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>4. Dados financeiros</h2>
            <p>
              Os dados financeiros inseridos no Fintrack (transações, categorias, metas) são de sua exclusiva
              responsabilidade. O Fintrack não realiza nenhum tipo de operação financeira real — a plataforma serve
              apenas como ferramenta de registro e visualização.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>5. Limitação de responsabilidade</h2>
            <p>
              O Fintrack não se responsabiliza por decisões financeiras tomadas com base nos dados registrados na
              plataforma, por perda de dados decorrente de falhas técnicas, ou por danos indiretos de qualquer natureza.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>6. Encerramento de conta</h2>
            <p>
              Você pode solicitar a exclusão da sua conta e de todos os dados associados a qualquer momento, enviando um
              e-mail para{' '}
              <a href='mailto:contact@send.gabrielporto.me' className='text-primary hover:underline'>
                contact@send.gabrielporto.me
              </a>
              . A exclusão é irreversível.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>7. Modificações</h2>
            <p>
              Estes termos podem ser atualizados a qualquer momento. Alterações relevantes serão comunicadas na
              plataforma. O uso continuado do serviço após as alterações implica aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>8. Contato</h2>
            <p>
              Em caso de dúvidas, entre em contato pelo e-mail{' '}
              <a href='mailto:contact@send.gabrielporto.me' className='text-primary hover:underline'>
                contact@send.gabrielporto.me
              </a>
              .
            </p>
          </section>
        </div>

        <div className='mt-12 pt-8 border-t border-white/10 text-center'>
          <p className='text-[12px] text-muted-foreground'>
            Veja também nossa{' '}
            <Link href='/privacidade' className='text-primary hover:underline'>
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermosPage
