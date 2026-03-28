import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TrustBar from '@/components/sections/TrustBar'
import LogoStrip from '@/components/sections/LogoStrip'
import ServicesSection from '@/components/sections/ServicesSection'
import PlansSection from '@/components/sections/PlansSection'
import RiskReversal from '@/components/sections/RiskReversal'
import HowItWorks from '@/components/sections/HowItWorks'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalCTASection from '@/components/sections/FinalCTASection'
import ChatWidget from '@/components/chat/ChatWidget'
import SocialProofToast from '@/components/ui/SocialProofToast'

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
      </main>
      <Footer />
      <ChatWidget />
      <SocialProofToast />
    </>
  )
}
