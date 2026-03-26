'use client'

import { motion } from 'framer-motion'
import { MousePointer, CreditCard, Zap } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MousePointer,
    title: 'Elige tu plan',
    description: 'Selecciona el plan ideal para el volumen de facturas de tu empresa.',
    color: 'var(--cyan)',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Paga en línea',
    description: 'Pago 100% seguro con PayZen. Tarjeta de crédito, débito o transferencia.',
    color: 'var(--purple)',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Empieza a facturar',
    description: 'Habilitación ante la DIAN en 48 horas hábiles. Soporte técnico incluido.',
    color: 'var(--green)',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            ¿Cómo funciona?
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Comienza a facturar legalmente en 3 simples pasos
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px opacity-20"
            style={{ backgroundColor: 'var(--navy)', left: '22%', right: '22%' }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                {/* Number + Icon */}
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-3 transition-transform duration-300 hover:scale-105"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    <Icon size={32} />
                  </div>
                  <span
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--gray)' }}>
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
