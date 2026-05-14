import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Faq } from '@/components/landing/faq'
import { Cta } from '@/components/landing/cta'

const LandingPage = () => {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Navbar />
      <main>
        <Hero />
        <section id='recursos'>
          <Features />
        </section>
        <section id='como-funciona'>
          <HowItWorks />
        </section>
        <section id='faq'>
          <Faq />
        </section>
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
