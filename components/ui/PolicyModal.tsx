'use client'

import { useEffect, useRef, Suspense, lazy } from 'react'
import { X, FileText, Download } from 'lucide-react'

// Carga el viewer solo en client (pdfjs usa APIs de browser)
const PDFViewer = lazy(() => import('./PDFViewer'))

interface PolicyModalProps {
  isOpen: boolean
  title: string
  pdfPath: string
  onClose: () => void
}

export default function PolicyModal({ isOpen, title, pdfPath, onClose }: PolicyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const filename = pdfPath.split('/').pop() ?? ''
  const apiSrc = `/api/pdf?file=${encodeURIComponent(filename)}`

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
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '94vh', height: '94vh' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 shrink-0 border-b"
          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(0,208,255,0.12)' }}>
              <FileText size={16} style={{ color: '#00D0FF' }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#94A3B8' }}>
                Documento legal
              </p>
              <h3 className="text-sm font-bold truncate" style={{ color: '#18224C' }}>{title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <a
              href={pdfPath}
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-80"
              style={{ backgroundColor: '#18224C', color: 'white' }}
            >
              <Download size={12} /> Descargar
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:scale-110"
              style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
              aria-label="Cerrar"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* PDF Viewer — responsivo en móvil y desktop */}
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full" style={{ backgroundColor: '#525659' }}>
              <div className="flex flex-col items-center gap-3 text-white/60">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                <span className="text-xs">Cargando documento...</span>
              </div>
            </div>
          }>
            <PDFViewer src={apiSrc} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
