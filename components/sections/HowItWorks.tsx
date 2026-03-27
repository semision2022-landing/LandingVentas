'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MousePointer, CreditCard, Zap } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MousePointer,
    title: 'Elige tu plan',
    description: 'Selecciona el plan ideal para el volumen de facturas de tu empresa. Más de 80 opciones disponibles.',
    color: '#00D0FF',
    bg: 'rgba(0,208,255,0.12)',
    glow: 'rgba(0,208,255,0.35)',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Paga en línea',
    description: 'Pago 100 % seguro con PayZen. Tarjeta de crédito, débito o transferencia bancaria.',
    color: '#5F4EDA',
    bg: 'rgba(95,78,218,0.12)',
    glow: 'rgba(95,78,218,0.35)',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Empieza a facturar',
    description: 'Habilitación ante la DIAN en 48 horas hábiles. Soporte técnico permanente incluido.',
    color: '#579601',
    bg: 'rgba(87,150,1,0.12)',
    glow: 'rgba(87,150,1,0.35)',
  },
]

const TOTAL = steps.length
const ANGLE_STEP = 360 / TOTAL   // 120°
const RADIUS = 240               // px - desktop
const RADIUS_SM = 150            // px - mobile

export default function HowItWorks() {
  const [rotation, setRotation] = useState(0)         // current wheel rotation in degrees
  const [active, setActive] = useState(0)             // index of front card
  const [dragging, setDragging] = useState(false)
  const [radius, setRadius] = useState(RADIUS)
  const dragStart = useRef<number | null>(null)
  const lastRotation = useRef(0)

  // Responsive radius
  useEffect(() => {
    const update = () => setRadius(window.innerWidth < 640 ? RADIUS_SM : RADIUS)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Snap rotation to nearest step
  const snapToNearest = useCallback((rot: number) => {
    let closest = 0
    let minDiff = Infinity
    for (let i = 0; i < TOTAL; i++) {
      const cardAngle = (ANGLE_STEP * i + rot % 360 + 360) % 360
      const diff = Math.min(cardAngle, 360 - cardAngle)
      if (diff < minDiff) { minDiff = diff; closest = i }
    }
    // Snap so closest card is at front (angle = 0)
    const targetRot = rot - ((((ANGLE_STEP * closest + rot % 360) + 360) % 360 > 180)
      ? (((ANGLE_STEP * closest + rot % 360) + 360) % 360) - 360
      : ((ANGLE_STEP * closest + rot % 360) + 360) % 360)
    setRotation(targetRot)
    setActive(closest)
    lastRotation.current = targetRot
  }, [])

  // Go to specific step
  const goTo = useCallback((index: number) => {
    const targetRot = lastRotation.current - ((ANGLE_STEP * index + lastRotation.current % 360 + 360) % 360 > 180
      ? ((ANGLE_STEP * index + lastRotation.current % 360 + 360) % 360) - 360
      : ((ANGLE_STEP * index + lastRotation.current % 360 + 360) % 360))
    setRotation(targetRot)
    setActive(index)
    lastRotation.current = targetRot
  }, [])

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = e.clientX
    setDragging(true)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    setRotation(lastRotation.current + delta * 0.35)
  }
  const onMouseUp = () => {
    if (!dragging) return
    setDragging(false)
    dragStart.current = null
    snapToNearest(rotation)
  }

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientX
    setDragging(true)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStart.current === null) return
    const delta = e.touches[0].clientX - dragStart.current
    setRotation(lastRotation.current + delta * 0.35)
  }
  const onTouchEnd = () => {
    setDragging(false)
    dragStart.current = null
    snapToNearest(rotation)
  }

  return (
    <section className="py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fff 0%, #F1F5F9 100%)' }}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(24,34,76,0.07)', color: 'var(--navy)' }}
          >
            Proceso simple
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ¿Cómo funciona?
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Arrastra el círculo o toca los puntos para navegar entre los pasos
          </motion.p>
        </div>

        {/* 3D Carousel */}
        <div
          className="relative mx-auto flex items-center justify-center"
          style={{ height: radius * 2 + 240, maxWidth: 700, cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Center decorative hub */}
          <div
            className="absolute z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl pointer-events-none select-none"
            style={{
              background: 'linear-gradient(135deg, #18224C 0%, #223870 100%)',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 60px rgba(0,208,255,0.25), 0 8px 32px rgba(24,34,76,0.5)',
            }}
          >
            <span className="text-white font-black text-lg select-none" style={{ color: '#00D0FF' }}>e-M</span>
          </div>

          {/* Orbit ring */}
          <div
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(24,34,76,0.08)',
              borderStyle: 'dashed',
            }}
          />

          {/* Rotating cards */}
          <div
            className="absolute"
            style={{
              width: '100%', height: '100%',
              transition: dragging ? 'none' : 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: `rotateY(${rotation}deg)`,
              transformStyle: 'preserve-3d',
              perspective: 1200,
              top: 0, left: 0,
            }}
          >
            {steps.map((step, i) => {
              const cardAngle = ANGLE_STEP * i
              const isActive = i === active
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  onClick={() => goTo(i)}
                  style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: `
                      rotateY(${cardAngle}deg)
                      translateZ(${radius}px)
                      translateX(-50%)
                      translateY(-50%)
                    `,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    transition: dragging ? 'none' : 'all 0.4s ease',
                    zIndex: isActive ? 20 : 10,
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.82,
                      opacity: isActive ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl p-6 flex flex-col items-center text-center select-none"
                    style={{
                      width: radius < 200 ? 160 : 200,
                      background: 'white',
                      boxShadow: isActive
                        ? `0 20px 60px ${step.glow}, 0 4px 20px rgba(0,0,0,0.1)`
                        : '0 4px 16px rgba(0,0,0,0.08)',
                      border: isActive ? `2px solid ${step.color}` : '2px solid transparent',
                    }}
                  >
                    {/* Number badge */}
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white mb-3 shrink-0"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: step.bg, color: step.color }}
                    >
                      <Icon size={30} />
                    </div>

                    <h3 className="font-bold text-base mb-2 leading-tight" style={{ color: 'var(--navy)' }}>
                      {step.title}
                    </h3>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs leading-relaxed"
                        style={{ color: 'var(--gray)' }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step dots / nav */}
        <div className="flex items-center justify-center gap-4 -mt-8">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex flex-col items-center gap-1.5 group transition-all"
              aria-label={step.title}
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 28 : 10,
                  height: 10,
                  backgroundColor: i === active ? step.color : 'rgba(24,34,76,0.15)',
                }}
              />
              <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: step.color }}>
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs mt-6"
          style={{ color: 'rgba(100,116,139,0.6)' }}
        >
          ← Arrastra o desliza para explorar →
        </motion.p>

      </div>
    </section>
  )
}
