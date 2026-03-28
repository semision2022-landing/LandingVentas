'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'

const notifications = [
  { company: 'Ferretería El Perno S.A.S.', city: 'Medellín', plan: 'Plan X', time: 'hace 2 min', color: '#00D0FF' },
  { company: 'Restaurante El Fogón', city: 'Bogotá', plan: 'Plan Básico', time: 'hace 5 min', color: '#5F4EDA' },
  { company: 'Construcciones Horizonte', city: 'Cali', plan: 'Plan Plus', time: 'hace 8 min', color: '#579601' },
  { company: 'Clínica Dental Sonrisa', city: 'Barranquilla', plan: 'Plan X', time: 'hace 11 min', color: '#F59E0B' },
  { company: 'Droguería La Salud', city: 'Pereira', plan: 'Plan Básico', time: 'hace 14 min', color: '#EF4444' },
  { company: 'Distribuidora Cano & Asoc.', city: 'Envigado', plan: 'Plan Plus', time: 'hace 17 min', color: '#0EA5E9' },
  { company: 'Agencia de Viajes Pacífico', city: 'Manizales', plan: 'Plan X', time: 'hace 22 min', color: '#EC4899' },
  { company: 'Inversiones Zuluaga S.A.S.', city: 'Bucaramanga', plan: 'Plan Básico', time: 'hace 25 min', color: '#8B5CF6' },
  { company: 'Papelería La Estrella', city: 'Ibagué', plan: 'Plan X', time: 'hace 29 min', color: '#14B8A6' },
  { company: 'Transportes Andes', city: 'Cúcuta', plan: 'Plan Plus', time: 'hace 33 min', color: '#F97316' },
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

  return (
    <>
      {/* ── MOBILE: bottom-left, above chatbot (bottom-20) ── */}
      <div className="sm:hidden fixed bottom-20 left-3 z-40 w-[calc(55vw)] max-w-[230px]">
        <AnimatePresence>
          {visible && !dismissed && (
            <motion.div
              key={`m-${index}`}
              initial={{ opacity: 0, x: -40, scale: 0.93 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-start gap-2 px-3 py-2.5">
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: n.color }}
                >
                  {n.company.slice(0, 2).toUpperCase()}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold leading-tight truncate" style={{ color: '#1E293B' }}>
                    {n.company}
                  </p>
                  <p className="text-[10px] leading-snug mt-0.5" style={{ color: '#64748B' }}>
                    <span className="font-semibold" style={{ color: n.color }}>{n.city}</span>{' '}
                    · <strong style={{ color: '#18224C' }}>{n.plan}</strong>
                  </p>
                  <div className="flex items-center gap-0.5 mt-1">
                    <ShieldCheck size={8} style={{ color: '#579601' }} />
                    <span className="text-[9px]" style={{ color: '#94A3B8' }}>{n.time}</span>
                  </div>
                </div>
                {/* Dismiss */}
                <button onClick={() => setDismissed(true)} className="text-gray-200 hover:text-gray-400 shrink-0 mt-0.5">
                  <X size={11} />
                </button>
              </div>
              {/* Progress */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5"
                style={{ backgroundColor: n.color }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP: bottom-left, standard size ── */}
      <div className="hidden sm:block fixed bottom-6 left-4 z-50 max-w-xs w-full">
        <AnimatePresence>
          {visible && !dismissed && (
            <motion.div
              key={`d-${index}`}
              initial={{ opacity: 0, x: -80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
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
                    <ShieldCheck size={10} style={{ color: '#579601' }} />
                    <span className="text-[10px]" style={{ color: '#94A3B8' }}>Verificado · {n.time}</span>
                  </div>
                </div>
                <button onClick={() => setDismissed(true)} className="text-gray-200 hover:text-gray-400 transition-colors shrink-0">
                  <X size={13} />
                </button>
              </div>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5"
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
