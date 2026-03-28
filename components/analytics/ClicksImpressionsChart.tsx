'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import { formatDate, formatNumber } from '@/lib/meta-formatters'

interface DataPoint {
  date_start: string
  clicks: number
  impressions: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-lg px-4 py-2.5" style={{ background: '#18224C', color: 'white' }}>
      <p className="text-xs mb-2 opacity-60">{formatDate(label)}</p>
      {payload.map((p: { color: string; name: string; value: number }, i: number) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: {formatNumber(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function ClicksImpressionsChart({ data }: { data: DataPoint[] }) {
  const sorted = [...data].sort((a, b) => a.date_start.localeCompare(b.date_start))
  return (
    <div className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #E2E8F0' }}>
      <p className="text-sm font-bold mb-4" style={{ color: '#18224C' }}>🖱️ Clics e Impresiones</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={sorted} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="date_start"
            tickFormatter={(v) => formatDate(v)}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(v) => formatNumber(v)}
            tick={{ fontSize: 10, fill: '#18224C' }}
            axisLine={false} tickLine={false} width={45}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => formatNumber(v)}
            tick={{ fontSize: 10, fill: '#00D0FF' }}
            axisLine={false} tickLine={false} width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Line yAxisId="left" type="monotone" dataKey="clicks" name="Clics" stroke="#18224C" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impresiones" stroke="#00D0FF" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
