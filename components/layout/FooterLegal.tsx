'use client'

import { useState, useCallback } from 'react'
import PolicyModal from '@/components/ui/PolicyModal'

const policies = [
  {
    label: 'Política de protección de datos',
    shortLabel: 'Protección de datos',
    pdf: '/politica-proteccion-datos.pdf',
  },
  {
    label: 'Términos y condiciones',
    shortLabel: 'Términos y condiciones',
    pdf: '/terminos-y-condiciones.pdf',
  },
  {
    label: 'Política de devoluciones',
    shortLabel: 'Política de devoluciones',
    pdf: '/POLÍTICA DE GARANTÍA RETRACTO O DEVOLUCIONES.pdf',
  },
]

export default function FooterLegal() {
  const [openPolicy, setOpenPolicy] = useState<{ title: string; pdf: string } | null>(null)

  const open = useCallback((title: string, pdf: string) => setOpenPolicy({ title, pdf }), [])
  const close = useCallback(() => setOpenPolicy(null), [])

  return (
    <>
      <ul className="space-y-2.5">
        {policies.map((p) => (
          <li key={p.label}>
            <button
              onClick={() => open(p.label, p.pdf)}
              className="text-sm text-left text-white/60 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {p.label}
            </button>
          </li>
        ))}
      </ul>

      {openPolicy && (
        <PolicyModal
          isOpen={true}
          title={openPolicy.title}
          pdfPath={openPolicy.pdf}
          onClose={close}
        />
      )}
    </>
  )
}
