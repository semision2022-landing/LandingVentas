'use client'

import { useState } from 'react'
import { Check, X, ShoppingCart } from 'lucide-react'
import PaymentModal from '@/components/ui/PaymentModal'

interface PlanCardProps {
  name: string
  price: number
  productId?: number | null
  badge: string | null
  highlighted: boolean
  features: string[]
  dian: boolean
  type: 'facturacion' | 'integral'
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function PlanCard({ name, price, productId = null, badge, highlighted, features, dian, type }: PlanCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div
        className={`relative flex flex-col bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
          highlighted ? 'shadow-2xl' : 'shadow-sm hover:shadow-lg'
        }`}
        style={{
          border: highlighted ? '2px solid var(--cyan)' : '1px solid var(--gray-border)',
        }}
      >
        {/* Badge */}
        {badge && (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
            style={{
              backgroundColor: highlighted ? 'var(--cyan)' : 'var(--navy)',
              color: highlighted ? 'var(--navy)' : 'white',
            }}
          >
            {badge}
          </div>
        )}

        {/* DIAN badge */}
        {dian && (
          <div
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: 'rgba(87, 150, 1, 0.12)', color: 'var(--green)' }}
            title="Incluye habilitación DIAN"
          >
            <Check size={14} strokeWidth={3} />
          </div>
        )}

        {/* Plan name */}
        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--navy)' }}>{name}</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--gray)' }}>
          {type === 'integral' ? 'Facturación + Nómina + Recepción' : 'Facturación electrónica'}
        </p>

        {/* Price */}
        <div className="mb-5">
          <span className="text-3xl font-extrabold" style={{ color: 'var(--navy)' }}>
            {formatCOP(price)}
          </span>
          <span className="text-sm font-medium ml-1" style={{ color: 'var(--gray)' }}>/año</span>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2.5 mb-6 flex-1">
          {features.map((feature, i) => {
            const isNegative = feature.toLowerCase().includes('no incluye')
            return (
              <li key={i} className="flex items-start gap-2 text-sm">
                {isNegative ? (
                  <X size={14} className="mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
                ) : (
                  <Check size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }} strokeWidth={2.5} />
                )}
                <span style={{ color: isNegative ? 'var(--gray)' : '#334155' }}>{feature}</span>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          style={{
            backgroundColor: highlighted ? 'var(--cyan)' : 'var(--navy)',
            color: highlighted ? 'var(--navy)' : 'white',
          }}
        >
          <ShoppingCart size={15} />
          Comprar ahora
        </button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={name}
        planPrice={price}
        productId={productId}
      />
    </>
  )
}
