'use client'

import { useEffect, useState, useMemo } from 'react'
import { createAuthClient } from '@/lib/supabase-auth'
import { Search, Download, TrendingUp, ShoppingBag, DollarSign, Award } from 'lucide-react'
import type { Sale } from '@/types/admin'

type Period = 'all' | 'today' | 'week' | 'month'

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)
}

const PAGE_SIZE = 20

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<Period>('month')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const supabase = createAuthClient()
    const load = async () => {
      setLoading(true)
      let q = supabase.from('sales').select('*').eq('status', 'completed').order('created_at', { ascending: false })
      const now = new Date()
      if (period === 'today') q = q.gte('created_at', now.toISOString().split('T')[0])
      else if (period === 'week') { const d = new Date(now); d.setDate(d.getDate() - 7); q = q.gte('created_at', d.toISOString()) }
      else if (period === 'month') { const d = new Date(now.getFullYear(), now.getMonth(), 1); q = q.gte('created_at', d.toISOString()) }
      const { data } = await q
      setSales((data ?? []) as Sale[])
      setLoading(false)
    }
    load()

    const supabase2 = createAuthClient()
    const channel = supabase2.channel('sales-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sales' }, () => load())
      .subscribe()
    return () => { supabase2.removeChannel(channel) }
  }, [period])

  const filtered = useMemo(() => sales.filter((s) => {
    const q = search.toLowerCase()
    return !q || [s.customer_name, s.customer_email, s.plan_name].some((f) => f?.toLowerCase().includes(q))
  }), [sales, search])

  const totalRevenue = filtered.reduce((acc, s) => acc + (s.plan_price ?? 0), 0)
  const avgTicket = filtered.length > 0 ? totalRevenue / filtered.length : 0
  const topPlan = useMemo(() => {
    const counts: Record<string, number> = {}
    filtered.forEach((s) => { counts[s.plan_name] = (counts[s.plan_name] ?? 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  }, [filtered])

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const exportCSV = () => {
    const header = ['Orden', 'Plan', 'Precio', 'Cliente', 'Email', 'Teléfono', 'NIT', 'Método de pago', 'Fecha'].join(',')
    const rows = filtered.map((s) =>
      [s.order_id, s.plan_name, s.plan_price, s.customer_name, s.customer_email,
       s.customer_phone ?? '', s.customer_nit ?? '', s.payment_method ?? '', formatDate(s.created_at)]
        .map((v) => `"${v}"`).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `ventas-emision-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total ventas', value: String(filtered.length), icon: <ShoppingBag size={18} />, color: '#18224C', bg: '#EEF2FF' },
          { label: 'Ingresos totales', value: formatCOP(totalRevenue), icon: <DollarSign size={18} />, color: '#579601', bg: '#F0FDF4' },
          { label: 'Ticket promedio', value: formatCOP(avgTicket), icon: <TrendingUp size={18} />, color: '#5F4EDA', bg: '#F5F3FF' },
          { label: 'Plan más vendido', value: topPlan, icon: <Award size={18} />, color: '#00D0FF', bg: '#ECFEFF' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 flex flex-col gap-3" style={{ border: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: '#64748B' }}>{m.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.bg, color: m.color }}>{m.icon}</div>
            </div>
            <p className="text-xl font-extrabold truncate" style={{ color: '#18224C' }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Buscar por cliente, email o plan..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none"
            style={{ borderColor: '#E2E8F0', color: '#18224C' }} />
        </div>
        <div className="flex gap-2">
          {(['all', 'today', 'week', 'month'] as Period[]).map((p) => (
            <button key={p} onClick={() => { setPeriod(p); setPage(0) }}
              className="text-xs px-3 py-2 rounded-lg font-medium"
              style={{ backgroundColor: period === p ? '#18224C' : '#F8FAFC', color: period === p ? 'white' : '#64748B', border: '1px solid #E2E8F0' }}>
              {{ all: 'Todo', today: 'Hoy', week: 'Semana', month: 'Mes' }[p]}
            </button>
          ))}
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium hover:-translate-y-0.5 transition-all"
            style={{ backgroundColor: '#18224C', color: 'white' }}>
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Plan', 'Precio', 'Cliente', 'Email', 'NIT', 'Método', 'Fecha'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#64748B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#F1F5F9' }}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" /></td>
                  ))}
                </tr>
              ))}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#94A3B8' }}>
                  Sin ventas en este período
                </td></tr>
              )}
              {!loading && paginated.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F1F5F9' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#18224C' }}>{sale.plan_name}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#579601' }}>{formatCOP(sale.plan_price)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#334155' }}>{sale.customer_name}</td>
                  <td className="px-4 py-3 text-xs">
                    <a href={`mailto:${sale.customer_email}`} className="hover:underline" style={{ color: '#64748B' }}>
                      {sale.customer_email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94A3B8' }}>{sale.customer_nit ?? '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{sale.payment_method ?? '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94A3B8' }}>{formatDate(sale.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-xs" style={{ color: '#94A3B8' }}>Página {page + 1} de {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-40"
                style={{ border: '1px solid #E2E8F0', color: '#18224C' }}>← Anterior</button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-40"
                style={{ border: '1px solid #E2E8F0', color: '#18224C' }}>Siguiente →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
