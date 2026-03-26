'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlanCard from '@/components/ui/PlanCard'
import { type WCProduct } from '@/lib/woocommerce'

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

  return (
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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
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
      </div>
    </section>
  )
}
