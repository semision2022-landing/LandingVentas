import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://landing.emision.co'),
  title: 'Facturación Electrónica Colombia | e-Misión — Avalado DIAN',
  description:
    'Emite facturas electrónicas desde $120.000/año. +10.000 empresas confían en e-Misión. Habilitación DIAN en 48h. Nómina, POS y SG-SST.',
  keywords: [
    'facturación electrónica Colombia',
    'proveedor DIAN',
    'factura electrónica',
    'nómina electrónica',
    'e-Misión',
    'facturación DIAN',
    'habilitación DIAN',
  ],
  authors: [{ name: 'Nodexum S.A.S.' }],
  openGraph: {
    title: 'Facturación Electrónica Colombia | e-Misión — Avalado DIAN',
    description:
      'Emite facturas electrónicas desde $120.000/año. +10.000 empresas confían en e-Misión. Habilitación DIAN en 48h.',
    url: 'https://landing.emision.co',
    siteName: 'e-Misión',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'e-Misión — Facturación Electrónica' }],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facturación Electrónica Colombia | e-Misión',
    description: 'Emite facturas electrónicas desde $120.000/año. Avalado por la DIAN.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://ventas.emision.co' },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://landing.emision.co/#organization',
      name: 'e-Misión',
      legalName: 'Nodexum S.A.S.',
      url: 'https://landing.emision.co',
      logo: 'https://landing.emision.co/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+57-604-590-3572',
        contactType: 'customer service',
        availableLanguage: 'Spanish',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://landing.emision.co/#localbusiness',
      name: 'e-Misión',
      description: 'Empresa colombiana de documentos electrónicos avalada por la DIAN',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Cra 44 # 23 sur 15',
        addressLocality: 'Envigado',
        addressRegion: 'Antioquia',
        addressCountry: 'CO',
      },
      telephone: '+57-604-590-3572',
      email: 'contacto@emision.co',
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:00', closes: '18:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:00', closes: '14:00' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: '¿Qué documentos necesito para habilitarme ante la DIAN?', acceptedAnswer: { '@type': 'Answer', text: 'RUT actualizado, resolución de facturación electrónica y copia de la cédula del representante legal o persona natural.' } },
        { '@type': 'Question', name: '¿En cuánto tiempo me habilitan ante la DIAN?', acceptedAnswer: { '@type': 'Answer', text: 'En 48 horas hábiles después de recibir los documentos completos. Los planes de $500 en adelante incluyen la habilitación gratis.' } },
        { '@type': 'Question', name: '¿La plataforma funciona en el celular?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, es 100% en la nube y funciona en cualquier dispositivo sin necesidad de instalación.' } },
        { '@type': 'Question', name: '¿Qué pasa si se me acaban los documentos del plan?', acceptedAnswer: { '@type': 'Answer', text: 'Puedes adquirir documentos adicionales o cambiar a un plan de mayor capacidad cuando lo necesites.' } },
        { '@type': 'Question', name: '¿El soporte técnico tiene costo adicional?', acceptedAnswer: { '@type': 'Answer', text: 'No, el soporte técnico está incluido en todos los planes de forma gratuita en horario laboral.' } },
        { '@type': 'Question', name: '¿Puedo emitir notas crédito y débito?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, todos los planes incluyen facturas electrónicas, notas crédito, notas débito, notas de ajuste y documento soporte.' } },
      ],
    },
    {
      '@type': 'Product',
      name: 'Plan X — Facturación Electrónica',
      description: '5.000 documentos electrónicos con habilitación DIAN GRATIS en 48h',
      brand: { '@type': 'Organization', name: 'e-Misión' },
      offers: { '@type': 'Offer', price: '620000', priceCurrency: 'COP', availability: 'https://schema.org/InStock' },
    },
    {
      '@type': 'Product',
      name: 'Plan Plus — Integral',
      description: '8.000 documentos + Nómina electrónica hasta 15 empleados + Recepción R500',
      brand: { '@type': 'Organization', name: 'e-Misión' },
      offers: { '@type': 'Offer', price: '1087000', priceCurrency: 'COP', availability: 'https://schema.org/InStock' },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
