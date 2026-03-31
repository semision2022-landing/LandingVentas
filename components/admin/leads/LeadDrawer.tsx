'use client'

import { useState, useEffect } from 'react'
import { X, CheckSquare, MessageSquare, Tag, Plus, Check } from 'lucide-react'
import { createAuthClient } from '@/lib/supabase-auth'
import type { Conversation, LeadNote, LeadTask, LeadLabel } from '@/types/admin'

const PRESET_COLORS = [
  { bg: '#DCFCE7', text: '#166534', name: 'Verde' },
  { bg: '#FEE2E2', text: '#991B1B', name: 'Rojo' },
  { bg: '#FEF9C3', text: '#854D0E', name: 'Amarillo' },
  { bg: '#DBEAFE', text: '#1E40AF', name: 'Azul' },
  { bg: '#F3F4F6', text: '#374151', name: 'Gris' },
]

interface Props {
  lead: Conversation | null
  onClose: () => void
}

export default function LeadDrawer({ lead, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'labels'>('notes')
  const [notes, setNotes] = useState<LeadNote[]>([])
  const [tasks, setTasks] = useState<LeadTask[]>([])
  const [labels, setLabels] = useState<LeadLabel[]>([])
  const [loading, setLoading] = useState(false)

  // Form states
  const [newNote, setNewNote] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [newLabelText, setNewLabelText] = useState('')
  const [newLabelColor, setNewLabelColor] = useState(PRESET_COLORS[0])
  
  const [agentId, setAgentId] = useState<string | null>(null)

  const supabase = createAuthClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAgentId(data.user?.id ?? null))
  }, [supabase.auth])

  useEffect(() => {
    if (!lead) return
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead])

  const loadData = async () => {
    if (!lead) return
    setLoading(true)
    
    // Parallel fetch
    const [notesRes, tasksRes, labelsRes] = await Promise.all([
      supabase.from('lead_notes').select('*, agents(name)').eq('lead_id', lead.id).order('created_at', { ascending: false }),
      supabase.from('lead_tasks').select('*').eq('lead_id', lead.id).order('due_date', { ascending: true }),
      supabase.from('lead_labels').select('*').eq('lead_id', lead.id).order('created_at', { ascending: true })
    ])

    setNotes(notesRes.data?.map(n => ({ ...n, agent_name: n.agents?.name })) || [])
    setTasks(tasksRes.data || [])
    setLabels(labelsRes.data || [])
    setLoading(false)
  }

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim() || !lead || !agentId) return
    const { data } = await supabase.from('lead_notes').insert({
      lead_id: lead.id,
      agent_id: agentId,
      content: newNote.trim()
    }).select('*, agents(name)').single()
    if (data) {
      setNotes([{ ...data, agent_name: data.agents?.name }, ...notes])
      setNewNote('')
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !lead || !agentId) return
    const { data } = await supabase.from('lead_tasks').insert({
      lead_id: lead.id,
      agent_id: agentId,
      title: newTaskTitle.trim(),
      due_date: newTaskDate || null
    }).select().single()
    if (data) {
      setTasks([...tasks, data].sort((a, b) => new Date(a.due_date||'9999').getTime() - new Date(b.due_date||'9999').getTime()))
      setNewTaskTitle(''); setNewTaskDate('')
    }
  }

  const toggleTask = async (task: LeadTask) => {
    const { data } = await supabase.from('lead_tasks').update({ completed: !task.completed }).eq('id', task.id).select().single()
    if (data) setTasks(tasks.map(t => t.id === task.id ? data : t))
  }

  const addLabel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabelText.trim() || !lead) return
    const { data } = await supabase.from('lead_labels').insert({
      lead_id: lead.id,
      label: newLabelText.trim(),
      color: newLabelColor.bg + '|' + newLabelColor.text
    }).select().single()
    if (data) {
      setLabels([...labels, data])
      setNewLabelText('')
    }
  }

  const removeLabel = async (id: string) => {
    await supabase.from('lead_labels').delete().eq('id', id)
    setLabels(labels.filter(l => l.id !== id))
  }

  return (
    <>
      {/* Backdrop */}
      {lead && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l transform transition-transform duration-300 ease-in-out ${lead ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderColor: '#E2E8F0' }}
      >
        {lead && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#18224C' }}>{lead.visitor_name || 'Sin Nombre'}</h2>
                  <p className="text-sm mt-1" style={{ color: '#64748B' }}>{lead.visitor_email || lead.visitor_phone || 'Sin contacto'}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl transition-colors hover:bg-white border shadow-sm" style={{ color: '#64748B', borderColor: '#E2E8F0' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Labels visualizados en el header */}
              {labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {labels.map(l => {
                    const [bg, t] = l.color.split('|')
                    return (
                      <span key={l.id} className="px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 group" style={{ backgroundColor: bg, color: t }}>
                        {l.label}
                        <button onClick={() => removeLabel(l.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: '#E2E8F0' }}>
              <button onClick={() => setActiveTab('notes')} className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'notes' ? 'border-[var(--cyan)] text-navydark' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <MessageSquare size={16} /> Notas
              </button>
              <button onClick={() => setActiveTab('tasks')} className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'tasks' ? 'border-[var(--cyan)] text-navydark' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <CheckSquare size={16} /> Tareas
              </button>
              <button onClick={() => setActiveTab('labels')} className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'labels' ? 'border-[var(--cyan)] text-navydark' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <Tag size={16} /> Etiquetas
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8FAFC' }}>
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <>
                  {/* TAB: NOTAS */}
                  {activeTab === 'notes' && (
                    <div className="flex flex-col gap-5">
                      <form onSubmit={addNote} className="bg-white p-4 rounded-xl border flex flex-col gap-3" style={{ borderColor: '#E2E8F0' }}>
                        <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3} placeholder="Escribe una nota interna..." className="w-full text-sm outline-none resize-none" style={{ color: '#18224C' }} />
                        <div className="flex justify-end">
                          <button type="submit" disabled={!newNote.trim()} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#18224C' }}>
                            <Plus size={14} /> Guardar nota
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

                  {/* TAB: TAREAS */}
                  {activeTab === 'tasks' && (
                    <div className="flex flex-col gap-5">
                      <form onSubmit={addTask} className="bg-white p-4 rounded-xl border flex flex-col gap-3" style={{ borderColor: '#E2E8F0' }}>
                        <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Título de la tarea (ej: Llamar mañana)" className="w-full text-sm outline-none font-medium" style={{ color: '#18224C' }} />
                        <div className="flex items-center justify-between mt-2 pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
                          <input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} className="text-xs p-1.5 border rounded-md outline-none text-slate-600" />
                          <button type="submit" disabled={!newTaskTitle.trim()} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-white border shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50" style={{ color: '#18224C', borderColor: '#E2E8F0' }}>
                            <Plus size={14} /> Añadir
                          </button>
                        </div>
                      </form>

                      <div className="flex flex-col gap-2">
                        {tasks.length === 0 && <p className="text-center text-xs text-slate-400 py-4">Sin tareas pendientes.</p>}
                        {tasks.map(task => {
                          const limitDate = task.due_date ? new Date(task.due_date) : null;
                          const isExpired = limitDate && limitDate < new Date() && limitDate.toDateString() !== new Date().toDateString();
                          const isToday = limitDate && limitDate.toDateString() === new Date().toDateString();

                          return (
                            <div key={task.id} className={`bg-white p-3 rounded-xl border flex gap-3 transition-opacity ${task.completed ? 'opacity-50' : 'opacity-100'}`} style={{ borderColor: '#E2E8F0' }}>
                              <button onClick={() => toggleTask(task)} className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-slate-400'}`}>
                                <Check size={14} />
                              </button>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`} style={{ color: '#18224C' }}>{task.title}</p>
                                {task.due_date && (
                                  <div className="flex mt-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${task.completed ? 'bg-slate-100 text-slate-500' : isExpired ? 'bg-red-100 text-red-700' : isToday ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                      📅 {limitDate?.toLocaleDateString('es-CO')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB: ETIQUETAS */}
                  {activeTab === 'labels' && (
                    <div className="flex flex-col gap-5">
                      <form onSubmit={addLabel} className="bg-white p-4 rounded-xl border flex flex-col gap-4" style={{ borderColor: '#E2E8F0' }}>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Nombre de la etiqueta</label>
                          <input value={newLabelText} onChange={e => setNewLabelText(e.target.value)} placeholder="Ej: VIP, En proceso..." className="w-full text-sm outline-none px-3 py-2 border rounded-lg" style={{ color: '#18224C' }} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-2 block">Color</label>
                          <div className="flex gap-2">
                            {PRESET_COLORS.map(c => (
                              <button key={c.name} type="button" onClick={() => setNewLabelColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${newLabelColor.name === c.name ? 'scale-110 shadow-md' : 'scale-100 border-transparent'}`} style={{ backgroundColor: c.bg, borderColor: newLabelColor.name === c.name ? c.text : 'transparent' }} title={c.name} />
                            ))}
                          </div>
                        </div>
                        <button type="submit" disabled={!newLabelText.trim()} className="mt-2 w-full py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#18224C' }}>
                          Agregar Etiqueta
                        </button>
                      </form>
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
