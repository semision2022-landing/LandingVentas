'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlanCard from '@/components/ui/PlanCard'
import { type WCProduct } from '@/lib/woocommerce'
import WhatsAppLeadModal from '@/components/ui/WhatsAppLeadModal'

interface PlansSectionProps {
  wcProducts?: WCProduct[]
}

const billingPlans = [
  { name: 'Plan 25', staticPrice: 120000, wcProductId: 2994, docs: '25 documentos', dian: false, popular: false, badge: null },
  { name: 'Plan 100', staticPrice: 239000, wcProductId: 12521, docs: '100 documentos', dian: false, popular: true, badge: '⭐ Popular' },
  { name: 'Plan 150', staticPrice: 289000, wcProductId: 2991, docs: '150 documentos', dian: false, popular: false, badge: null },
  { name: 'Plan 500', staticPrice: 411000, wcProductId: 14266, docs: '500 documentos', dian: true, popular: false, badge: null },
  { name: 'Plan 1000', staticPrice: 503000, wcProductId: 14267, docs: '1.000 documentos', dian: true, popular: false, badge: null },
  { name: 'Plan 2500', staticPrice: 556000, wcProductId: 14268, docs: '2.500 documentos', dian: true, popular: false, badge: null },
  { name: 'Plan X', staticPrice: 620000, wcProductId: 2988, docs: '5.000 documentos', dian: true, popular: false, badge: '⭐ Más vendido' },
  { name: 'Plan XM', staticPrice: 932000, wcProductId: 12526, docs: '8.000 documentos', dian: true, popular: false, badge: null },
  { name: 'Plan XL', staticPrice: 1139000, wcProductId: 12527, docs: '10.000 documentos', dian: true, popular: false, badge: null },
]

const integralPlans = [
  {
    name: 'Plan Estándar',
    staticPrice: 952000,
    wcProductId: 6680,
    docs: '5.000 documentos electrónicos',
    nomina: 'Nómina hasta 10 empleados',
    recepcion: 'Recepción R300',
    dian: true,
    popular: false,
    badge: null,
  },
  {
    name: 'Plan Plus',
    staticPrice: 1087000,
    wcProductId: 9333,
    docs: '8.000 documentos electrónicos',
    nomina: 'Nómina hasta 15 empleados',
    recepcion: 'Recepción R500',
    dian: true,
    popular: true,
    badge: '⭐ Recomendado',
  },
  {
    name: 'Plan Premium',
    staticPrice: 1415000,
    wcProductId: 6696,
    docs: '10.000 documentos electrónicos',
    nomina: 'Nómina electrónica incluida',
    recepcion: 'Recepción R1000',
    dian: true,
    popular: false,
    badge: null,
  },
]

type Tab = 'facturacion' | 'integral'

export default function PlansSection({ wcProducts = [] }: PlansSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('facturacion')
  const [waModalOpen, setWaModalOpen] = useState(false)

  return (
    <>
      <section
        id="planes"
        className="py-20"
        style={{ backgroundColor: 'var(--gray-light)' }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: 'rgba(24, 34, 76, 0.08)', color: 'var(--navy)' }}
          >
            Planes y precios
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Elige el plan ideal para tu empresa
          </motion.h2>
          <motion.p
            className="section-subtitle max-w-lg mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Precios anuales en pesos colombianos. Sin costos ocultos. Soporte técnico incluido.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ backgroundColor: 'rgba(24, 34, 76, 0.08)' }}
          >
            {[
              { id: 'facturacion' as Tab, label: 'Facturación Electrónica' },
              { id: 'integral' as Tab, label: 'Planes Integrales' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--navy)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--gray)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 'facturacion' ? (
            <motion.div
              key="facturacion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 [&>*:last-child:nth-child(4n+1)]:xl:col-start-2 [&>*:last-child:nth-child(4n+1)]:xl:col-span-2"
            >
              {billingPlans.map((plan) => {
                const wcInfo = wcProducts.find((p) => p.id === plan.wcProductId)
                return (
                  <PlanCard
                    key={plan.name}
                    name={plan.name}
                    price={wcInfo ? wcInfo.price : plan.staticPrice}
                    productId={plan.wcProductId}
                    badge={plan.badge}
                    highlighted={plan.popular}
                    features={[
                      plan.docs + ' electrónicos',
                      'Factura, nota crédito, nota débito, doc. soporte',
                      'Soporte técnico gratuito',
                      plan.dian ? 'Habilitación DIAN GRATIS en 48h' : 'No incluye habilitación DIAN',
                    ]}
                    dian={plan.dian}
                    type="facturacion"
                  />
                )
              })}
            </motion.div>

          ) : (
            <motion.div
              key="integral"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {integralPlans.map((plan) => {
                const wcInfo = wcProducts.find((p) => p.id === plan.wcProductId)
                return (
                  <PlanCard
                    key={plan.name}
                    name={plan.name}
                    price={wcInfo ? wcInfo.price : plan.staticPrice}
                    productId={plan.wcProductId}
                    badge={plan.badge}
                    highlighted={plan.popular}
                    features={[
                      plan.docs,
                      plan.nomina,
                      plan.recepcion,
                      'Habilitación DIAN GRATIS en 48h',
                      'Soporte técnico gratuito',
                    ]}
                    dian={true}
                    type="integral"
                  />
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── CTA Planes Personalizados ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-14 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #223870 100%)' }}
        >
          <div className="px-6 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex-1">
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: 'rgba(0,208,255,0.15)', color: 'var(--cyan)' }}
              >
                +80 planes disponibles
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                ¿Necesitas un plan a la medida?{' '}
                <span style={{ color: 'var(--cyan)' }}>Te asesoramos gratis.</span>
              </h3>
              <p className="text-white/70 text-sm md:text-base max-w-xl">
                Manejamos más de 80 planes adaptados a cada empresa. Un asesor te ayuda a
                elegir el perfecto para tu operación — sin costo adicional.
              </p>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => setWaModalOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .06 5.435.057 12.01c0 2.052.518 4.05 1.504 5.816L0 24l6.335-1.652a12.062 12.062 0 005.71 1.449h.005c6.554 0 11.89-5.435 11.893-12.009a11.88 11.88 0 00-3.48-8.413z"/>
                </svg>
                Planes personalizados — Contáctanos ahora
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
    <WhatsAppLeadModal isOpen={waModalOpen} onClose={() => setWaModalOpen(false)} />
    </>
  )
}
