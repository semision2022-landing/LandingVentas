'use client'

import { motion } from 'framer-motion'

// Logos as SVG text placeholders — professional industry names
const clients = [
  'Ferretería El Perno S.A.S.',
  'Distribuidora Cano & Asoc.',
  'Consultora Ramírez & Co.',
  'Inversiones Zuluaga',
  'Clínica Santa Cruz',
  'Transporte Andes S.A.S.',
  'Papelería La Estrella',
  'Constructora Horizonte',
  'Agencia de Viajes Pacífico',
  'Restaurante El Fogón',
  'Droguería Central',
  'Taller Automotriz Speed',
]

export default function LogoStrip() {
  // Duplicate for seamless loop
  const all = [...clients, ...clients]

  return (
    <section className="py-12 bg-white border-y overflow-hidden" style={{ borderColor: 'var(--gray-border)' }}>
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gray)' }}>
          Empresas que ya confían en e-Misión
        </p>
      </div>

      {/* Infinite scrolling strip */}
      <div className="relative flex overflow-hidden group">
        <motion.div
          className="flex gap-10 shrink-0"
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ willChange: 'transform' }}
        >
          {all.map((name, i) => (
            <div
              key={i}
              className="shrink-0 px-6 py-3 rounded-xl border flex items-center justify-center text-sm font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                borderColor: 'var(--gray-border)',
                color: 'var(--navy)',
                backgroundColor: i % 3 === 0 ? 'rgba(24,34,76,0.03)' : 'white',
                minWidth: '200px',
              }}
            >
              <span className="w-2 h-2 rounded-full mr-2.5 shrink-0" style={{ backgroundColor: ['var(--cyan)', 'var(--purple)', 'var(--green)'][i % 3] }} />
              {name}
            </div>
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, white, transparent)' }} />
      </div>

      {/* Star rating */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4" fill="#F59E0B" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm font-semibold ml-1" style={{ color: 'var(--navy)' }}>4.9 / 5</span>
        <span className="text-sm" style={{ color: 'var(--gray)' }}>· Clientes satisfechos</span>
      </div>
    </section>
  )
}
