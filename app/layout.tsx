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
      logo: 'https://landing.emision.co/logo.svg',
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
        { '@type': 'Question', name: '¿Qué documentos necesito para adquirir el producto?', acceptedAnswer: { '@type': 'Answer', text: 'Rut actualizado en formato PDF. Soporte de pago. Cédula del representante legal. Resolución expedida por la DIAN, según el tipo de documento.' } },
        { '@type': 'Question', name: '¿Cuánto tiempo se demora para activar el producto?', acceptedAnswer: { '@type': 'Answer', text: 'El producto se demora 48 horas hábiles, una vez se realice el pago.' } },
        { '@type': 'Question', name: '¿Cuáles son los métodos de pago?', acceptedAnswer: { '@type': 'Answer', text: 'Transferencia a través del botón Bancolombia, tarjetas débito y crédito, Nequi, PSE, consignación bancaria.' } },
        { '@type': 'Question', name: '¿Cuál es el horario de atención de soporte técnico?', acceptedAnswer: { '@type': 'Answer', text: 'Lunes a viernes de 7:30 a.m. a 6:30 p.m. Sábados 8:00 a.m. a 2:00 p.m.' } },
        { '@type': 'Question', name: '¿Cómo funciona la integración? Y ¿Cuál es su costo?', acceptedAnswer: { '@type': 'Answer', text: 'Se envía documentación técnica con el paso a paso y ejemplos de JSON, acompañamiento con el área técnica, y no tiene ningún costo.' } },
        { '@type': 'Question', name: '¿Cómo es la capacitación y entrega de las herramientas?', acceptedAnswer: { '@type': 'Answer', text: 'Manejamos videotutoriales y capacitaciones grupales vía Teams. Una vez habilitados ante la DIAN, y en caso de requerirse una capacitación personalizada se puede solicitar con anticipación.' } },
        { '@type': 'Question', name: '¿El servicio tiene alguna cláusula de permanencia mínima?', acceptedAnswer: { '@type': 'Answer', text: 'No tenemos cláusula de permanencia.' } },
        { '@type': 'Question', name: '¿Cuáles son los estándares de seguridad de la información de las herramientas?', acceptedAnswer: { '@type': 'Answer', text: 'Contamos con la certificación ISO27001 y trabajamos con respaldo con Oracle Cloud para el almacenamiento de los documentos.' } },
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
