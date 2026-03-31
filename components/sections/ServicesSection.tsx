'use client'

import { motion } from 'framer-motion'
import { FileText, Users, ShoppingCart, ShieldCheck, ArrowRight, FileSignature, CalendarClock } from 'lucide-react'

const services = [
  {
    icon: FileText,
    title: 'Facturación Electrónica',
    description: 'Emite facturas, notas crédito, débito y documento soporte con cumplimiento total DIAN.',
    price: 'Desde $120.000/año',
    color: 'var(--cyan)',
  },
  {
    icon: Users,
    title: 'Nómina Electrónica',
    description: 'Reporta novedades de nómina ante la DIAN de manera automatizada y sin complicaciones.',
    price: 'Incluida en planes integrales',
    color: 'var(--purple)',
  },
  {
    icon: ShoppingCart,
    title: 'POS Electrónico',
    description: 'Sistema de punto de venta integrado con facturación electrónica DIAN en tiempo real.',
    price: 'Sistema punto de venta',
    color: 'var(--green)',
  },
  {
    icon: ShieldCheck,
    title: 'SG-SST',
    description: 'Gestión de seguridad y salud en el trabajo. Cumple con la normatividad colombiana.',
    price: 'Seguridad y salud laboral',
    color: '#F59E0B',
  },
  {
    icon: FileSignature,
    title: 'Endoso',
    description: 'Transmisión y gestión de endosos electrónicos de facturas ante la RADIAN con validez legal.',
    price: 'Documento electrónico RADIAN',
    color: '#8B5CF6',
  },
  {
    icon: CalendarClock,
    title: 'Eventos Mercantiles',
    description: 'Registro y transmisión de eventos mercantiles electrónicos: recibo, aceptación, reclamación y más.',
    price: 'Gestión de eventos DIAN',
    color: '#EC4899',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ServicesSection() {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: 'rgba(24, 34, 76, 0.08)', color: 'var(--navy)' }}
          >
            Nuestros productos
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Todo lo que tu empresa necesita
          </motion.h2>
          <motion.p
            className="section-subtitle max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Soluciones de documentos electrónicos integradas y autorizadas por la DIAN para empresas de todos los tamaños.
          </motion.p>
        </div>

        {/* Cards — 2 cols mobile, 3 cols tablet, 3 cols desktop */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="card group cursor-pointer"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${service.color}18`, color: service.color }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--navy)' }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4 hidden sm:block" style={{ color: 'var(--gray)' }}>
                  {service.description}
                </p>
                <p className="text-xs font-semibold mb-3" style={{ color: service.color }}>
                  {service.price}
                </p>
                <a
                  href="#planes"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                  style={{ color: 'var(--navy)' }}
                >
                  Conocer más <ArrowRight size={14} />
                </a>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
