'use client'

import { motion, Variants } from 'framer-motion'
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react'
import { fbEvent, generateEventId } from '@/lib/fbq'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 60%, #223870 100%)' }}
      aria-label="Sección principal"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, var(--purple) 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: 'rgba(0, 208, 255, 0.15)', color: 'var(--cyan)', border: '1px solid rgba(0, 208, 255, 0.3)' }}
            >
              <ShieldCheck size={15} />
              Proveedor avalado por la DIAN
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            Facturación electrónica,{' '}
            <span style={{ color: 'var(--cyan)' }}>nómina y más.</span>
            <br />
            Todo en uno. Avalado por la DIAN.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/75 leading-relaxed mb-8 max-w-2xl"
          >
            Más de 10.000 empresas confían en e-Misión. Habilitación DIAN en{' '}
            <strong className="text-white">48 horas.</strong> Desde{' '}
            <strong className="text-white">$120.000/año.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="#planes"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--cyan)', color: 'var(--navy)' }}
            >
              Ver planes y precios
              <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/573044796885"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fbEvent('Contact', { content_name: 'WhatsApp Hero' }, generateEventId())}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base text-white border-2 border-white/30 transition-all duration-200 hover:-translate-y-1"
            >
              <MessageCircle size={18} />
              Hablar por WhatsApp
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: '✓', text: '+10.000 empresas activas' },
              { icon: '✓', text: 'Habilitación en 48h' },
              { icon: '✓', text: 'Soporte técnico gratis' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-white/70">
                <span className="font-bold" style={{ color: 'var(--cyan)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating badge */}
        <motion.div
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div
            className="rounded-2xl p-6 text-center shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="text-4xl mb-2">✈</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--cyan)' }}>+140M</div>
            <div className="text-xs text-white/60 mt-1">Facturas procesadas</div>
            <div className="text-xs text-white/60">ante la DIAN</div>
          </div>
          <div
            className="rounded-xl px-4 py-3 text-center shadow-xl"
            style={{ background: 'rgba(0, 208, 255, 0.15)', border: '1px solid rgba(0, 208, 255, 0.3)' }}
          >
            <div className="text-lg font-bold text-white">Desde 2018</div>
            <div className="text-xs" style={{ color: 'var(--cyan)' }}>en el mercado</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
