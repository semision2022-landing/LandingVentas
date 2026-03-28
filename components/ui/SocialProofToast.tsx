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

function getInitials(company: string) {
  return company.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
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

  // Shared card content — full info always visible
  const cardContent = (isMobile: boolean) => (
    <>
      <div className={`flex items-center gap-${isMobile ? '2' : '3'} ${isMobile ? 'px-3 py-2.5' : 'px-4 py-3.5'}`}>
        {/* Avatar */}
        <div
          className={`${isMobile ? 'w-8 h-8 text-[11px]' : 'w-9 h-9 text-xs'} rounded-xl flex items-center justify-center text-white font-bold shrink-0`}
          style={{ backgroundColor: n.color }}
        >
          {getInitials(n.company)}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`${isMobile ? 'text-[11px]' : 'text-xs'} font-bold leading-tight truncate`} style={{ color: '#1E293B' }}>
            {n.company}
          </p>
          <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} leading-snug mt-0.5`} style={{ color: '#64748B' }}>
            <span className="font-semibold" style={{ color: n.color }}>{n.city}</span>
            {' '}· adquirió {' '}
            <strong style={{ color: '#18224C' }}>{n.plan}</strong>
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ShieldCheck size={isMobile ? 9 : 10} style={{ color: '#16A34A' }} />
            <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'}`} style={{ color: '#94A3B8' }}>
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
          <X size={isMobile ? 12 : 13} />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        className="h-0.5"
        style={{ backgroundColor: n.color }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4.5, ease: 'linear' }}
      />
    </>
  )

  return (
    <>
      {/* ── MOBILE ──────────────────────────────────────────────────────
          Safe zone: left-3, max-w = 48vw (never reaches chatbot bubble)
          Position: bottom-[90px] = above chatbot button zone
      ───────────────────────────────────────────────────────────────── */}
      <div className="sm:hidden fixed z-40" style={{ bottom: '90px', left: '12px', width: '48vw', maxWidth: '185px' }}>
        <AnimatePresence>
          {visible && !dismissed && (
            <motion.div
              key={`m-${index}`}
              initial={{ opacity: 0, x: -30, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              {/* Color accent top bar */}
              <div className="h-0.5 w-full" style={{ backgroundColor: n.color }} />
              {cardContent(true)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP ─────────────────────────────────────────────────────
          Standard bottom-left, full size, clear of chatbot (right-6)
      ───────────────────────────────────────────────────────────────── */}
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
              {cardContent(false)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
