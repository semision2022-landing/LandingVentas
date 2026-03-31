'use client'

const seals = [
  { src: '/Logo Proveedor Tecnologico.png', alt: 'Proveedor Tecnológico DIAN', width: 90 },
  { src: '/Fb Certification Iso 27001 2022.png', alt: 'ISO 27001:2022', width: 110 },
  { src: '/Oracle-Cloud-Emblem.png', alt: 'Oracle Cloud Partner', width: 100 },
  { src: '/sello1-1024x446.png', alt: 'Digital Business Network Alliance', width: 140 },
  { src: '/SelloEmision-1024x448.png', alt: 'e-Misión Certified Service Providers', width: 150 },
  { src: '/LogoRADIAN.png', alt: 'RADIAN', width: 100 },
]

// Duplicamos para el loop infinito seamless
const track = [...seals, ...seals, ...seals]

export default function CertificationsSection() {
  return (
    <section
      className="relative py-12 overflow-hidden"
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
        className="text-center text-[11px] font-bold uppercase tracking-[0.25em] mb-8 relative z-10"
        style={{ color: 'rgba(0,208,255,0.6)' }}
      >
        ✦ Certificaciones &amp; Reconocimientos ✦
      </p>

      {/* Marquee wrapper */}
      <div className="relative z-10">
        {/* Fade izquierdo */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 md:w-36 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0D1635, transparent)',
          }}
        />
        {/* Fade derecho */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 md:w-36 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #0D1635, transparent)',
          }}
        />

        {/* Track animado */}
        <div
          className="flex items-center gap-12 md:gap-16"
          style={{
            width: 'max-content',
            animation: 'marqueeScroll 28s linear infinite',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'
          }}
        >
          {track.map((seal, i) => (
            <div
              key={`${seal.alt}-${i}`}
              className="shrink-0 flex items-center justify-center px-2"
              style={{ opacity: 0.85 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={seal.src}
                alt={seal.alt}
                width={seal.width}
                className="h-auto object-contain transition-all duration-300"
                style={{
                  maxHeight: '56px',
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.75,
                }}
                loading="lazy"
                onMouseEnter={(e) => {
                  const img = e.currentTarget
                  img.style.filter = 'brightness(0) invert(1)'
                  img.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget
                  img.style.filter = 'brightness(0) invert(1)'
                  img.style.opacity = '0.75'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe CSS */}
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  )
}
