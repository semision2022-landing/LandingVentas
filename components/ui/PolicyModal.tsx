'use client'

import { useEffect, useRef } from 'react'
import { X, FileText } from 'lucide-react'

interface PolicyModalProps {
  isOpen: boolean
  title: string
  pdfPath: string
  onClose: () => void
}

export default function PolicyModal({ isOpen, title, pdfPath, onClose }: PolicyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Bloquear scroll del body
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
      {/* Drawer/Panel */}
      <div
        className="relative w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '92vh', height: '92vh' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0 border-b"
          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,208,255,0.1)' }}>
              <FileText size={18} style={{ color: '#00D0FF' }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Documento legal</p>
              <h3 className="text-sm font-bold" style={{ color: '#18224C' }}>{title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfPath}
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: '#18224C', color: 'white' }}
            >
              ↓ Descargar
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

        {/* PDF Viewer — object es más compatible que iframe para PDFs estáticos */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <object
            data={`${pdfPath}#toolbar=1&view=FitH`}
            type="application/pdf"
            className="w-full h-full border-0"
            style={{ minHeight: 0, display: 'block' }}
          >
            {/* Fallback si el browser no soporta embed nativo */}
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#94A3B8' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium mb-3" style={{ color: '#64748B' }}>
                Tu navegador no puede mostrar el PDF directamente.
              </p>
              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: '#18224C' }}
              >
                Abrir en nueva pestaña
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  )
}
