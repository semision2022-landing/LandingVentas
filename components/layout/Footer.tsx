
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import FooterLegal from '@/components/layout/FooterLegal'

const footerLinks = {
  servicios: [
    { label: 'Facturación Electrónica', href: '#planes' },
    { label: 'Nómina Electrónica', href: '#planes' },
    { label: 'POS Electrónico', href: '#servicios' },
    { label: 'Eventos Mercantiles', href: '#servicios' },
    { label: 'Endoso', href: '#servicios' },
    { label: 'SG-SST', href: '#servicios' },
  ],
  legal: [
    { label: 'Política de protección de datos', href: '/politica-proteccion-datos.pdf', download: true },
    { label: 'Términos y condiciones', href: '/terminos-y-condiciones.pdf', download: true },
    { label: 'Política de devoluciones', href: '/devoluciones' },
  ],
}

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/emisionnodexum/',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/e_mision_colombia/',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@e-mision',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
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
              <img
                src="/logo.svg"
                alt="e-Misión logo"
                className="w-auto h-12 animate-wave-logo"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Proveedor tecnológico autorizado por la DIAN. Cada vez más empresas confían en nosotros desde 2019.
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
            <FooterLegal />
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
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                {/* WhatsApp icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" style={{ color: '#25D366' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href="https://wa.me/573044796885" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  304 479 6885
                </a>
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
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                {/* Globe icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ color: 'var(--cyan)' }}>
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <a href="https://emision.co" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  emision.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm text-white/50">
              © 2026 e-Misión — Nodexum S.A.S. Todos los derechos reservados.
            </p>
            <p className="text-xs mt-1 text-white/40 flex items-center gap-1">
              Desarrollado con <span className="text-red-500 text-sm animate-pulse">♥️</span> por{' '}
              <a 
                href="https://wa.me/573138537261?text=Hola%20Renting%20Amc%20Agency!%20Me%20encant%C3%B3%20el%20dise%C3%B1o%20de%20la%20p%C3%A1gina%20web.%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20su%20agencia." 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-all duration-300 font-medium hover:underline decoration-white/30"
              >
                Renting Amc Agency
              </a>
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'rgba(0, 208, 255, 0.1)', color: 'var(--cyan)' }}
          >
            ✓ Proveedor autorizado por la DIAN
          </div>
        </div>
      </div>
    </footer>
  )
}
