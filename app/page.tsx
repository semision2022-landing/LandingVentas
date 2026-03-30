import dynamic from 'next/dynamic'

// ── CRITICAL PATH: cargan sin lazy (afectan LCP directamente) ──
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import Footer from '@/components/layout/Footer'

// ── BELOW THE FOLD: dynamic imports → se descargan en hilos separados ──
const TrustBar = dynamic(() => import('@/components/sections/TrustBar'), { ssr: true })
const LogoStrip = dynamic(() => import('@/components/sections/LogoStrip'), { ssr: true })
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'), { ssr: true })
const PlansSection = dynamic(() => import('@/components/sections/PlansSection'), { ssr: false })
const RiskReversal = dynamic(() => import('@/components/sections/RiskReversal'), { ssr: true })
const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks'), { ssr: true })
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), { ssr: false })
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: true })
const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'), { ssr: true })
const CertificationsSection = dynamic(() => import('@/components/sections/CertificationsSection'), { ssr: true })

// ── DEFER: sin ssr, carga después de hidratación ──
const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), { ssr: false })
const SocialProofToast = dynamic(() => import('@/components/ui/SocialProofToast'), { ssr: false })

import { getWooCommerceProducts } from '@/lib/woocommerce'

export default async function HomePage() {
  const wcProducts = await getWooCommerceProducts()

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <LogoStrip />
        <ServicesSection />
        <PlansSection wcProducts={wcProducts} />
        <RiskReversal />
        <HowItWorks />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
        <CertificationsSection />
      </main>
      <Footer />
      <ChatWidget />
      <SocialProofToast />
    </>
  )
}
