'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { fbEvent, generateEventId } from '@/lib/fbq'
import WhatsAppLeadModal from '@/components/ui/WhatsAppLeadModal'

const navLinks = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Planes', href: '#planes' },
  { label: 'Chatbot', href: '#chatbot' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [waModalOpen, setWaModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
        style={{
          backgroundColor: scrolled ? 'rgba(24, 34, 76, 0.97)' : 'var(--navy)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group" aria-label="e-Misión inicio">
            <img
              src="/logo.svg"
              alt="e-Misión logo"
              className="w-auto h-14 sm:h-16 lg:h-[72px] animate-wave-logo"
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: 'var(--cyan)' }}
                />
              </a>
            ))}
          </div>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => { fbEvent('Contact', { content_name: 'WhatsApp Navbar' }, generateEventId()); setWaModalOpen(true) }}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              WhatsApp
            </button>
            <a
              href="#planes"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--cyan)', color: 'var(--navy)' }}
            >
              Ver planes
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t border-white/10"
            style={{ backgroundColor: 'var(--navy)' }}
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/80 font-medium hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setMenuOpen(false); setWaModalOpen(true) }}
                className="text-white/80 font-medium hover:text-white transition-colors text-left"
              >
                WhatsApp
              </button>
              <a
                href="#planes"
                className="btn-cyan text-center text-sm font-semibold py-3 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Ver planes y precios
              </a>
            </div>
          </div>
        )}
      </header>
      <WhatsAppLeadModal isOpen={waModalOpen} onClose={() => setWaModalOpen(false)} />
    </>
  )
}
