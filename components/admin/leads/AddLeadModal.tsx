'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createAuthClient } from '@/lib/supabase-auth'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddLeadModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: '',
    note: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createAuthClient()
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('No estás autenticado')

      // 1. Crear la conversación (lead)
      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .insert({
          session_id: crypto.randomUUID(), // fake session for manual
          status: 'with_agent',
          visitor_name: formData.name || null,
          visitor_email: formData.email || null,
          visitor_phone: formData.phone || null,
          plan_interest: formData.plan || null,
          assigned_to: userData.user.id,
          attended: true,
          lead_source: 'whatsapp', // default to algo existente o null
          lead_source_type: 'manual',
          added_by: userData.user.id
        })
        .select()
        .single()

      if (convErr) throw convErr

      // 2. Si hay nota, insertarla
      if (formData.note.trim() && conv) {
        await supabase.from('lead_notes').insert({
          lead_id: conv.id,
          agent_id: userData.user.id,
          content: formData.note.trim()
        })
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Error al crear lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,31,82,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-lg font-bold" style={{ color: '#18224C' }}>Agregar Lead Manual</h2>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors hover:bg-gray-100" style={{ color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Nombre completo</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Email (Opcional)</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Teléfono / WhatsApp</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:border-blue-500" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Plan de interés</label>
              <input type="text" placeholder="Ej: Plan Pro, Emprendedor..." value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:border-blue-500" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Nota inicial (Opcional)</label>
              <textarea value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} rows={3}
                placeholder="Ingresa detalles sobre este lead..."
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:border-blue-500 resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg border transition-colors hover:bg-gray-50" style={{ color: '#64748B' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#18224C' }}>
              {loading ? 'Guardando...' : <><Plus size={16} /> Crear Lead</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
