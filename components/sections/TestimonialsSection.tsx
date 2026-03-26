'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Mayra Cano',
    company: 'Distribuidora Cano & Asociados',
    role: 'Contadora',
    text: 'Excelente aliado, precios justos y fácil de usar. La habilitación DIAN fue en menos de 48 horas como prometieron.',
    rating: 5,
    color: '#5F4EDA',
  },
  {
    name: 'Juan Manuel Zuluaga',
    company: 'Ferretería El Perno S.A.S.',
    role: 'Gerente',
    text: '3 años trabajando con e-Misión. Servicio excepcional, soporte cuando lo necesitamos y plataforma muy estable.',
    rating: 5,
    color: '#00D0FF',
  },
  {
    name: 'Liliana Ramírez',
    company: 'Consultora Independiente',
    role: 'Asesora Comercial',
    text: 'Excelente servicio y soporte. Los recomiendo a todas mis empresas clientes. Muy confiables y profesionales.',
    rating: 5,
    color: '#579601',
  },
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function TestimonialsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--gray-light)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Lo que dicen nuestros clientes
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Más de 10.000 empresas colombianas ya confían en e-Misión
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} size={14} fill="currentColor" style={{ color: '#F59E0B' }} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#475569' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--gray)' }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
