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

// Detect mobile viewport
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

export default function SocialProofToast() {
  const [queue] = useState(() => shuffle(notifications))
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (dismissed) return
    const showTimer = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(showTimer)
  }, [dismissed])

  useEffect(() => {
    if (!visible || dismissed) return
    const hideTimer = setTimeout(() => {
      setVisible(false)
      const nextTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % queue.length)
        setVisible(true)
      }, 6000)
      return () => clearTimeout(nextTimer)
    }, 4500)
    return () => clearTimeout(hideTimer)
  }, [visible, index, dismissed, queue.length])

  const n = queue[index]

  // Mobile: top-center under navbar | Desktop: bottom-left
  const positionClass = isMobile
    ? 'fixed top-[72px] left-3 right-3 z-40'
    : 'fixed bottom-6 left-4 z-50 max-w-xs w-full'

  const motionProps = isMobile
    ? {
        initial: { opacity: 0, y: -20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -16, scale: 0.95 },
        transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
      }
    : {
        initial: { opacity: 0, x: -80, scale: 0.9 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -60, scale: 0.92 },
        transition: { type: 'spring' as const, stiffness: 280, damping: 22 },
      }

  return (
    <div className={positionClass}>
      <AnimatePresence>
        {visible && !dismissed && (
          <motion.div
            key={index}
            {...motionProps}
            className="bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 pointer-events-auto"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}
          >
            {/* Color avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ backgroundColor: n.color }}
            >
              {n.company.slice(0, 2).toUpperCase()}
            </div>

            {/* Content — more compact on mobile */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight truncate" style={{ color: '#1E293B' }}>
                {n.company}
              </p>
              <p className="text-xs leading-snug mt-0.5" style={{ color: '#64748B' }}>
                <span className="font-semibold" style={{ color: n.color }}>{n.city}</span>
                {' '}adquirió el{' '}
                <strong style={{ color: '#18224C' }}>{n.plan}</strong>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck size={10} style={{ color: '#579601' }} />
                <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                  Verificado · {n.time}
                </span>
              </div>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-200 hover:text-gray-400 transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X size={14} />
            </button>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl"
              style={{ backgroundColor: n.color }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4.5, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
