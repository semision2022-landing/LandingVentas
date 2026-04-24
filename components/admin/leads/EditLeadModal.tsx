'use client'

import { useState, useEffect, useRef } from 'react'
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

// ─── Field wrapper defined OUTSIDE component to avoid remount on each render ──
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export default function EditLeadModal({ lead, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [loadingAgents, setLoadingAgents] = useState(false)
  const [error, setError] = useState('')
  const [agents, setAgents] = useState<Agent[]>([])

  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [planInterest, setPlanInterest] = useState('')
  const [assignedTo, setAssignedTo] = useState<string>('')

  // Track which lead ID we last initialised from, so we only reset form when
  // a DIFFERENT lead is opened — not on every object-reference change.
  const initialisedForId = useRef<string | null>(null)

  useEffect(() => {
    if (lead && isOpen && lead.id !== initialisedForId.current) {
      initialisedForId.current = lead.id
      setVisitorName(lead.visitor_name ?? '')
      setVisitorEmail(lead.visitor_email ?? '')
      setVisitorPhone(lead.visitor_phone ?? '')
      setPlanInterest(lead.plan_interest ?? '')
      setAssignedTo((lead as Conversation & { assigned_to?: string }).assigned_to ?? '')
      setError('')
    }
    if (!isOpen) {
      // Reset tracker when modal closes so next open always initialises
      initialisedForId.current = null
    }
  }, [lead?.id, isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load agents only once when modal first opens
  const agentsLoadedRef = useRef(false)
  useEffect(() => {
    if (!isOpen) { agentsLoadedRef.current = false; return }
    if (agentsLoadedRef.current) return
    agentsLoadedRef.current = true
    const supabase = createAuthClient()
    setLoadingAgents(true)
    supabase
      .from('agents')
      .select('id, name, email, role')
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
        visitor_name: visitorName || null,
        visitor_email: visitorEmail || null,
        visitor_phone: visitorPhone || null,
        plan_interest: planInterest || null,
        assigned_to: assignedTo || null,
      }

      if (assignedTo) {
        const agent = agents.find(a => a.id === assignedTo)
        if (agent) updates.assigned_agent = agent.name
      } else {
        updates.assigned_agent = null
      }

      const { error: updateErr } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', lead.id)

      if (updateErr) throw updateErr

      const assignedAgent = assignedTo ? agents.find(a => a.id === assignedTo) : null

      onSuccess({
        visitor_name: visitorName || null,
        visitor_email: visitorEmail || null,
        visitor_phone: visitorPhone || null,
        plan_interest: planInterest || null,
        assigned_to: assignedTo || null,
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

  const selectedAgent = assignedTo ? agents.find(a => a.id === assignedTo) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,31,82,0.45)', backdropFilter: 'blur(6px)' }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
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
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  className={inputCls}
                  placeholder="Nombre del lead"
                  style={{ borderColor: '#E2E8F0', color: '#18224C' }}
                />
              </Field>
            </div>

            <Field label="Email">
              <input
                type="email"
                value={visitorEmail}
                onChange={e => setVisitorEmail(e.target.value)}
                className={inputCls}
                placeholder="correo@empresa.com"
                style={{ borderColor: '#E2E8F0', color: '#18224C' }}
              />
            </Field>

            <Field label="Teléfono / WhatsApp">
              <input
                type="text"
                value={visitorPhone}
                onChange={e => setVisitorPhone(e.target.value)}
                className={inputCls}
                placeholder="3001234567"
                style={{ borderColor: '#E2E8F0', color: '#18224C' }}
              />
            </Field>

            <div className="col-span-2">
              <Field label="Plan de interés">
                <input
                  type="text"
                  list="edit-lead-plan-options"
                  value={planInterest}
                  onChange={e => setPlanInterest(e.target.value)}
                  className={inputCls}
                  placeholder="Selecciona o escribe un plan..."
                  style={{ borderColor: '#E2E8F0', color: '#18224C' }}
                />
                <datalist id="edit-lead-plan-options">
                  {PLAN_OPTIONS.map(p => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
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
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    disabled={loadingAgents}
                    className={`${inputCls} pl-9 appearance-none`}
                    style={{ borderColor: '#E2E8F0', color: assignedTo ? '#18224C' : '#94A3B8' }}
                  >
                    <option value="">— Sin asignar —</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.role === 'admin' ? 'Admin' : 'Asesor'}) · {agent.email}
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

              {selectedAgent && (
                <div
                  className="mt-2 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: '#18224C' }}
                  >
                    {selectedAgent.name.charAt(0).toUpperCase()}
                  </div>
                  <span>
                    Asignado a: <strong>{selectedAgent.name}</strong> · {selectedAgent.email}
                  </span>
                </div>
              )}
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
