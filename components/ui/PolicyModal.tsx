'use client'

import { useEffect, useRef } from 'react'
import { X, FileText, ExternalLink, Download } from 'lucide-react'

interface PolicyModalProps {
  isOpen: boolean
  title: string
  pdfPath: string
  onClose: () => void
}

export default function PolicyModal({ isOpen, title, pdfPath, onClose }: PolicyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const filename = pdfPath.split('/').pop() ?? ''
  const iframeSrc = `/api/pdf?file=${encodeURIComponent(filename)}`

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '92vh', height: '92vh' }}
      >
        {/* Header — igual en móvil y desktop */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0 border-b"
          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,208,255,0.1)' }}>
              <FileText size={18} style={{ color: '#00D0FF' }} />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#94A3B8' }}>
                Documento legal
              </p>
              <h3 className="text-sm font-bold leading-tight" style={{ color: '#18224C' }}>{title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfPath}
              download
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: '#18224C', color: 'white' }}
            >
              <Download size={12} /> Descargar
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
              aria-label="Cerrar"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── MÓVIL: vista amigable con botones de acción ──────────────── */}
        <div className="flex sm:hidden flex-col items-center justify-center flex-1 px-6 py-8 text-center gap-6">
          {/* Icono decorativo */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,208,255,0.08)', border: '2px dashed rgba(0,208,255,0.3)' }}
          >
            <FileText size={36} style={{ color: '#00D0FF' }} />
          </div>

          <div>
            <h4 className="text-base font-bold mb-2" style={{ color: '#18224C' }}>{title}</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              Para leer este documento cómodamente, ábrelo en tu visor de PDF.
            </p>
          </div>

          {/* Botón principal — abre el PDF en pantalla completa nativa */}
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: '#18224C', color: 'white' }}
          >
            <ExternalLink size={16} />
            Ver documento completo
          </a>

          {/* Descarga secundaria */}
          <a
            href={pdfPath}
            download
            className="flex items-center gap-2 text-sm font-medium py-2"
            style={{ color: '#94A3B8' }}
          >
            <Download size={14} />
            Descargar PDF
          </a>
        </div>

        {/* ── DESKTOP: iframe con viewer completo ─────────────────────── */}
        <div className="hidden sm:flex flex-1 overflow-hidden">
          <iframe
            src={iframeSrc}
            title={title}
            className="w-full h-full border-0"
            style={{ minHeight: 0, display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}
