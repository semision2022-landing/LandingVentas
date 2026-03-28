'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'

const notifications = [
  { company: 'Ferretería El Perno', city: 'Medellín', plan: 'Plan X', time: '2 min', color: '#00D0FF' },
  { company: 'Rest. El Fogón', city: 'Bogotá', plan: 'Plan Básico', time: '5 min', color: '#5F4EDA' },
  { company: 'Construcciones Horizonte', city: 'Cali', plan: 'Plan Plus', time: '8 min', color: '#579601' },
  { company: 'Clínica Dental Sonrisa', city: 'Barranquilla', plan: 'Plan X', time: '11 min', color: '#F59E0B' },
  { company: 'Droguería La Salud', city: 'Pereira', plan: 'Plan Básico', time: '14 min', color: '#EF4444' },
  { company: 'Distribuidora Cano', city: 'Envigado', plan: 'Plan Plus', time: '17 min', color: '#0EA5E9' },
  { company: 'Viajes Pacífico', city: 'Manizales', plan: 'Plan X', time: '22 min', color: '#EC4899' },
  { company: 'Inversiones Zuluaga', city: 'Bucaramanga', plan: 'Plan Básico', time: '25 min', color: '#8B5CF6' },
  { company: 'Papelería La Estrella', city: 'Ibagué', plan: 'Plan X', time: '29 min', color: '#14B8A6' },
  { company: 'Transportes Andes', city: 'Cúcuta', plan: 'Plan Plus', time: '33 min', color: '#F97316' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function SocialProofToast() {
  const [queue] = useState(() => shuffle(notifications))
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [dismissed])

  useEffect(() => {
    if (!visible || dismissed) return
    const hide = setTimeout(() => {
      setVisible(false)
      const next = setTimeout(() => {
        setIndex((i) => (i + 1) % queue.length)
        setVisible(true)
      }, 6000)
      return () => clearTimeout(next)
    }, 4500)
    return () => clearTimeout(hide)
  }, [visible, index, dismissed, queue.length])

  const n = queue[index]

  const card = (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      {/* Colored top stripe */}
      <div className="h-0.5 w-full" style={{ backgroundColor: n.color }} />
      <div className="px-3 py-2.5 flex items-start gap-2">
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
          style={{ backgroundColor: n.color, fontSize: '10px' }}
        >
          {n.company.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="font-bold leading-tight truncate" style={{ fontSize: '10px', color: '#0F172A' }}>
            {n.city}
          </p>
          <p className="leading-snug mt-0.5 truncate" style={{ fontSize: '10px', color: '#475569' }}>
            adquirió <strong style={{ color: '#18224C' }}>{n.plan}</strong>
          </p>
          <div className="flex items-center gap-0.5 mt-1">
            <ShieldCheck size={8} style={{ color: '#16A34A' }} />
            <span style={{ fontSize: '9px', color: '#94A3B8' }}>hace {n.time}</span>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-200 hover:text-gray-400 transition-colors shrink-0"
          aria-label="Cerrar"
        >
          <X size={11} />
        </button>
      </div>
      {/* Progress bar */}
      <motion.div
        className="h-0.5"
        style={{ backgroundColor: n.color, opacity: 0.4 }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4.5, ease: 'linear' }}
      />
    </div>
  )

  return (
    <>
      {/* ─── MOBILE: safe zone left, above chatbot button ─── 
          ChatWidget: bottom-6 right-6, button h-14 = 80px + 24px = 104px occupied zone
          Speech bubble: ~220px wide from right edge
          Safe zone left: 0 → ~42vw (avoids bubble on all phone sizes)
          Position: bottom-[90px] = above the button zone
      */}
      <div
        className="sm:hidden fixed z-40"
        style={{ bottom: '90px', left: '12px', width: '42vw', maxWidth: '165px' }}
      >
        <AnimatePresence>
          {visible && !dismissed && (
            <motion.div
              key={`m-${index}`}
              initial={{ opacity: 0, x: -30, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              {card}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── DESKTOP: bottom-left, full size ─── */}
      <div className="hidden sm:block fixed bottom-6 left-4 z-50" style={{ maxWidth: '300px', width: '100%' }}>
        <AnimatePresence>
          {visible && !dismissed && (
            <motion.div
              key={`d-${index}`}
              initial={{ opacity: 0, x: -60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: n.color }}
                >
                  {n.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-snug truncate" style={{ color: '#1E293B' }}>
                    {n.company}
                  </p>
                  <p className="text-xs leading-snug mt-0.5" style={{ color: '#64748B' }}>
                    <span className="font-semibold" style={{ color: n.color }}>{n.city}</span>
                    {' '}adquirió el{' '}
                    <strong style={{ color: '#18224C' }}>{n.plan}</strong>
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <ShieldCheck size={10} style={{ color: '#16A34A' }} />
                    <span className="text-[10px]" style={{ color: '#94A3B8' }}>Verificado · hace {n.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-gray-200 hover:text-gray-400 transition-colors shrink-0"
                  aria-label="Cerrar"
                >
                  <X size={13} />
                </button>
              </div>
              <motion.div
                className="h-0.5"
                style={{ backgroundColor: n.color }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
