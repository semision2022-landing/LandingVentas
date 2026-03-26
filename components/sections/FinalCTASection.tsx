'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'

export default function FinalCTASection() {
  return (
    <section
      className="py-24"
      style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            ¿Listo para empezar a facturar{' '}
            <span style={{ color: 'var(--cyan)' }}>legalmente?</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">
            +10.000 empresas ya confían en e-Misión. Habilitación DIAN en 48 horas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#planes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--cyan)', color: 'var(--navy)' }}
            >
              Ver planes y precios
              <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/573044796885"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border-2 transition-all duration-200 hover:bg-white hover:text-navy hover:-translate-y-1"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <MessageCircle size={18} />
              Hablar con un asesor
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {[
              { icon: '✓', text: 'Sin costo de instalación' },
              { icon: '✓', text: 'Habilitación DIAN en 48h' },
              { icon: '✓', text: 'Soporte técnico gratis' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-white/70">
                <span className="font-bold" style={{ color: 'var(--cyan)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
