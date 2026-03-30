'use client'

import { motion } from 'framer-motion'

const seals = [
  {
    src: '/Logo Proveedor Tecnologico.png',
    alt: 'Proveedor Tecnológico Autorizado por la DIAN — Nodexum S.A.S.',
    width: 110,
  },
  {
    src: '/Fb Certification Iso 27001 2022.png',
    alt: 'Certificación ISO 27001:2022 — Seguridad de la Información',
    width: 130,
  },
  {
    src: '/Oracle-Cloud-Emblem.png',
    alt: 'Oracle Cloud Partner',
    width: 120,
  },
  {
    src: '/sello1-1024x446.png',
    alt: 'Digital Business Network Alliance Member',
    width: 160,
  },
  {
    src: '/SelloEmision-1024x448.png',
    alt: 'e-Misión — Certified Service Providers',
    width: 170,
  },
]

export default function CertificationsSection() {
  return (
    <section className="py-10 border-y" style={{ borderColor: '#E2E8F0', backgroundColor: '#FAFBFF' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: '#94A3B8' }}>
          Certificaciones y reconocimientos
        </p>

        {/* ── MOBILE: carrusel deslizable horizontal ─────────────────── */}
        <div className="md:hidden">
          <div
            className="flex items-center gap-8 overflow-x-auto pb-4"
            style={{
              scrollbarWidth: 'none',        /* Firefox */
              msOverflowStyle: 'none',        /* IE / Edge */
              WebkitOverflowScrolling: 'touch',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            {seals.map((seal) => (
              <div
                key={seal.alt}
                className="shrink-0 flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={seal.src}
                  alt={seal.alt}
                  width={seal.width}
                  className="h-auto object-contain"
                  style={{ maxHeight: '64px' }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Indicador de scroll */}
          <p className="text-center text-[10px] mt-1" style={{ color: '#CBD5E1' }}>
            ← desliza para ver más →
          </p>
        </div>

        {/* ── DESKTOP: fila centrada con efectos hover ────────────────── */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-10 lg:gap-14">
          {seals.map((seal, i) => (
            <motion.div
              key={seal.alt}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={seal.src}
                alt={seal.alt}
                width={seal.width}
                className="h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
                style={{ maxHeight: '72px' }}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
