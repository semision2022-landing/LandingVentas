'use client'

import { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'

const messages = [
  { emoji: '🔥', text: 'Habilitación DIAN', highlight: 'GRATIS', suffix: 'en tu plan · Solo por este mes' },
  { emoji: '⚡', text: 'Activa hoy,', highlight: 'factura mañana.', suffix: 'Desde $120.000/año' },
  { emoji: '✓', text: '+10.000 empresas ya confían en e-Misión.', highlight: 'Únete hoy', suffix: '→' },
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  const [msgIdx] = useState(() => Math.floor(Math.random() * messages.length))

  if (!visible) return null

  const msg = messages[msgIdx]

  return (
    <div
      className="relative w-full flex items-center justify-center py-2.5 px-10 text-sm font-medium text-white"
      style={{ background: 'linear-gradient(90deg, #0f1f52 0%, var(--navy) 40%, #1a3a7a 100%)' }}
    >
      <span className="flex items-center gap-1.5 flex-wrap justify-center">
        <span>{msg.emoji}</span>
        <span className="text-white/75">{msg.text}</span>
        <span className="font-bold" style={{ color: 'var(--cyan)' }}>{msg.highlight}</span>
        <span className="text-white/60">{msg.suffix}</span>
        <a
          href="https://wa.me/573044796885?text=Hola%2C%20quiero%20información%20sobre%20facturación%20electrónica%20e-Misión"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 ml-2 px-3 py-0.5 rounded-full text-xs font-bold transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--cyan)', color: 'var(--navy)' }}
        >
          Escribir ahora <ArrowRight size={11} />
        </a>
      </span>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        aria-label="Cerrar"
      >
        <X size={15} />
      </button>
    </div>
  )
}
