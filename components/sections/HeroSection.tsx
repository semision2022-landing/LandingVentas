'use client'

import { motion, Variants } from 'framer-motion'
import { ArrowRight, MessageCircle, ShieldCheck, Star, Users, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import WhatsAppLeadModal from '@/components/ui/WhatsAppLeadModal'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

// Live counter that increments randomly to simulate real-time joins
function LiveCounter() {
  const [count, setCount] = useState(127)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) setCount((c) => c + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
      style={{ backgroundColor: 'rgba(87,150,1,0.18)', color: '#7DC902', border: '1px solid rgba(87,150,1,0.3)' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      {count} empresas se unieron este mes
    </motion.div>
  )
}

export default function HeroSection() {
  const [waModalOpen, setWaModalOpen] = useState(false)

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a2d6b 55%, #223870 100%)' }}
      aria-label="Sección principal"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 65%)' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, var(--purple) 0%, transparent 70%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT: Main copy ─────────────────────────────────────── */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* DIAN badge */}
            <motion.div variants={itemVariants} className="mb-2">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(0,208,255,0.12)', color: 'var(--cyan)', border: '1px solid rgba(0,208,255,0.25)' }}
              >
                <ShieldCheck size={13} /> Proveedor oficial avalado por la DIAN
              </span>
            </motion.div>
            <LiveCounter />

            {/* Pain-point headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-tight mb-5"
            >
              ¿Todavía facturas<br />
              con{' '}
              <span className="line-through opacity-50">Word o PDF?</span>{' '}
              <span style={{ color: 'var(--cyan)' }}>La DIAN<br />puede multarte.</span>
            </motion.h1>

            {/* Value proposition */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-white/75 leading-relaxed mb-7 max-w-xl"
            >
              e-Misión es el software de facturación electrónica que más de{' '}
              <strong className="text-white">10.000 empresas colombianas</strong>{' '}
              usan para cumplir con la DIAN.{' '}
              <strong className="text-white">Habilitación en 48 horas. Desde $120.000/año.</strong>
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => setWaModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-2xl active:translate-y-0"
                style={{ backgroundColor: 'var(--cyan)', color: 'var(--navy)' }}
              >
                <MessageCircle size={18} />
                Quiero habilitarme gratis en 48h
              </button>
              <a
                href="#planes"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base text-white border-2 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Ver planes y precios
                <ArrowRight size={17} />
              </a>
            </motion.div>

            {/* Mini trust indicators */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { icon: Users, text: '+10.000 empresas activas' },
                { icon: Clock, text: 'Habilitación en 48h garantizada' },
                { icon: ShieldCheck, text: 'Sin cláusula de permanencia' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.text} className="flex items-center gap-1.5 text-sm text-white/65">
                    <Icon size={13} style={{ color: 'var(--cyan)' }} />
                    {item.text}
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Social proof card ──────────────────────────────── */}
          <motion.div
            className="hidden lg:flex flex-col gap-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            {/* Main stat card */}
            <div
              className="rounded-2xl p-7 text-center"
              style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="text-5xl font-extrabold mb-1" style={{ color: 'var(--cyan)' }}>+140M</div>
              <div className="text-white/80 text-sm">Facturas procesadas ante la DIAN</div>
              <div className="flex justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" className="text-amber-400" />
                ))}
              </div>
              <div className="text-white/50 text-xs mt-1">4.9★ · +200 reseñas verificadas</div>
            </div>

            {/* Testimonials mini */}
            {[
              { name: 'Juan M. Zuluaga', role: 'Gerente · Ferretería El Perno', text: '3 años con e-Misión. Servicio excepcional y soporte inmediato.', color: 'var(--cyan)' },
              { name: 'Mayra Cano', role: 'Contadora · Distribuidora Cano', text: 'La habilitación DIAN fue en menos de 48 horas como prometieron.', color: 'var(--purple)' },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl px-5 py-4 flex gap-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white/80 text-xs leading-snug mb-1.5">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-white/40 text-xs">{t.name} · {t.role}</p>
                </div>
              </div>
            ))}

            {/* Bottom badge */}
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ background: 'rgba(0,208,255,0.1)', border: '1px solid rgba(0,208,255,0.2)' }}
            >
              <span className="text-sm font-bold" style={{ color: 'var(--cyan)' }}>Desde 2018</span>
              <span className="text-white/50 text-xs ml-2">en el mercado colombiano</span>
            </div>
          </motion.div>
        </div>
      </div>
      <WhatsAppLeadModal isOpen={waModalOpen} onClose={() => setWaModalOpen(false)} />
    </section>
  )
}
