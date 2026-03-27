'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MousePointer, CreditCard, Zap, ChevronLeft, ChevronRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MousePointer,
    title: 'Elige tu plan',
    description:
      'Selecciona el plan ideal para el volumen de facturas de tu empresa. Más de 80 opciones disponibles.',
    color: '#00D0FF',
    bg: 'rgba(0,208,255,0.12)',
    glow: '0 0 60px rgba(0,208,255,0.30), 0 20px 40px rgba(0,208,255,0.15)',
    emoji: '🎯',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Paga en línea',
    description:
      'Pago 100% seguro con PayZen. Tarjeta de crédito, débito o transferencia bancaria.',
    color: '#5F4EDA',
    bg: 'rgba(95,78,218,0.12)',
    glow: '0 0 60px rgba(95,78,218,0.30), 0 20px 40px rgba(95,78,218,0.15)',
    emoji: '💳',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Empieza a facturar',
    description:
      'Habilitación ante la DIAN en 48 horas hábiles. Soporte técnico permanente incluido.',
    color: '#579601',
    bg: 'rgba(87,150,1,0.12)',
    glow: '0 0 60px rgba(87,150,1,0.30), 0 20px 40px rgba(87,150,1,0.15)',
    emoji: '⚡',
  },
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const dragStartX = useRef<number | null>(null)

  const prev = () => setActive((a) => (a - 1 + steps.length) % steps.length)
  const next = () => setActive((a) => (a + 1) % steps.length)

  // Drag / swipe
  const onDragStart = (x: number) => { dragStartX.current = x }
  const onDragEnd = (x: number) => {
    if (dragStartX.current === null) return
    const delta = dragStartX.current - x
    if (Math.abs(delta) > 40) { if (delta > 0) { next() } else { prev() } }
    dragStartX.current = null
  }

  const getCardStyle = (i: number) => {
    const diff = i - active
    const normalised = ((diff % steps.length) + steps.length) % steps.length
    const offset = normalised > steps.length / 2 ? normalised - steps.length : normalised

    if (offset === 0) {
      // Active — front and center
      return {
        zIndex: 20,
        transform: 'translateX(0px) rotateY(0deg) scale(1)',
        opacity: 1,
        filter: 'none',
        pointerEvents: 'auto' as const,
      }
    } else if (Math.abs(offset) === 1) {
      // Neighboring
      const dir = offset > 0 ? 1 : -1
      return {
        zIndex: 10,
        transform: `translateX(${dir * 58}%) rotateY(${-dir * 38}deg) scale(0.78)`,
        opacity: 0.55,
        filter: 'blur(0.5px)',
        pointerEvents: 'auto' as const,
      }
    } else {
      return {
        zIndex: 5,
        transform: `translateX(${offset > 0 ? '100%' : '-100%'}) scale(0.6)`,
        opacity: 0,
        filter: 'blur(2px)',
        pointerEvents: 'none' as const,
      }
    }
  }

  return (
    <section
      className="py-24 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #EFF6FF 100%)' }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${steps[active].bg} 0%, transparent 70%)`,
          transition: 'background 0.5s ease',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(24,34,76,0.07)', color: 'var(--navy)' }}
          >
            3 simples pasos
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Arrastra o desliza para explorar cada paso
          </motion.p>
        </div>

        {/* Coverflow stage */}
        <div
          className="relative mx-auto"
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
          onMouseLeave={(e) => onDragEnd(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
          style={{
            height: 420,
            maxWidth: 640,
            perspective: '1100px',
            perspectiveOrigin: '50% 45%',
            cursor: 'grab',
            userSelect: 'none',
          } as React.CSSProperties}
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            const style = getCardStyle(i)
            const isActive = i === active
            return (
              <div
                key={step.number}
                onClick={() => !isActive && setActive(i)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-160px',
                  marginTop: '-175px',
                  width: 320,
                  height: 350,
                  transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                  transformStyle: 'preserve-3d',
                  ...style,
                }}
              >
                {/* Card */}
                <div
                  className="w-full h-full rounded-3xl flex flex-col items-center justify-start pt-8 px-7 pb-7 relative overflow-hidden"
                  style={{
                    background: 'white',
                    boxShadow: isActive ? step.glow : '0 4px 24px rgba(0,0,0,0.07)',
                    border: isActive ? `1.5px solid ${step.color}33` : '1.5px solid rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.5s ease, border 0.5s ease',
                  }}
                >
                  {/* Background tint */}
                  <div
                    className="absolute inset-0 rounded-3xl transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${step.bg} 0%, transparent 65%)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />

                  {/* Number badge */}
                  <span
                    className="relative z-10 w-9 h-9 rounded-full text-white text-xs font-black flex items-center justify-center mb-5 shrink-0"
                    style={{ backgroundColor: step.color, boxShadow: `0 4px 14px ${step.color}66` }}
                  >
                    {step.number}
                  </span>

                  {/* Icon circle */}
                  <div
                    className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shrink-0 transition-transform duration-300"
                    style={{
                      backgroundColor: step.bg,
                      color: step.color,
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <Icon size={34} strokeWidth={1.8} />
                  </div>

                  {/* Text */}
                  <h3
                    className="relative z-10 text-xl font-bold text-center mb-3 transition-all duration-300"
                    style={{ color: 'var(--navy)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="relative z-10 text-sm text-center leading-relaxed transition-all duration-500"
                    style={{
                      color: 'var(--gray)',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ borderColor: steps[active].color, color: steps[active].color }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2.5 items-center">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? 32 : 10,
                  height: 10,
                  borderRadius: 99,
                  backgroundColor: i === active ? step.color : 'rgba(24,34,76,0.15)',
                  transition: 'all 0.35s ease',
                  boxShadow: i === active ? `0 0 10px ${step.color}80` : 'none',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ borderColor: steps[active].color, color: steps[active].color }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Step label */}
        <motion.p
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-semibold mt-4"
          style={{ color: steps[active].color }}
        >
          {steps[active].emoji} {steps[active].title}
        </motion.p>
      </div>
    </section>
  )
}
