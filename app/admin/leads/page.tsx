'use client'

import { useEffect, useState, useMemo } from 'react'
import { createAuthClient } from '@/lib/supabase-auth'
import { Search, Download, ExternalLink, MessageSquare, Filter, Plus, Eye } from 'lucide-react'
import type { Conversation } from '@/types/admin'
import AddLeadModal from '@/components/admin/leads/AddLeadModal'
import LeadDrawer from '@/components/admin/leads/LeadDrawer'

type Period = 'all' | 'today' | 'week' | 'month'

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  bot:           { label: '🤖 Bot', color: '#18224C', bg: '#EEF2FF' },
  waiting_agent: { label: '⏳ Esperando', color: '#EA580C', bg: '#FFF7ED' },
  with_agent:    { label: '🟢 Con agente', color: '#579601', bg: '#F0FDF4' },
  closed:        { label: '⚫ Cerrada', color: '#64748B', bg: '#F8FAFC' },
}

const PAGE_SIZE = 20

export default function LeadsPage() {
  const [leads, setLeads] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<Period>('all')
  const [planFilter, setPlanFilter] = useState('')
  const [page, setPage] = useState(0)
  const [sortKey, setSortKey] = useState<'created_at' | 'visitor_name' | 'plan_interest'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Conversation | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const supabase = createAuthClient()
    const load = async () => {
      setLoading(true)
      let q = supabase
        .from('conversations')
        .select('*, agents!assigned_to(name)')
        .or('visitor_email.not.is.null,visitor_phone.not.is.null,visitor_name.not.is.null,lead_source_type.eq.manual')
        .order(sortKey, { ascending: sortDir === 'asc' })

      const now = new Date()
      if (period === 'today') {
        q = q.gte('created_at', now.toISOString().split('T')[0])
      } else if (period === 'week') {
        const d = new Date(now); d.setDate(d.getDate() - 7)
        q = q.gte('created_at', d.toISOString())
      } else if (period === 'month') {
        const d = new Date(now.getFullYear(), now.getMonth(), 1)
        q = q.gte('created_at', d.toISOString())
      }

      const { data } = await q
      const mapped = (data ?? []).map((row: Record<string, unknown> & { agents?: { name: string } | null }) => ({
        ...row,
        agent_name: row.agents?.name ?? row.assigned_agent ?? null,
      }))
      setLeads(mapped as Conversation[])
      setLoading(false)
    }
    load()
  }, [period, sortKey, sortDir, refreshTrigger])

  const plans = useMemo(() => {
    const set = new Set(leads.map((l) => l.plan_interest).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [leads])

  const filtered = useMemo(() => leads.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch = !q || [l.visitor_name, l.visitor_email, l.visitor_phone].some((f) => f?.toLowerCase().includes(q))
    const matchPlan = !planFilter || l.plan_interest === planFilter
    return matchSearch && matchPlan
  }), [leads, search, planFilter])

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const exportCSV = () => {
    const header = ['Nombre', 'Email', 'Teléfono', 'Plan', 'Asesor', 'Atendido', 'Fuente', 'Fecha'].join(',')
    const rows = filtered.map((l) =>
      [l.visitor_name ?? '', l.visitor_email ?? '', l.visitor_phone ?? '',
       l.plan_interest ?? '', (l as Conversation).agent_name ?? l.assigned_agent ?? '',
       l.attended ? 'Sí' : 'No', l.lead_source ?? '',
       formatDate(l.created_at)].map((v) => `"${v}"`).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `leads-emision-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const SortIndicator = ({ k }: { k: string }) =>
    sortKey === k ? <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span> : null

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none"
            style={{ borderColor: '#E2E8F0', color: '#18224C' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: '#579601', color: 'white' }}>
            <Plus size={13} /> Agregar manual
          </button>
          {/* Period filter */}
          {(['all', 'today', 'week', 'month'] as Period[]).map((p) => (
            <button key={p} onClick={() => { setPeriod(p); setPage(0) }}
              className="text-xs px-3 py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: period === p ? '#18224C' : '#F8FAFC', color: period === p ? 'white' : '#64748B', border: '1px solid #E2E8F0' }}>
              {{ all: 'Todo', today: 'Hoy', week: 'Esta semana', month: 'Este mes' }[p]}
            </button>
          ))}

          {/* Plan filter */}
          {plans.length > 0 && (
            <div className="relative">
              <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
              <select
                value={planFilter}
                onChange={(e) => { setPlanFilter(e.target.value); setPage(0) }}
                className="pl-7 pr-3 py-2 rounded-lg text-xs border outline-none appearance-none"
                style={{ borderColor: '#E2E8F0', color: '#18224C', backgroundColor: 'white' }}
              >
                <option value="">Todos los planes</option>
                {plans.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          <button onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: '#18224C', color: 'white' }}>
            <Download size={13} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
        {filtered.length} lead{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {[
                  { label: 'Nombre', key: 'visitor_name' as const },
                  { label: 'Email', key: null },
                  { label: 'Teléfono', key: null },
                  { label: 'Plan', key: 'plan_interest' as const },
                  { label: 'Asesor asignado', key: null },
                  { label: 'Estado', key: null },
                  { label: 'Fuente', key: null },
                  { label: 'Fecha', key: 'created_at' as const },
                  { label: 'Acciones', key: null },
                ].map((col) => (
                  <th key={col.label}
                    onClick={() => col.key && handleSort(col.key)}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${col.key ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    style={{ color: '#64748B' }}>
                    {col.label}
                    {col.key && <SortIndicator k={col.key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#F1F5F9' }}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: `${50 + Math.random() * 50}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#94A3B8' }}>
                  No hay leads con esos filtros
                </td></tr>
              )}
              {!loading && paginated.map((lead) => {
                const cfg = STATUS_CFG[lead.status] ?? STATUS_CFG.bot
                return (
                  <tr key={lead.id} className="border-b transition-colors hover:bg-gray-50" style={{ borderColor: '#F1F5F9' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#18224C' }}>
                      {lead.visitor_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                      {lead.visitor_email ? (
                        <a href={`mailto:${lead.visitor_email}`} className="hover:underline">{lead.visitor_email}</a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                      {lead.visitor_phone ? (
                        <a href={`https://wa.me/57${lead.visitor_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="hover:underline">{lead.visitor_phone}</a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                      {lead.plan_interest ?? '—'}
                    </td>
                    {/* Asesor asignado */}
                    <td className="px-4 py-3 text-xs" style={{ color: '#18224C' }}>
                      {(lead as Conversation).agent_name ?? lead.assigned_agent ?? (
                        <span style={{ color: '#94A3B8' }}>Sin asignar</span>
                      )}
                    </td>
                    {/* Estado / Atendido */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: lead.attended ? '#F0FDF4' : '#FFF7ED', color: lead.attended ? '#579601' : '#EA580C' }}>
                          {lead.attended ? '✅ Atendido' : '⏳ Pendiente'}
                        </span>
                      </div>
                    </td>
                    {/* Fuente */}
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                      {lead.lead_source_type === 'manual' ? '✍️ Manual' : lead.lead_source === 'chatbot' ? '🤖 Chat' : lead.lead_source === 'whatsapp' ? '💬 WhatsApp' : '🌐 Landing'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedLead(lead)} title="Ver detalles"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                          style={{ color: '#18224C' }}>
                          <Eye size={13} />
                        </button>
                        <a href={`/admin/conversations?id=${lead.id}`} title="Ver chat"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                          style={{ color: '#18224C' }}>
                          <MessageSquare size={13} />
                        </a>
                        {lead.visitor_phone && (
                          <a href={`https://wa.me/57${lead.visitor_phone.replace(/\D/g, '')}`}
                            target="_blank" rel="noopener noreferrer" title="WhatsApp"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-green-50"
                            style={{ color: '#579601' }}>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              Página {page + 1} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-40 transition-all"
                style={{ border: '1px solid #E2E8F0', color: '#18224C' }}>
                ← Anterior
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-40 transition-all"
                style={{ border: '1px solid #E2E8F0', color: '#18224C' }}>
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      <AddLeadModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => { setAddModalOpen(false); setRefreshTrigger(t => t + 1) }}
      />
      <LeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  )
}
