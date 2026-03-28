'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  icon: React.ReactNode
  change?: number | null   // % change vs prev period
  benchmark?: string       // e.g. ">2% es bueno"
  alert?: boolean          // red highlight
  color?: string
}

export default function KPICard({ label, value, icon, change, benchmark, alert, color = '#18224C' }: KPICardProps) {
  const hasChange = change !== null && change !== undefined
  const positive = hasChange && change! >= 0

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-md"
      style={{
        background: 'white',
        border: alert ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#94A3B8' }}>
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-black leading-none" style={{ color: '#18224C' }}>
        {value}
      </p>

      {/* Bottom row — change + benchmark */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {hasChange ? (
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: positive ? '#DCFCE7' : '#FEE2E2',
              color: positive ? '#16A34A' : '#DC2626',
            }}
          >
            {change === 0 ? <Minus size={10} /> : positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {change === 0 ? 'Sin cambio' : `${positive ? '+' : ''}${change!.toFixed(1)}%`}
          </span>
        ) : (
          <span />
        )}
        {benchmark && (
          <span className="text-[10px]" style={{ color: '#94A3B8' }}>{benchmark}</span>
        )}
      </div>
    </div>
  )
}
