'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createAuthClient } from '@/lib/supabase-auth'
import KPICard from '@/components/analytics/KPICard'
import SpendChart from '@/components/analytics/SpendChart'
import ClicksImpressionsChart from '@/components/analytics/ClicksImpressionsChart'
import CTRChart from '@/components/analytics/CTRChart'
import SpendDistributionChart from '@/components/analytics/SpendDistributionChart'
import CampaignsTable from '@/components/analytics/CampaignsTable'
import AlertsPanel from '@/components/analytics/AlertsPanel'
import SyncStatus from '@/components/analytics/SyncStatus'
import DateRangePicker, { type Preset } from '@/components/analytics/DateRangePicker'
import {
  DollarSign, Eye, MousePointer, BarChart2, TrendingUp, Radio, Users, RefreshCw,
} from 'lucide-react'
import { formatCOP, formatNumber, formatPct } from '@/lib/meta-formatters'

interface Campaign {
  campaign_id: string
  campaign_name: string
  status: string
  objective: string
  spend: number
  reach: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  frequency: number
  conversions: number
  cost_per_conversion: number
  date_stop: string | null
}

interface Adset {
  campaign_id: string
  adset_id: string
  adset_name: string
  status: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  reach: number
}

interface DailyInsight {
  date_start: string
  spend: number
  impressions: number
  clicks: number
  reach: number
  ctr: number
  cpc: number
}

interface SyncLog {
  synced_at: string
  status: string
}

// ─── Date range helpers ────────────────────────────────────────────────────────
function getDateRange(preset: Preset): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (preset) {
    case 'today':
      return { start: today, end: today }
    case 'yesterday': {
      const y = new Date(today); y.setDate(y.getDate() - 1)
      return { start: y, end: y }
    }
    case 'last_7d': {
      const s = new Date(today); s.setDate(s.getDate() - 6)
      return { start: s, end: today }
    }
    case 'this_month':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: today }
    case 'last_30d':
    default: {
      const s = new Date(today); s.setDate(s.getDate() - 29)
      return { start: s, end: today }
    }
  }
}

function inRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr)
  const local = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return local >= start && local <= end
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 ${className ?? ''}`} />
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [adsets, setAdsets]       = useState<Adset[]>([])
  const [daily, setDaily]         = useState<DailyInsight[]>([])
  const [syncLog, setSyncLog]     = useState<SyncLog | null>(null)
  const [loading, setLoading]     = useState(true)
  const [syncing, setSyncing]     = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [datePreset, setDatePreset] = useState<Preset>('last_30d')
  const [campaignFilter, setCampaignFilter] = useState('ALL')

  // ── Load all data from Supabase cache ─────────────────────────────────────
  const fetchData = useCallback(async () => {
    const supabase = createAuthClient()
    const [camps, ads, dailyData, log] = await Promise.all([
      supabase.from('meta_campaigns_cache').select('*').order('spend', { ascending: false }),
      supabase.from('meta_adsets_cache').select('*'),
      supabase.from('meta_daily_insights').select('*').order('date_start', { ascending: true }).limit(120),
      supabase.from('meta_sync_log').select('*').order('synced_at', { ascending: false }).limit(1).single(),
    ])
    setCampaigns((camps.data ?? []) as Campaign[])
    setAdsets((ads.data ?? []) as Adset[])
    setDaily((dailyData.data ?? []) as DailyInsight[])
    setSyncLog(log.data as SyncLog | null)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Sync handler ───────────────────────────────────────────────────────────
  const handleSync = async () => {
    setSyncing(true)
    setSyncError(null)
    const supabase = createAuthClient()
    const { data: { session } } = await supabase.auth.getSession()
    try {
      const res = await fetch('/api/meta/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      const body = await res.json()
      if (!res.ok) setSyncError(body?.error ?? `Error ${res.status}`)
      await fetchData()
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setSyncing(false)
    }
  }

  // ── Date-filtered daily insights ───────────────────────────────────────────
  const { start: rangeStart, end: rangeEnd } = useMemo(() => getDateRange(datePreset), [datePreset])

  const filteredDaily = useMemo(
    () => daily.filter((d) => inRange(d.date_start, rangeStart, rangeEnd)),
    [daily, rangeStart, rangeEnd]
  )

  // ── KPI aggregates from filtered DAILY data ────────────────────────────────
  const totalSpend       = filteredDaily.reduce((s, d) => s + (d.spend ?? 0), 0)
  const totalImpressions = filteredDaily.reduce((s, d) => s + (d.impressions ?? 0), 0)
  const totalClicks      = filteredDaily.reduce((s, d) => s + (d.clicks ?? 0), 0)
  const totalReach       = filteredDaily.reduce((s, d) => s + (d.reach ?? 0), 0)
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0
  const avgCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0

  // ── Campaign filter (applied on top of date range) ─────────────────────────
  const filteredCampaigns = campaignFilter === 'ALL'
    ? campaigns
    : campaigns.filter((c) => c.campaign_id === campaignFilter)

  // Frequency from campaigns (campaign-level cache, best approximation)
  const avgFreq = filteredCampaigns.length > 0
    ? filteredCampaigns.reduce((s, c) => s + (c.frequency ?? 0), 0) /
      (filteredCampaigns.filter((c) => c.frequency > 0).length || 1)
    : 0

  // ── Days count label ───────────────────────────────────────────────────────
  const daysLabel = filteredDaily.length === 1 ? '1 día' : `${filteredDaily.length} días`

  const kpis = [
    { label: 'Inversión total', value: formatCOP(totalSpend), icon: <DollarSign size={18} />, color: '#18224C' },
    { label: 'Impresiones', value: formatNumber(totalImpressions), icon: <Eye size={18} />, color: '#00D0FF' },
    { label: 'Clics', value: formatNumber(totalClicks), icon: <MousePointer size={18} />, color: '#5F4EDA' },
    {
      label: 'CTR', value: formatPct(avgCTR), icon: <BarChart2 size={18} />,
      benchmark: '>2% es bueno', color: avgCTR >= 2 ? '#579601' : '#F97316',
      alert: avgCTR < 1 && totalImpressions > 500,
    },
    {
      label: 'CPC', value: formatCOP(avgCPC), icon: <TrendingUp size={18} />,
      benchmark: '<$500 es bueno', color: avgCPC <= 500 ? '#579601' : avgCPC <= 2000 ? '#F97316' : '#EF4444',
      alert: avgCPC > 2000 && totalClicks > 0,
    },
    { label: 'CPM', value: formatCOP(avgCPM), icon: <Radio size={18} />, color: '#8B5CF6' },
    { label: 'Alcance', value: formatNumber(totalReach), icon: <Users size={18} />, color: '#0EA5E9' },
    {
      label: 'Frecuencia', value: `${avgFreq.toFixed(1)}x`, icon: <RefreshCw size={18} />,
      benchmark: '>3 = saturación', color: avgFreq > 3 ? '#EF4444' : '#18224C', alert: avgFreq > 3,
    },
  ]

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8">

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#18224C' }}>
            📈 Métricas de Campañas
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
            Meta Ads · {filteredDaily.length > 0 ? `${daysLabel} · ${rangeStart.toLocaleDateString('es-CO')} – ${rangeEnd.toLocaleDateString('es-CO')}` : 'Sin datos para el período'}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-start md:items-end">
          <SyncStatus
            lastSync={syncLog?.synced_at ?? null}
            status={syncing ? 'loading' : syncLog?.status === 'success' ? 'success' : syncLog?.status === 'error' ? 'error' : 'idle'}
            tokenDaysLeft={null}
            onSync={handleSync}
            syncing={syncing}
          />
          <DateRangePicker value={datePreset} onChange={setDatePreset} />
        </div>
      </div>

      {/* ─── Sync error ──────────────────────────────────────────────────────── */}
      {syncError && (
        <div className="rounded-xl px-4 py-3 text-sm flex items-start gap-3"
          style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
          <span className="shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="font-bold">Error al sincronizar con Meta Ads</p>
            <p className="text-xs mt-0.5 font-mono opacity-80">{syncError}</p>
            <p className="text-xs mt-1.5 opacity-70">
              Verifica las variables de entorno en Vercel y que el SQL esté ejecutado en Supabase.
            </p>
          </div>
        </div>
      )}

      {/* ─── No-data-for-period notice ───────────────────────────────────────── */}
      {!loading && daily.length > 0 && filteredDaily.length === 0 && (
        <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
          style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706' }}>
          <span>📅</span>
          <p>No hay datos disponibles para el período seleccionado. Los datos en caché cubren del <strong>{daily[0]?.date_start}</strong> al <strong>{daily[daily.length - 1]?.date_start}</strong>. Haz clic en <strong>Sincronizar ahora</strong> para actualizar.</p>
        </div>
      )}

      {/* ─── Campaign filter ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-xs font-semibold" style={{ color: '#64748B' }}>Campaña:</label>
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border outline-none"
          style={{ borderColor: '#E2E8F0', color: '#18224C' }}
        >
          <option value="ALL">Todas las campañas</option>
          {campaigns.map((c) => (
            <option key={c.campaign_id} value={c.campaign_id}>{c.campaign_name}</option>
          ))}
        </select>
        <span className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
          {daysLabel} · {formatCOP(totalSpend)} invertidos
        </span>
      </div>

      {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KPICard
              key={k.label}
              label={k.label}
              value={k.value}
              icon={k.icon}
              color={k.color}
              benchmark={k.benchmark}
              alert={k.alert}
            />
          ))}
        </div>
      )}

      {/* ─── Charts ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SpendChart data={filteredDaily} />
          <ClicksImpressionsChart data={filteredDaily} />
          <CTRChart data={filteredDaily} />
          <SpendDistributionChart campaigns={filteredCampaigns} />
        </div>
      )}

      {/* ─── Alerts ─────────────────────────────────────────────────────────── */}
      {!loading && (
        <AlertsPanel campaigns={filteredCampaigns.map((c) => ({ ...c }))} />
      )}

      {/* ─── Campaigns Table ─────────────────────────────────────────────────── */}
      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <>
          <CampaignsTable campaigns={filteredCampaigns} adsets={adsets} />
          <p className="text-xs text-center" style={{ color: '#94A3B8' }}>
            * La tabla de campañas muestra datos del último período sincronizado. Los KPIs y gráficos ya reflejan el período seleccionado.
          </p>
        </>
      )}

      {/* ─── Empty state ──────────────────────────────────────────────────────── */}
      {!loading && campaigns.length === 0 && (
        <div className="text-center py-20 rounded-2xl bg-white" style={{ border: '1px solid #E2E8F0' }}>
          <p className="text-4xl mb-4">📊</p>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#18224C' }}>Sin datos todavía</h3>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>
            Haz clic en <strong>Sincronizar ahora</strong> para traer las campañas de Meta Ads.
          </p>
          <button
            onClick={handleSync}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: '#18224C' }}
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Sincronizando…' : 'Sincronizar ahora'}
          </button>
        </div>
      )}

    </div>
  )
}
