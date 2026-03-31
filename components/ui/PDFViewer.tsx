'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Worker de pdfjs desde CDN (evita bundling del WASM)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  src: string    // URL del PDF (ej: /api/pdf?file=...)
}

export default function PDFViewer({ src }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [width, setWidth] = useState(600)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mide el ancho del contenedor para ajustar el PDF
  const measureWidth = useCallback(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    measureWidth()
    const observer = new ResizeObserver(measureWidth)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [measureWidth])

  return (
    <div ref={containerRef} className="flex flex-col h-full" style={{ backgroundColor: '#525659' }}>

      {/* Barra de paginación */}
      {numPages > 0 && (
        <div
          className="flex items-center justify-between px-4 py-2 shrink-0"
          style={{ backgroundColor: '#3c3f41', color: 'white' }}
        >
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded text-xs font-medium disabled:opacity-30 hover:bg-white/10 transition"
          >
            ← Anterior
          </button>
          <span className="text-xs">
            Página {page} de {numPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(numPages, p + 1))}
            disabled={page === numPages}
            className="px-3 py-1 rounded text-xs font-medium disabled:opacity-30 hover:bg-white/10 transition"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* PDF Pages — scroll vertical */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 gap-4">
        {/* Skeleton mientras carga */}
        {loading && !error && (
          <div
            className="animate-pulse rounded"
            style={{ width: width - 32, height: 400, backgroundColor: '#666' }}
          />
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-12 text-white/60 text-sm">
            <span className="text-3xl">📄</span>
            No se pudo cargar el documento.
          </div>
        )}

        <Document
          file={src}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false) }}
          onLoadError={() => { setError(true); setLoading(false) }}
          loading={null}
        >
          {/* Renderiza solo la página actual (más rápido en móvil) */}
          <Page
            pageNumber={page}
            width={Math.max(width - 24, 100)}
            renderTextLayer
            renderAnnotationLayer
            className="shadow-xl"
          />
        </Document>
      </div>
    </div>
  )
}
