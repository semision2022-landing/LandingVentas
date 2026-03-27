'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { fbEvent, generateEventId } from '@/lib/fbq'
import WhatsAppLeadModal from '@/components/ui/WhatsAppLeadModal'

const faqs = [
  {
    q: '¿Qué documentos necesito para adquirir el producto?',
    a: 'Rut actualizado en formato PDF. Soporte de pago. Cédula del representante legal. Resolución expedida por la DIAN, según el tipo de documento.',
  },
  {
    q: '¿Cuánto tiempo se demora para activar el producto?',
    a: 'El producto se demora 48 horas hábiles, una vez se realice el pago.',
  },
  {
    q: '¿Cuáles son los métodos de pago?',
    a: 'Transferencia a través del botón Bancolombia, tarjetas débito y crédito, Nequi, PSE, consignación bancaria.',
  },
  {
    q: '¿Cuál es el horario de atención de soporte técnico?',
    a: 'Lunes a viernes de 7:30 a.m. a 6:30 p.m. Sábados 8:00 a.m. a 2:00 p.m.',
  },
  {
    q: '¿Cómo funciona la integración? Y ¿Cuál es su costo?',
    a: 'Se envía documentación técnica con el paso a paso y ejemplos de JSON, acompañamiento con el área técnica, y no tiene ningún costo.',
  },
  {
    q: '¿Cómo es la capacitación y entrega de las herramientas?',
    a: 'Manejamos videotutoriales y capacitaciones grupales vía Teams. Una vez habilitados ante la DIAN, y en caso de requerirse una capacitación personalizada se puede solicitar con anticipación.',
  },
  {
    q: '¿El servicio tiene alguna cláusula de permanencia mínima?',
    a: 'No tenemos cláusula de permanencia.',
  },
  {
    q: '¿Cuáles son los estándares de seguridad de la información de las herramientas?',
    a: 'Contamos con la certificación ISO27001 y trabajamos con respaldo con Oracle Cloud para el almacenamiento de los documentos.',
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
  const [waModalOpen, setWaModalOpen] = useState(false)

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
            <button
              onClick={() => { fbEvent('Contact', { content_name: 'WhatsApp FAQ' }, generateEventId()); setWaModalOpen(true) }}
              className="font-semibold hover:underline"
              style={{ color: 'var(--navy)' }}
            >
              WhatsApp
            </button>
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
      <WhatsAppLeadModal isOpen={waModalOpen} onClose={() => setWaModalOpen(false)} />
    </section>
  )
}
