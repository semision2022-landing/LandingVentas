'use client'

import { useEffect, useRef } from 'react'

const seals = [
  { src: '/Logo Proveedor Tecnologico.png', alt: 'Proveedor Tecnológico DIAN', width: 90 },
  { src: '/Oracle-Cloud-Emblem.png', alt: 'Oracle Cloud Partner', width: 100 },
  { src: '/sello1-1024x446.png', alt: 'Digital Business Network Alliance', width: 140 },
  { src: '/SelloEmision-1024x448.png', alt: 'e-Misión Certified Service Providers', width: 140 },
  { src: '/Fb Certification Iso 27001 2022.png', alt: 'ISO 27001:2022', width: 80 },
  { src: '/LogoRADIAN.png', alt: 'RADIAN', width: 80 },
]

export default function CertificationsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const wrapper = wrapperRef.current
    if (!track || !wrapper) return

    const updateOffset = () => {
      // Cuánto sobresale el track fuera del wrapper (lo máximo que debe desplazarse)
      const overflow = track.scrollWidth - wrapper.offsetWidth
      if (overflow > 0) {
        track.style.setProperty('--marquee-offset', `-${overflow}px`)
      } else {
        // Todos los sellos caben — sin animación
        track.style.setProperty('--marquee-offset', '0px')
      }
    }

    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

  return (
    <section
      className="relative py-14 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D1635 0%, #18224C 50%, #0A1628 100%)',
      }}
    >
      {/* Glow decorativo cyan */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,208,255,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Etiqueta */}
      <p
        className="text-center text-[11px] font-bold uppercase tracking-[0.25em] mb-10 relative z-10"
        style={{ color: 'rgba(0,208,255,0.7)' }}
      >
        ✦ Certificaciones &amp; Reconocimientos ✦
      </p>

      {/* Marquee wrapper */}
      <div ref={wrapperRef} className="relative z-10 overflow-hidden px-4">
        {/* Fade izquierdo */}
        <div
          className="absolute left-0 top-0 bottom-0 w-10 md:w-20 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0D1635, transparent)',
          }}
        />
        {/* Fade derecho */}
        <div
          className="absolute right-0 top-0 bottom-0 w-10 md:w-20 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #0D1635, transparent)',
          }}
        />

        {/* Track animado — va al final y regresa */}
        <div
          ref={trackRef}
          className="flex items-center gap-6 md:gap-10 animate-marquee"
          style={{
            width: 'max-content',
            // Valor inicial; se sobreescribe en useEffect con el overflow real
            ['--marquee-offset' as string]: '0px',
          }}
        >
          {seals.map((seal, i) => (
            <div
              key={`${seal.alt}-${i}`}
              className="shrink-0 flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl"
              style={{
                height: '80px',
                minWidth: '100px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={seal.src}
                alt={seal.alt}
                width={seal.width}
                className="h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
