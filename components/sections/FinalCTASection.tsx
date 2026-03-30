'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import WhatsAppLeadModal from '@/components/ui/WhatsAppLeadModal'

// Countdown to end of month for urgency
function useCountdown() {
  const getEnd = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0).getTime()
  }
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = getEnd() - Date.now()
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTime({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-16 rounded-xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-white/40 text-xs mt-1.5 uppercase tracking-wide">{label}</span>
    </div>
  )
}

export default function FinalCTASection() {
  const [waModalOpen, setWaModalOpen] = useState(false)
  const { d, h, m, s } = useCountdown()

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a2d6b 60%, #0f1f52 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, var(--purple) 0%, transparent 70%)' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)' }}>
            🔥 Oferta del mes · Habilitación DIAN incluida gratis
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Empieza hoy y olvídate<br />
            de los problemas con la{' '}
            <span style={{ color: 'var(--cyan)' }}>DIAN para siempre</span>
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-2xl mx-auto">
            Cada vez más empresas ya facturan legal y sin complicaciones. La habilitación es gratis y en 48 horas.
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <p className="text-white/50 text-sm mb-3 uppercase tracking-widest">Oferta termina en</p>
            <div className="flex items-center justify-center gap-3">
              <Digit value={d} label="Días" />
              <span className="text-white/40 text-2xl font-light pb-4">:</span>
              <Digit value={h} label="Horas" />
              <span className="text-white/40 text-2xl font-light pb-4">:</span>
              <Digit value={m} label="Min" />
              <span className="text-white/40 text-2xl font-light pb-4">:</span>
              <Digit value={s} label="Seg" />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={() => setWaModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
              style={{ backgroundColor: 'var(--cyan)', color: 'var(--navy)' }}
            >
              <MessageCircle size={19} />
              Quiero habilitarme ahora
            </button>
            <a
              href="#planes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border-2 transition-all duration-200 hover:bg-white/8 hover:-translate-y-1"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Ver todos los planes
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Guarantees row */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              'Sin cláusula de permanencia',
              'Soporte técnico gratis',
              'Migración sin costo',
              'ISO27001 certificado',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/55">
                <CheckCircle size={14} style={{ color: 'var(--cyan)' }} />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <WhatsAppLeadModal isOpen={waModalOpen} onClose={() => setWaModalOpen(false)} />
    </section>
  )
}
