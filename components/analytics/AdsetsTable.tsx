'use client'

import { formatCOP, formatPct, formatNumber, statusColor, statusLabel, scoreMetric } from '@/lib/meta-formatters'

interface Adset {
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

const scoreColor = (s: 'good' | 'ok' | 'bad') =>
  s === 'good' ? '#16A34A' : s === 'ok' ? '#F97316' : '#EF4444'

export default function AdsetsTable({ adsets }: { adsets: Adset[] }) {
  if (adsets.length === 0) return (
    <p className="text-xs py-2" style={{ color: '#94A3B8' }}>Sin conjuntos de anuncios</p>
  )

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
      <p className="px-4 pt-3 pb-2 text-xs font-bold" style={{ color: '#18224C' }}>
        Conjuntos de anuncios ({adsets.length})
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead style={{ backgroundColor: '#EFF6FF' }}>
            <tr>
              {['Conjunto', 'Estado', 'Inversión', 'Alcance', 'Impresiones', 'Clics', 'CTR', 'CPC'].map((h) => (
                <th key={h} className="px-4 py-2 text-left font-semibold" style={{ color: '#64748B' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adsets.map((a) => (
              <tr key={a.adset_id} style={{ borderTop: '1px solid #F1F5F9' }}>
                <td className="px-4 py-2.5 font-medium" style={{ color: '#18224C' }}>{a.adset_name}</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${statusColor(a.status)}18`, color: statusColor(a.status) }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor(a.status) }} />
                    {statusLabel(a.status)}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-semibold" style={{ color: '#18224C' }}>{formatCOP(a.spend)}</td>
                <td className="px-4 py-2.5" style={{ color: '#64748B' }}>{formatNumber(a.reach)}</td>
                <td className="px-4 py-2.5" style={{ color: '#64748B' }}>{formatNumber(a.impressions)}</td>
                <td className="px-4 py-2.5" style={{ color: '#64748B' }}>{formatNumber(a.clicks)}</td>
                <td className="px-4 py-2.5 font-semibold" style={{ color: scoreColor(scoreMetric('ctr', a.ctr)) }}>{formatPct(a.ctr)}</td>
                <td className="px-4 py-2.5 font-semibold" style={{ color: scoreColor(scoreMetric('cpc', a.cpc)) }}>{formatCOP(a.cpc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
