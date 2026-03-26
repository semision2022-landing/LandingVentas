import Image from 'next/image'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const footerLinks = {
  servicios: [
    { label: 'Facturación Electrónica', href: '#planes' },
    { label: 'Nómina Electrónica', href: '#planes' },
    { label: 'POS Electrónico', href: '#servicios' },
    { label: 'SG-SST', href: '#servicios' },
  ],
  legal: [
    { label: 'Política de privacidad', href: '/privacidad' },
    { label: 'Términos y condiciones', href: '/terminos' },
    { label: 'Política de devoluciones', href: '/devoluciones' },
  ],
}

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/emisioncol',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/emisioncol',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/emision',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer id="contacto" style={{ backgroundColor: 'var(--navy)' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="e-Misión logo"
                width={220}
                height={60}
                className="w-auto h-14"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Proveedor tecnológico avalado por la DIAN. Más de 10.000 empresas confían en nosotros desde 2018.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="font-semibold text-white mb-4">Servicios</h3>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--cyan)' }} />
                Cra 44 # 23 sur 15, Envigado, Antioquia
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone size={15} className="shrink-0" style={{ color: 'var(--cyan)' }} />
                <a href="tel:6045903572" className="hover:text-white transition-colors">604 590 3572</a>
                {' · '}
                <a href="tel:3044796885" className="hover:text-white transition-colors">304 479 6885</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail size={15} className="shrink-0" style={{ color: 'var(--cyan)' }} />
                <a href="mailto:contacto@emision.co" className="hover:text-white transition-colors">
                  contacto@emision.co
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <Clock size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--cyan)' }} />
                <span>
                  L-V 7am–6pm<br />
                  Sáb 7am–2pm
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © 2026 e-Misión — Nodexum S.A.S. Todos los derechos reservados.
          </p>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'rgba(0, 208, 255, 0.1)', color: 'var(--cyan)' }}
          >
            ✓ Proveedor avalado por la DIAN
          </div>
        </div>
      </div>
    </footer>
  )
}
