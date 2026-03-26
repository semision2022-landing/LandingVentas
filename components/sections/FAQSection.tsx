'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: '¿Qué documentos necesito para habilitarme ante la DIAN?',
    a: 'RUT actualizado, resolución de facturación electrónica y copia de la cédula del representante legal o persona natural.',
  },
  {
    q: '¿En cuánto tiempo me habilitan ante la DIAN?',
    a: 'En 48 horas hábiles después de recibir los documentos completos. Los planes de $500 en adelante incluyen la habilitación gratis.',
  },
  {
    q: '¿La plataforma funciona en el celular?',
    a: 'Sí, es 100% en la nube y funciona en cualquier dispositivo sin necesidad de instalación.',
  },
  {
    q: '¿Qué pasa si se me acaban los documentos del plan?',
    a: 'Puedes adquirir documentos adicionales o cambiar a un plan de mayor capacidad cuando lo necesites.',
  },
  {
    q: '¿El soporte técnico tiene costo adicional?',
    a: 'No, el soporte técnico está incluido en todos los planes de forma gratuita en horario laboral.',
  },
  {
    q: '¿Puedo emitir notas crédito y débito?',
    a: 'Sí, todos los planes incluyen facturas electrónicas, notas crédito, notas débito, notas de ajuste y documento soporte.',
  },
]

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden transition-shadow duration-200"
      style={{
        border: isOpen ? '1px solid var(--navy)' : '1px solid var(--gray-border)',
        boxShadow: isOpen ? '0 4px 20px rgba(24, 34, 76, 0.1)' : 'none',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm md:text-base font-semibold leading-snug"
          style={{ color: 'var(--navy)' }}
        >
          {q}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: isOpen ? 'var(--navy)' : 'rgba(24, 34, 76, 0.08)',
            color: isOpen ? 'white' : 'var(--navy)',
          }}
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--gray)' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Preguntas frecuentes
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ¿Tienes más dudas? Escríbenos al{' '}
            <a href="https://wa.me/573044796885" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)' }} className="font-semibold hover:underline">
              WhatsApp
            </a>
          </motion.p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
