'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Clock, RefreshCw, GraduationCap, Headphones, Award } from 'lucide-react'

const guarantees = [
  {
    icon: ShieldCheck,
    title: 'Sin cláusula de permanencia',
    description: 'Puedes cancelar cuando quieras. Sin multas, sin letra pequeña. Tu tranquilidad es primero.',
    color: 'var(--green)',
    bg: 'rgba(87, 150, 1, 0.08)',
  },
  {
    icon: Clock,
    title: 'Habilitación DIAN en 48h',
    description: 'Garantizamos tu habilitación ante la DIAN en máximo 48 horas hábiles tras el pago. O te devolvemos el dinero.',
    color: 'var(--cyan)',
    bg: 'rgba(0, 208, 255, 0.08)',
  },
  {
    icon: RefreshCw,
    title: 'Migración gratuita',
    description: 'Venías con otro proveedor? Te ayudamos a migrar todos tus datos sin costo adicional.',
    color: 'var(--purple)',
    bg: 'rgba(95, 78, 218, 0.08)',
  },
  {
    icon: GraduationCap,
    title: 'Capacitación incluida',
    description: 'Videotutoriales, capacitaciones grupales vía Teams y documentación técnica completa. Todo incluido.',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
  },
  {
    icon: Headphones,
    title: 'Soporte técnico gratis',
    description: 'Nuestro equipo está disponible L-V 7:30am–6:30pm y sábados 8am–2pm. Sin cobros extra por soporte.',
    color: 'var(--navy)',
    bg: 'rgba(24, 34, 76, 0.06)',
  },
  {
    icon: Award,
    title: 'Certificado ISO27001',
    description: 'Tu información protegida con los más altos estándares de seguridad internacionales y Oracle Cloud.',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.08)',
  },
]

export default function RiskReversal() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--gray-light)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: 'rgba(87,150,1,0.12)', color: 'var(--green)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            ✓ Compromiso e-Misión
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Compra sin riesgo
          </motion.h2>
          <motion.p
            className="section-subtitle max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Entendemos que cambiar de proveedor genera dudas. Por eso eliminamos todos los riesgos para ti.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guarantees.map((g, i) => {
            const Icon = g.icon
            return (
              <motion.div
                key={g.title}
                className="bg-white rounded-2xl p-6 flex gap-4"
                style={{ border: '1px solid var(--gray-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: g.bg, color: g.color }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--navy)' }}>{g.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--gray)' }}>{g.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom trust badge */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'white', border: '1px solid var(--gray-border)', color: 'var(--gray)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--green)' }} />
            Proveedor autorizado por la DIAN desde 2019 · cada vez más empresas activas
          </div>
        </motion.div>
      </div>
    </section>
  )
}
