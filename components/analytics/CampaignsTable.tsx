'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronRight, Download } from 'lucide-react'
import { formatCOP, formatPct, formatNumber, statusColor, statusLabel, scoreMetric } from '@/lib/meta-formatters'
import AdsetsTable from './AdsetsTable'

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
  frequency: number
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

type SortKey = keyof Campaign
type SortDir = 'asc' | 'desc'

interface CampaignsTableProps {
  campaigns: Campaign[]
  adsets: Adset[]
}

const scoreColor = (s: 'good' | 'ok' | 'bad') =>
  s === 'good' ? '#16A34A' : s === 'ok' ? '#F97316' : '#EF4444'

function exportCSV(campaigns: Campaign[]) {
  const headers = ['Campaña', 'Estado', 'Inversión', 'Alcance', 'Impresiones', 'Clics', 'CTR', 'CPC']
  const rows = campaigns.map((c) => [
    c.campaign_name, c.status, c.spend, c.reach,
    c.impressions, c.clicks, c.ctr, c.cpc,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'campanas_meta.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function CampaignsTable({ campaigns, adsets }: CampaignsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('spend')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = campaigns
    .filter((c) => statusFilter === 'ALL' || c.status === statusFilter)
    .sort((a, b) => {
      const va = a[sortKey]; const vb = b[sortKey]
      if (typeof va === 'number' && typeof vb === 'number')
        return sortDir === 'asc' ? va - vb : vb - va
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va))
    })

  const HeaderCell = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold cursor-pointer select-none whitespace-nowrap"
      style={{ color: '#64748B' }}
      onClick={() => toggleSort(k)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === k ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
      </span>
    </th>
  )

  return (
    <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E2E8F0' }}>
      {/* Toolbar */}
      <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <p className="text-sm font-bold" style={{ color: '#18224C' }}>
          Campañas ({filtered.length})
        </p>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border outline-none"
            style={{ borderColor: '#E2E8F0', color: '#18224C' }}
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activas</option>
            <option value="PAUSED">Pausadas</option>
            <option value="ARCHIVED">Archivadas</option>
          </select>
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition hover:bg-gray-50"
            style={{ borderColor: '#E2E8F0', color: '#64748B' }}
          >
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#F8FAFC' }}>
            <tr>
              <th className="w-8" />
              <HeaderCell label="Campaña" k="campaign_name" />
              <HeaderCell label="Estado" k="status" />
              <HeaderCell label="Inversión" k="spend" />
              <HeaderCell label="Alcance" k="reach" />
              <HeaderCell label="Impresiones" k="impressions" />
              <HeaderCell label="Clics" k="clicks" />
              <HeaderCell label="CTR" k="ctr" />
              <HeaderCell label="CPC" k="cpc" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-sm" style={{ color: '#94A3B8' }}>
                  Sin datos. Sincroniza primero.
                </td>
              </tr>
            )}
            {filtered.map((c) => {
              const isExp = expanded === c.campaign_id
              const ctrScore = scoreMetric('ctr', c.ctr)
              const cpcScore = scoreMetric('cpc', c.cpc)
              const campAdsets = adsets.filter((a) => a.campaign_id === c.campaign_id)
              return (
                <>
                  <tr
                    key={c.campaign_id}
                    className="transition-colors"
                    style={{ borderTop: '1px solid #F1F5F9', cursor: campAdsets.length ? 'pointer' : 'default' }}
                    onClick={() => campAdsets.length && setExpanded(isExp ? null : c.campaign_id)}
                  >
                    <td className="pl-3">
                      {campAdsets.length > 0 && (
                        <ChevronRight
                          size={14}
                          style={{ color: '#94A3B8', transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-xs" style={{ color: '#18224C' }}>
                        {c.campaign_name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${statusColor(c.status)}18`,
                          color: statusColor(c.status),
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor(c.status) }} />
                        {statusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#18224C' }}>
                      {formatCOP(c.spend)}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{formatNumber(c.reach)}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{formatNumber(c.impressions)}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{formatNumber(c.clicks)}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: scoreColor(ctrScore) }}>
                      {formatPct(c.ctr)}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: scoreColor(cpcScore) }}>
                      {formatCOP(c.cpc)}
                    </td>
                  </tr>
                  {isExp && (
                    <tr key={`${c.campaign_id}-adsets`} style={{ backgroundColor: '#F8FAFC' }}>
                      <td colSpan={9} className="px-8 pb-4 pt-2">
                        <AdsetsTable adsets={campAdsets} />
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
