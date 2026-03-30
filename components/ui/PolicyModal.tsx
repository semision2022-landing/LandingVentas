'use client'

import { useEffect, useRef } from 'react'
import { X, FileText } from 'lucide-react'

interface PolicyModalProps {
  isOpen: boolean
  title: string
  pdfPath: string   // ruta original ej: /politica-proteccion-datos.pdf
  onClose: () => void
}

export default function PolicyModal({ isOpen, title, pdfPath, onClose }: PolicyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Extraer solo el nombre del archivo para la API route
  const filename = pdfPath.split('/').pop() ?? ''
  const iframeSrc = `/api/pdf?file=${encodeURIComponent(filename)}`

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Bloquear scroll del body mientras está abierto
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
      {/* Panel */}
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

        {/* PDF viewer — iframe apuntando a /api/pdf?file=... que sirve con headers correctos */}
        <div className="flex-1 overflow-hidden">
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
