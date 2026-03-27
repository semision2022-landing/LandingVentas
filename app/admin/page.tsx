'use client'

import { useEffect, useState } from 'react'
import { createAuthClient } from '@/lib/supabase-auth'
import MetricCard from '@/components/admin/dashboard/MetricCard'
import ConversationsChart from '@/components/admin/dashboard/ConversationsChart'
import { MessageSquare, Users, Clock, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react'
import type { Conversation } from '@/types/admin'

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)
}

function formatTime(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  bot:           { label: '🤖 Bot', color: '#18224C', bg: '#EEF2FF' },
  waiting_agent: { label: '⏳ Esperando', color: '#EA580C', bg: '#FFF7ED' },
  with_agent:    { label: '🟢 Con agente', color: '#579601', bg: '#F0FDF4' },
  closed:        { label: '⚫ Cerrada', color: '#64748B', bg: '#F8FAFC' },
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [metrics, setMetrics] = useState({
    conversationsToday: 0,
    leadsToday: 0,
    waitingCount: 0,
    conversationsMonth: 0,
    salesToday: 0,
    revenueMonth: 0,
  })
  const [chartData, setChartData] = useState<{ date: string; conversations: number; sales: number }[]>([])

  useEffect(() => {
    const supabase = createAuthClient()

    const loadData = async () => {
      const today = new Date().toISOString().split('T')[0]
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

      const [
        { count: convToday },
        { count: leadsToday },
        { count: waiting },
        { count: convMonth },
        { data: recentConv },
        { count: salesToday },
        { data: salesData },
      ] = await Promise.all([
        supabase.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('conversations').select('*', { count: 'exact', head: true })
          .gte('created_at', today).not('visitor_email', 'is', null),
        supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'waiting_agent'),
        supabase.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
        supabase.from('conversations').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('sales').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('sales').select('plan_price').gte('created_at', monthStart).eq('status', 'completed'),
      ])

      const revenueMonth = (salesData ?? []).reduce((acc, s) => acc + (s.plan_price ?? 0), 0)

      setMetrics({
        conversationsToday: convToday ?? 0,
        leadsToday: leadsToday ?? 0,
        waitingCount: waiting ?? 0,
        conversationsMonth: convMonth ?? 0,
        salesToday: salesToday ?? 0,
        revenueMonth,
      })
      setConversations((recentConv ?? []) as Conversation[])

      // Chart: last 7 days
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d.toISOString().split('T')[0]
      })

      const chartRows = await Promise.all(days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const [{ count: c }, { count: s }] = await Promise.all([
          supabase.from('conversations').select('*', { count: 'exact', head: true })
            .gte('created_at', day).lt('created_at', nextDay.toISOString().split('T')[0]),
          supabase.from('sales').select('*', { count: 'exact', head: true })
            .gte('created_at', day).lt('created_at', nextDay.toISOString().split('T')[0]),
        ])
        return {
          date: new Date(day).toLocaleDateString('es-CO', { weekday: 'short', day: '2-digit' }),
          conversations: c ?? 0,
          sales: s ?? 0,
        }
      }))

      setChartData(chartRows)
      setLoading(false)
    }

    loadData()

    // Realtime updates
    const channel = supabase.channel('dashboard-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, loadData)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse" style={{ border: '1px solid #E2E8F0' }} />
          ))}
        </div>
      </div>
    )
  }

  const metricCards = [
    { label: 'Conversaciones hoy', value: metrics.conversationsToday, icon: <MessageSquare size={18} />, color: '#18224C', bgColor: '#EEF2FF' },
    { label: 'Leads hoy', value: metrics.leadsToday, icon: <Users size={18} />, color: '#5F4EDA', bgColor: '#F5F3FF' },
    { label: 'Esperando agente', value: metrics.waitingCount, icon: <Clock size={18} />, color: '#EA580C', bgColor: '#FFF7ED', alert: metrics.waitingCount > 0 },
    { label: 'Conversaciones mes', value: metrics.conversationsMonth, icon: <TrendingUp size={18} />, color: '#579601', bgColor: '#F0FDF4' },
    { label: 'Ventas hoy', value: metrics.salesToday, icon: <ShoppingBag size={18} />, color: '#00D0FF', bgColor: '#ECFEFF' },
    { label: 'Ingresos del mes', value: formatCOP(metrics.revenueMonth), icon: <DollarSign size={18} />, color: '#18224C', bgColor: '#F0FDF4' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metricCards.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ConversationsChart data={chartData} />
      </div>

      {/* Recent conversations */}
      <div className="bg-white rounded-2xl" style={{ border: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#18224C' }}>Últimas conversaciones</h3>
          <a href="/admin/conversations" className="text-xs font-medium hover:underline" style={{ color: '#00D0FF' }}>
            Ver todas →
          </a>
        </div>
        <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
          {conversations.length === 0 && (
            <p className="px-6 py-8 text-sm text-center" style={{ color: '#94A3B8' }}>No hay conversaciones aún</p>
          )}
          {conversations.map((conv) => {
            const cfg = STATUS_CONFIG[conv.status] ?? STATUS_CONFIG.bot
            return (
              <a
                key={conv.id}
                href={`/admin/conversations?id=${conv.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {(conv.visitor_name ?? 'V').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#18224C' }}>
                    {conv.visitor_name ?? 'Visitante'}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#94A3B8' }}>
                    {conv.last_message ?? 'Sin mensajes'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                    {formatTime(conv.created_at)}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
