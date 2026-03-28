'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { formatCOP, formatDate } from '@/lib/meta-formatters'

interface DataPoint {
  date_start: string
  spend: number
}

interface SpendChartProps {
  data: DataPoint[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-lg px-4 py-2.5 text-sm" style={{ background: '#18224C', color: 'white' }}>
      <p className="text-xs mb-1 opacity-60">{formatDate(label)}</p>
      <p className="font-bold">{formatCOP(payload[0]?.value ?? 0)}</p>
    </div>
  )
}

export default function SpendChart({ data }: SpendChartProps) {
  const sorted = [...data].sort((a, b) => a.date_start.localeCompare(b.date_start))
  return (
    <div className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #E2E8F0' }}>
      <p className="text-sm font-bold mb-4" style={{ color: '#18224C' }}>💰 Inversión diaria (COP)</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={sorted} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18224C" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#18224C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="date_start"
            tickFormatter={(v) => formatDate(v)}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="#18224C"
            strokeWidth={2}
            fill="url(#spendGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
