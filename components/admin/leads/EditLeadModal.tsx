'use client'

import { useState, useEffect } from 'react'
import { X, Save, User, AlertCircle } from 'lucide-react'
import { createAuthClient } from '@/lib/supabase-auth'
import type { Conversation } from '@/types/admin'

interface Agent {
  id: string
  name: string
  email: string
  role: string
}

interface Props {
  lead: Conversation | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (updated: Partial<Conversation>) => void
}

const PLAN_OPTIONS = [
  'Plan Básico',
  'Plan Emprendedor',
  'Plan Pro',
  'Plan Empresarial',
  'Nómina Electrónica',
  'POS Electrónico',
  'Eventos Mercantiles',
  'Endoso',
  'SG-SST',
]

export default function EditLeadModal({ lead, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [loadingAgents, setLoadingAgents] = useState(false)
  const [error, setError] = useState('')
  const [agents, setAgents] = useState<Agent[]>([])

  const [form, setForm] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
    plan_interest: '',
    assigned_to: '' as string | null,
  })

  // Sync form with lead data when modal opens
  useEffect(() => {
    if (lead && isOpen) {
      setForm({
        visitor_name: lead.visitor_name ?? '',
        visitor_email: lead.visitor_email ?? '',
        visitor_phone: lead.visitor_phone ?? '',
        plan_interest: lead.plan_interest ?? '',
        assigned_to: (lead as Conversation & { assigned_to?: string }).assigned_to ?? null,
      })
      setError('')
    }
  }, [lead, isOpen])

  // Load agents list
  useEffect(() => {
    if (!isOpen) return
    const supabase = createAuthClient()
    setLoadingAgents(true)
    supabase
      .from('agents')
      .select('id, name, email, role')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        setAgents((data ?? []) as Agent[])
        setLoadingAgents(false)
      })
  }, [isOpen])

  if (!isOpen || !lead) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createAuthClient()

      const updates: Record<string, string | null> = {
        visitor_name: form.visitor_name || null,
        visitor_email: form.visitor_email || null,
        visitor_phone: form.visitor_phone || null,
        plan_interest: form.plan_interest || null,
        assigned_to: form.assigned_to || null,
      }

      // Also update assigned_agent name (denormalized) for easy display
      if (form.assigned_to) {
        const agent = agents.find(a => a.id === form.assigned_to)
        if (agent) updates.assigned_agent = agent.name
      } else {
        updates.assigned_agent = null
      }

      const { error: updateErr } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', lead.id)

      if (updateErr) throw updateErr

      // Build the updated object to pass back
      const assignedAgent = form.assigned_to
        ? agents.find(a => a.id === form.assigned_to)
        : null

      onSuccess({
        visitor_name: form.visitor_name || null,
        visitor_email: form.visitor_email || null,
        visitor_phone: form.visitor_phone || null,
        plan_interest: form.plan_interest || null,
        assigned_to: form.assigned_to || null,
        assigned_agent: assignedAgent?.name ?? null,
        agent_name: assignedAgent?.name ?? null,
      } as Partial<Conversation>)

      onClose()
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Error al actualizar el lead')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({
    label,
    required,
    children,
  }: {
    label: string
    required?: boolean
    children: React.ReactNode
  }) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )

  const inputCls =
    'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,31,82,0.45)', backdropFilter: 'blur(6px)' }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#E2E8F0', background: 'linear-gradient(135deg,#F8FAFC,#EEF2FF)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#18224C' }}>
              Editar Lead
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
              {lead.visitor_name || 'Sin nombre'} · {lead.visitor_email || lead.visitor_phone || 'Sin contacto'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-white border border-transparent hover:border-slate-200"
            style={{ color: '#64748B' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Nombre completo">
                <input
                  type="text"
                  value={form.visitor_name}
                  onChange={e => setForm({ ...form, visitor_name: e.target.value })}
                  className={inputCls}
                  placeholder="Nombre del lead"
                  style={{ borderColor: '#E2E8F0', color: '#18224C' }}
                />
              </Field>
            </div>

            <Field label="Email">
              <input
                type="email"
                value={form.visitor_email}
                onChange={e => setForm({ ...form, visitor_email: e.target.value })}
                className={inputCls}
                placeholder="correo@empresa.com"
                style={{ borderColor: '#E2E8F0', color: '#18224C' }}
              />
            </Field>

            <Field label="Teléfono / WhatsApp">
              <input
                type="text"
                value={form.visitor_phone}
                onChange={e => setForm({ ...form, visitor_phone: e.target.value })}
                className={inputCls}
                placeholder="3001234567"
                style={{ borderColor: '#E2E8F0', color: '#18224C' }}
              />
            </Field>

            <div className="col-span-2">
              <Field label="Plan de interés">
                <div className="relative">
                  <input
                    type="text"
                    list="plan-options"
                    value={form.plan_interest}
                    onChange={e => setForm({ ...form, plan_interest: e.target.value })}
                    className={inputCls}
                    placeholder="Selecciona o escribe un plan..."
                    style={{ borderColor: '#E2E8F0', color: '#18224C' }}
                  />
                  <datalist id="plan-options">
                    {PLAN_OPTIONS.map(p => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>
              </Field>
            </div>

            {/* Agent assignment */}
            <div className="col-span-2">
              <Field label="Asesor asignado">
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#94A3B8' }}
                  />
                  <select
                    value={form.assigned_to ?? ''}
                    onChange={e =>
                      setForm({ ...form, assigned_to: e.target.value || null })
                    }
                    disabled={loadingAgents}
                    className={`${inputCls} pl-9 appearance-none`}
                    style={{ borderColor: '#E2E8F0', color: form.assigned_to ? '#18224C' : '#94A3B8' }}
                  >
                    <option value="">— Sin asignar —</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.role === 'admin' ? 'Admin' : 'Asesor'})
                        {' · '}{agent.email}
                      </option>
                    ))}
                  </select>
                  {loadingAgents && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="w-3 h-3 border-2 border-blue-300 border-t-transparent rounded-full animate-spin block" />
                    </span>
                  )}
                </div>
              </Field>

              {/* Current assignment display */}
              {form.assigned_to && (() => {
                const a = agents.find(x => x.id === form.assigned_to)
                return a ? (
                  <div
                    className="mt-2 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: '#18224C' }}
                    >
                      {a.name.charAt(0).toUpperCase()}
                    </div>
                    <span>
                      Asignado a: <strong>{a.name}</strong> · {a.email}
                    </span>
                  </div>
                ) : null
              })()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: '#F1F5F9' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-xl border transition-colors hover:bg-gray-50 disabled:opacity-50"
              style={{ color: '#64748B', borderColor: '#E2E8F0' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50 hover:-translate-y-0.5"
              style={{ backgroundColor: '#18224C' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
