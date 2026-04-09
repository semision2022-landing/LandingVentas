'use client'

import { useState, useEffect } from 'react'
import { X, CheckSquare, MessageSquare, Tag, Plus, Check, ChevronDown } from 'lucide-react'
import { createAuthClient } from '@/lib/supabase-auth'
import type { Conversation, LeadNote, LeadTask, LeadLabel } from '@/types/admin'

// ─── CRM Status config ────────────────────────────────────────────────────────
const CRM_STATUSES: { value: string; label: string; color: string; bg: string }[] = [
  { value: 'pendiente',      label: '⏳ Pendiente',      color: '#B45309', bg: '#FEF9C3' },
  { value: 'interesado',     label: '💚 Interesado',     color: '#166534', bg: '#DCFCE7' },
  { value: 'seguimiento',    label: '🔵 Seguimiento',    color: '#1E40AF', bg: '#DBEAFE' },
  { value: 'venta',          label: '🟠 Venta',          color: '#9A3412', bg: '#FFEDD5' },
  { value: 'cerrado_perdido', label: '🔴 Cerrado/Perdido', color: '#991B1B', bg: '#FEE2E2' },
]

// ─── Predefined Labels ────────────────────────────────────────────────────────
const PRESET_LABELS: { label: string; color: string; bg: string }[] = [
  { label: 'Pendiente',      bg: '#FEF9C3', color: '#854D0E' },
  { label: 'Interesado',     bg: '#DCFCE7', color: '#166534' },
  { label: 'Seguimiento',    bg: '#DBEAFE', color: '#1E40AF' },
  { label: 'Venta',          bg: '#FFEDD5', color: '#9A3412' },
  { label: 'Cerrado/Perdido', bg: '#FEE2E2', color: '#991B1B' },
]

interface Props {
  lead: Conversation | null
  onClose: () => void
  onStatusChange?: (leadId: string, newStatus: string) => void
}

export default function LeadDrawer({ lead, onClose, onStatusChange }: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'labels'>('notes')
  const [notes, setNotes] = useState<LeadNote[]>([])
  const [tasks, setTasks] = useState<LeadTask[]>([])
  const [labels, setLabels] = useState<LeadLabel[]>([])
  const [loading, setLoading] = useState(false)
  const [crmStatus, setCrmStatus] = useState<string>('pendiente')
  const [crmUpdating, setCrmUpdating] = useState(false)
  const [showCrmDropdown, setShowCrmDropdown] = useState(false)

  // Form states
  const [newNote, setNewNote] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [agentId, setAgentId] = useState<string | null>(null)
  const [agentInfo, setAgentInfo] = useState<{ name: string; email: string } | null>(null)

  const supabase = createAuthClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null
      setAgentId(uid)
      if (uid) {
        const { data: ag } = await supabase.from('agents').select('name, email').eq('id', uid).single()
        if (ag) setAgentInfo(ag as { name: string; email: string })
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!lead) return
    setCrmStatus(lead.crm_status ?? 'pendiente')
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead])

  const loadData = async () => {
    if (!lead) return
    setLoading(true)
    const [notesRes, tasksRes, labelsRes] = await Promise.all([
      supabase.from('lead_notes').select('*, agents(name)').eq('lead_id', lead.id).order('created_at', { ascending: false }),
      supabase.from('lead_tasks').select('*').eq('lead_id', lead.id).order('due_date', { ascending: true }),
      supabase.from('lead_labels').select('*').eq('lead_id', lead.id).order('created_at', { ascending: true }),
    ])
    setNotes(notesRes.data?.map(n => ({ ...n, agent_name: n.agents?.name })) || [])
    setTasks(tasksRes.data || [])
    setLabels(labelsRes.data || [])
    setLoading(false)
  }

  // ─── CRM Status ──────────────────────────────────────────────────────────────
  const updateCrmStatus = async (newStatus: string) => {
    if (!lead) return
    setCrmUpdating(true)
    setShowCrmDropdown(false)
    await supabase.from('conversations').update({ crm_status: newStatus }).eq('id', lead.id)
    setCrmStatus(newStatus)
    onStatusChange?.(lead.id, newStatus)
    setCrmUpdating(false)
  }

  // ─── Notes ───────────────────────────────────────────────────────────────────
  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim() || !lead || !agentId) return
    const { data } = await supabase.from('lead_notes').insert({
      lead_id: lead.id, agent_id: agentId, content: newNote.trim()
    }).select('*, agents(name)').single()
    if (data) { setNotes([{ ...data, agent_name: data.agents?.name }, ...notes]); setNewNote('') }
  }

  // ─── Tasks ───────────────────────────────────────────────────────────────────
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !lead || !agentId) return
    const { data } = await supabase.from('lead_tasks').insert({
      lead_id: lead.id, agent_id: agentId,
      title: newTaskTitle.trim(), due_date: newTaskDate || null
    }).select().single()
    if (data) {
      setTasks([...tasks, data].sort((a, b) => new Date(a.due_date || '9999').getTime() - new Date(b.due_date || '9999').getTime()))
      setNewTaskTitle(''); setNewTaskDate('')
      // Fire-and-forget email notification
      fetch('/api/leads/task-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, taskTitle: newTaskTitle.trim(), taskDueDate: newTaskDate || null }),
      }).catch(() => {})
    }
  }

  const toggleTask = async (task: LeadTask) => {
    const { data } = await supabase.from('lead_tasks').update({ completed: !task.completed }).eq('id', task.id).select().single()
    if (data) setTasks(tasks.map(t => t.id === task.id ? data : t))
  }

  // ─── Labels (predefined toggle) ───────────────────────────────────────────────
  const toggleLabel = async (preset: typeof PRESET_LABELS[0]) => {
    if (!lead) return
    const existing = labels.find(l => l.label === preset.label)
    if (existing) {
      await supabase.from('lead_labels').delete().eq('id', existing.id)
      setLabels(labels.filter(l => l.id !== existing.id))
    } else {
      const { data } = await supabase.from('lead_labels').insert({
        lead_id: lead.id,
        label: preset.label,
        color: `${preset.bg}|${preset.color}`,
      }).select().single()
      if (data) setLabels([...labels, data])
    }
  }

  const crmCfg = CRM_STATUSES.find(s => s.value === crmStatus) ?? CRM_STATUSES[0]

  return (
    <>
      {lead && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l transform transition-transform duration-300 ease-in-out ${lead ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderColor: '#E2E8F0' }}
      >
        {lead && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold truncate" style={{ color: '#18224C' }}>{lead.visitor_name || 'Sin Nombre'}</h2>
                  <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{lead.visitor_email || lead.visitor_phone || 'Sin contacto'}</p>
                </div>
                <button onClick={onClose} className="p-2 ml-3 rounded-xl hover:bg-white border shadow-sm shrink-0" style={{ color: '#64748B', borderColor: '#E2E8F0' }}>
                  <X size={18} />
                </button>
              </div>

              {/* CRM Status Selector */}
              <div className="relative mt-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#94A3B8' }}>Estado CRM</p>
                <button
                  onClick={() => setShowCrmDropdown(v => !v)}
                  disabled={crmUpdating}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
                  style={{ backgroundColor: crmCfg.bg, color: crmCfg.color, borderColor: `${crmCfg.color}40` }}
                >
                  {crmUpdating ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
                  {crmCfg.label}
                  <ChevronDown size={13} className="ml-auto opacity-60" />
                </button>
                {showCrmDropdown && (
                  <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-xl shadow-xl border py-1 min-w-[200px]" style={{ borderColor: '#E2E8F0' }}>
                    {CRM_STATUSES.map(s => (
                      <button key={s.value} onClick={() => updateCrmStatus(s.value)}
                        className="w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 hover:bg-gray-50">
                        <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                        {s.value === crmStatus && <Check size={12} className="ml-auto" style={{ color: s.color }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Labels shown in header */}
              {labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {labels.map(l => {
                    const [bg, t] = l.color.split('|')
                    return <span key={l.id} className="px-2 py-0.5 text-[11px] font-semibold rounded-md" style={{ backgroundColor: bg, color: t }}>{l.label}</span>
                  })}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: '#E2E8F0' }}>
              {([
                { key: 'notes', icon: MessageSquare, label: 'Notas' },
                { key: 'tasks', icon: CheckSquare, label: 'Tareas' },
                { key: 'labels', icon: Tag, label: 'Etiquetas' },
              ] as const).map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${activeTab === key ? 'border-[#00D0FF] text-[#18224C]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5" style={{ backgroundColor: '#F8FAFC' }}>
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#00D0FF] border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <>
                  {/* ─── NOTES ─── */}
                  {activeTab === 'notes' && (
                    <div className="flex flex-col gap-4">
                      <form onSubmit={addNote} className="bg-white p-4 rounded-xl border flex flex-col gap-3" style={{ borderColor: '#E2E8F0' }}>
                        <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3}
                          placeholder="Escribe una nota interna..." className="w-full text-sm outline-none resize-none" style={{ color: '#18224C' }} />
                        <div className="flex justify-end">
                          <button type="submit" disabled={!newNote.trim()}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#18224C' }}>
                            <Plus size={13} /> Guardar nota
                          </button>
                        </div>
                      </form>
                      <div className="flex flex-col gap-3">
                        {notes.length === 0 && <p className="text-center text-xs text-slate-400 py-4">No hay notas registradas.</p>}
                        {notes.map(note => (
                          <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold" style={{ color: '#18224C' }}>{note.agent_name || 'Agente'}</span>
                              <span className="text-[10px]" style={{ color: '#94A3B8' }}>{new Date(note.created_at).toLocaleString('es-CO')}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap" style={{ color: '#334155' }}>{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ─── TASKS ─── */}
                  {activeTab === 'tasks' && (
                    <div className="flex flex-col gap-4">
                      <form onSubmit={addTask} className="bg-white p-4 rounded-xl border flex flex-col gap-3" style={{ borderColor: '#E2E8F0' }}>
                        <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                          placeholder="Título de la tarea (ej: Llamar mañana)" className="w-full text-sm outline-none font-medium" style={{ color: '#18224C' }} />
                        <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: '#F1F5F9' }}>
                          <input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)}
                            className="text-xs p-1.5 border rounded-lg outline-none" style={{ borderColor: '#E2E8F0', color: '#64748B' }} />
                          <button type="submit" disabled={!newTaskTitle.trim()}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 hover:bg-gray-50"
                            style={{ color: '#18224C', borderColor: '#E2E8F0' }}>
                            <Plus size={13} /> Añadir tarea
                          </button>
                        </div>
                        {agentInfo && (
                          <p className="text-[10px] text-slate-400">
                            📧 Se notificará a: {agentInfo.name}{lead.visitor_email ? ` + ${lead.visitor_name ?? 'cliente'}` : ''} + admins
                          </p>
                        )}
                      </form>
                      <div className="flex flex-col gap-2">
                        {tasks.length === 0 && <p className="text-center text-xs text-slate-400 py-4">Sin tareas pendientes.</p>}
                        {tasks.map(task => {
                          const lim = task.due_date ? new Date(task.due_date) : null
                          const expired = lim && lim < new Date() && lim.toDateString() !== new Date().toDateString()
                          const today = lim && lim.toDateString() === new Date().toDateString()
                          return (
                            <div key={task.id} className={`bg-white p-3 rounded-xl border flex gap-3 ${task.completed ? 'opacity-50' : ''}`} style={{ borderColor: '#E2E8F0' }}>
                              <button onClick={() => toggleTask(task)}
                                className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-slate-400'}`}>
                                <Check size={13} />
                              </button>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`} style={{ color: '#18224C' }}>{task.title}</p>
                                {task.due_date && (
                                  <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-md font-semibold mt-1 ${task.completed ? 'bg-slate-100 text-slate-500' : expired ? 'bg-red-100 text-red-700' : today ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                    📅 {lim?.toLocaleDateString('es-CO')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* ─── LABELS (predefined toggle) ─── */}
                  {activeTab === 'labels' && (
                    <div className="flex flex-col gap-4">
                      <div className="bg-white p-4 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                        <p className="text-xs font-semibold text-slate-500 mb-3">Selecciona etiquetas para este lead</p>
                        <div className="flex flex-col gap-2">
                          {PRESET_LABELS.map(preset => {
                            const active = labels.some(l => l.label === preset.label)
                            return (
                              <button key={preset.label} onClick={() => toggleLabel(preset)}
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all hover:shadow-sm"
                                style={{
                                  backgroundColor: active ? preset.bg : 'white',
                                  color: active ? preset.color : '#64748B',
                                  borderColor: active ? `${preset.color}60` : '#E2E8F0',
                                }}>
                                {preset.label}
                                {active && <Check size={14} />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
