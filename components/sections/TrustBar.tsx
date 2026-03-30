'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface CountUpProps {
  target: string
  label: string
}

function CountUpNumber({ target, label }: CountUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [displayed, setDisplayed] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const numeric = parseInt(target.replace(/\D/g, ''), 10)
    if (isNaN(numeric)) { setDisplayed(target); return }
    const prefix = target.match(/^[^0-9]*/)?.[0] ?? ''
    const suffix = target.match(/[^0-9M]*$/)?.[0] ?? ''
    const hasM = target.includes('M')
    const duration = 1500
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * numeric)
      setDisplayed(`${prefix}${current.toLocaleString('es-CO')}${hasM ? 'M' : ''}${suffix}`)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
        {displayed}
      </div>
      <p className="text-sm md:text-base font-medium" style={{ color: 'var(--gray)' }}>
        {label}
      </p>
    </div>
  )
}

const metrics = [
  { target: 'Creciendo', label: 'Empresas activas' },
  { target: '+140M', label: 'Facturas procesadas ante la DIAN' },
  { target: '48h', label: 'Habilitación DIAN' },
  { target: '7+', label: 'Años en el mercado' },
]

export default function TrustBar() {
  return (
    <section className="py-16 bg-white border-b" style={{ borderColor: 'var(--gray-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center">
              <CountUpNumber target={m.target} label={m.label} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
