import { LogoIcon } from '@/components/shared/logo-icon'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — Fintrack',
}

const PrivacidadePage = () => {
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

        <h1 className='text-[1.6rem] font-semibold tracking-tight mb-2'>Política de Privacidade</h1>
        <p className='text-[13px] text-muted-foreground mb-10'>Última atualização: maio de 2026</p>

        <div className='flex flex-col gap-8 text-[14px] leading-relaxed text-foreground/90'>
          <section>
            <h2 className='font-semibold text-[15px] mb-3'>1. Quais dados coletamos</h2>
            <p className='mb-3'>Ao utilizar o Fintrack, coletamos os seguintes dados pessoais:</p>
            <ul className='list-disc list-inside flex flex-col gap-2 text-foreground/80'>
              <li>
                <strong>Nome e e-mail</strong> — fornecidos no cadastro, usados para identificação e comunicação
              </li>
              <li>
                <strong>Senha</strong> — armazenada de forma criptografada (bcrypt), nunca em texto puro
              </li>
              <li>
                <strong>Dados financeiros</strong> — transações, categorias e metas que você registra voluntariamente
              </li>
            </ul>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>2. Por que coletamos</h2>
            <ul className='list-disc list-inside flex flex-col gap-2 text-foreground/80'>
              <li>Fornecer e operar o serviço de controle financeiro</li>
              <li>Enviar e-mails transacionais (ex: código de recuperação de senha)</li>
              <li>Garantir a segurança da conta e prevenir acessos não autorizados</li>
            </ul>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>3. Por quanto tempo armazenamos</h2>
            <p>
              Seus dados são armazenados enquanto sua conta estiver ativa. Após a solicitação de exclusão de conta,
              todos os dados pessoais e financeiros associados são removidos permanentemente em até 7 dias úteis.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>4. Compartilhamento de dados</h2>
            <p className='mb-3'>
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.
            </p>
            <p>
              Utilizamos o serviço{' '}
              <strong>Resend</strong> exclusivamente para o envio de e-mails transacionais (como recuperação de senha).
              Apenas o endereço de e-mail necessário para o envio é processado por esse serviço.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>5. Segurança</h2>
            <ul className='list-disc list-inside flex flex-col gap-2 text-foreground/80'>
              <li>Senhas armazenadas com hash bcrypt</li>
              <li>Comunicação via HTTPS com certificado SSL</li>
              <li>Autenticação por JWT com expiração</li>
              <li>Rate limiting por IP para proteger contra abusos</li>
              <li>Cada usuário acessa apenas seus próprios dados</li>
            </ul>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>6. Seus direitos (LGPD)</h2>
            <p className='mb-3'>
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
            </p>
            <ul className='list-disc list-inside flex flex-col gap-2 text-foreground/80'>
              <li>Acessar os dados que temos sobre você</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
            <p className='mt-3'>
              Para exercer qualquer um desses direitos, envie um e-mail para{' '}
              <a href='mailto:contact@send.gabrielporto.me' className='text-primary hover:underline'>
                contact@send.gabrielporto.me
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>7. Cookies e armazenamento local</h2>
            <p>
              O Fintrack utiliza o <strong>localStorage</strong> do navegador para armazenar o token de autenticação
              JWT. Nenhum cookie de rastreamento ou publicidade é utilizado.
            </p>
          </section>

          <section>
            <h2 className='font-semibold text-[15px] mb-3'>8. Contato</h2>
            <p>
              Dúvidas sobre esta política? Entre em contato pelo e-mail{' '}
              <a href='mailto:contact@send.gabrielporto.me' className='text-primary hover:underline'>
                contact@send.gabrielporto.me
              </a>
              .
            </p>
          </section>
        </div>

        <div className='mt-12 pt-8 border-t border-white/10 text-center'>
          <p className='text-[12px] text-muted-foreground'>
            Veja também nossos{' '}
            <Link href='/termos' className='text-primary hover:underline'>
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacidadePage
