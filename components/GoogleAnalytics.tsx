'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-V6B8HZVECW'

// ─── Page view tracker ──────────────────────────────────────────────────────
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    window.gtag?.('event', 'page_view', {
      page_path: url,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

// ─── Exported event helpers ──────────────────────────────────────────────────
export function gaEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag && GA_ID) {
    window.gtag('event', name, params)
  }
}

// Specific tracked events for e-Misión
export const gaEvents = {
  // Plan section
  planView:     (planName: string) => gaEvent('view_item', { item_name: planName, item_category: 'Plan' }),
  planClick:    (planName: string) => gaEvent('select_item', { item_name: planName, item_category: 'Plan' }),
  planPurchase: (planName: string, value: number) => gaEvent('purchase', { currency: 'COP', value, item_name: planName }),
  checkoutStart:(planName: string, value: number) => gaEvent('begin_checkout', { currency: 'COP', value, item_name: planName }),

  // Contact & CTA
  whatsappClick:   (source: string) => gaEvent('contact', { method: 'WhatsApp', source }),
  phoneClick:      () => gaEvent('contact', { method: 'Phone' }),
  customPlanClick: () => gaEvent('generate_lead', { source: 'planes_personalizados' }),

  // Chatbot
  chatbotOpen:       () => gaEvent('chatbot_open'),
  chatbotMessage:    () => gaEvent('chatbot_message'),
  chatbotLeadSubmit: () => gaEvent('generate_lead', { source: 'chatbot' }),
  chatbotTransfer:   () => gaEvent('chatbot_agent_transfer'),

  // Forms
  leadFormSubmit: (plan?: string) => gaEvent('generate_lead', { source: 'form', plan: plan ?? '' }),
  
  // Engagement
  howItWorksView:    () => gaEvent('scroll', { section: 'como_funciona' }),
  testimonialsView:  () => gaEvent('scroll', { section: 'testimonios' }),
  plansView:         () => gaEvent('scroll', { section: 'planes' }),
}

// ─── Global type augmentation ────────────────────────────────────────────────
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
