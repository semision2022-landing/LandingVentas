'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

const testimonials = [
  {
    name: 'Juan Manuel Zuluaga',
    company: 'Ferretería El Perno S.A.S.',
    role: 'Gerente General',
    text: '3 años trabajando con e-Misión. Servicio excepcional, soporte inmediato cuando lo necesitamos y la plataforma nunca ha fallado. Los recomiendo totalmente.',
    metric: '3 años como cliente',
    metricColor: 'var(--cyan)',
    rating: 5,
    color: '#00D0FF',
  },
  {
    name: 'Mayra Cano',
    company: 'Distribuidora Cano & Asociados',
    role: 'Contadora Pública',
    text: 'Excelente aliado para el cumplimiento DIAN. Precios justos y muy fácil de usar. La habilitación fue en menos de 48 horas como prometieron.',
    metric: 'Ahorra 4 horas/semana en contabilidad',
    metricColor: 'var(--green)',
    rating: 5,
    color: '#5F4EDA',
  },
  {
    name: 'Liliana Ramírez',
    company: 'Consultora Independiente',
    role: 'Asesora Comercial',
    text: 'Ya llevé a más de 12 empresas clientes a e-Misión. Todos felices. El soporte técnico es rápido y nunca nos han cobrado nada extra por ayudarnos.',
    metric: '+12 clientes migrados exitosamente',
    metricColor: 'var(--purple)',
    rating: 5,
    color: '#579601',
  },
  {
    name: 'Carlos Monsalve',
    company: 'Restaurante El Rincón Paisa',
    role: 'Propietario',
    text: 'Antes facturábamos en Excel y la DIAN nos envió notificaciones. e-Misión nos ayudó a regularizarnos en 2 días. Ahora dormimos tranquilos.',
    metric: 'Regularización DIAN en 48h',
    metricColor: '#F59E0B',
    rating: 5,
    color: '#F59E0B',
  },
  {
    name: 'Patricia Herrera',
    company: 'Clínica Dental Sonrisa',
    role: 'Administradora',
    text: 'Excelente precio comparado con otras opciones del mercado. La capacitación fue incluida y en 1 día ya toda la clínica estaba facturando electrónicamente.',
    metric: '40% más económico vs competencia',
    metricColor: 'var(--cyan)',
    rating: 5,
    color: '#EF4444',
  },
  {
    name: 'Rodrigo Ospina',
    company: 'Constructora Horizonte S.A.S.',
    role: 'Director Financiero',
    text: 'Manejamos volúmenes altos de facturación. e-Misión nunca ha tenido caídas en temporadas de alto volumen. La integración con nuestro ERP fue impecable.',
    metric: '+500 facturas/mes sin fallas',
    metricColor: 'var(--green)',
    rating: 5,
    color: '#0EA5E9',
  },
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)

  const next = useCallback(() => {
    setDir(1)
    setCurrent((c) => (c + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDir(-1)
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }, [])

  // Auto-advance every 5s
  useEffect(() => {
    const timer = setInterval(next, 5500)
    return () => clearInterval(timer)
  }, [next])

  const t = testimonials[current]

  return (
    <section className="py-20 overflow-hidden" style={{ backgroundColor: 'var(--gray-light)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#D97706' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#F59E0B" className="text-amber-400" />
            ))}
            4.9 · +200 reseñas reales
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Lo que dicen +10.000 empresas
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Empresas de todos los sectores confían en e-Misión para cumplir con la DIAN
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden"
            style={{ border: '1px solid var(--gray-border)' }}>
            
            {/* Quote decoration */}
            <div className="absolute top-6 right-8 text-gray-100">
              <Quote size={80} fill="currentColor" />
            </div>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -dir * 60 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" className="text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl leading-relaxed mb-6 font-medium relative z-10"
                  style={{ color: '#1E293B' }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Metric highlight */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
                  style={{ backgroundColor: `${t.metricColor}18`, color: t.metricColor }}>
                  ✓ {t.metric}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>{t.role} · {t.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-7">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-white hover:shadow-md"
              style={{ borderColor: 'var(--gray-border)', color: 'var(--navy)' }}
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i) }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '24px' : '8px',
                    height: '8px',
                    backgroundColor: i === current ? 'var(--navy)' : 'var(--gray-border)',
                  }}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-white hover:shadow-md"
              style={{ borderColor: 'var(--gray-border)', color: 'var(--navy)' }}
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Bottom grid — mini testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white rounded-xl p-5"
              style={{ border: '1px solid var(--gray-border)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, si) => <Star key={si} size={12} fill="#F59E0B" className="text-amber-400" />)}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#475569' }}>
                &ldquo;{t.text.slice(0, 100)}...&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: t.color }}>
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--gray)' }}>{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
