'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell
} from 'recharts'
import { formatDate } from '@/lib/meta-formatters'

interface DataPoint { date_start: string; ctr: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-lg px-4 py-2.5" style={{ background: '#18224C', color: 'white' }}>
      <p className="text-xs mb-1 opacity-60">{formatDate(label)}</p>
      <p className="font-bold">{payload[0]?.value?.toFixed(2)}%</p>
    </div>
  )
}

export default function CTRChart({ data }: { data: DataPoint[] }) {
  const sorted = [...data].sort((a, b) => a.date_start.localeCompare(b.date_start))
  return (
    <div className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #E2E8F0' }}>
      <p className="text-sm font-bold mb-4" style={{ color: '#18224C' }}>📊 CTR por día (%) · referencia 2%</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sorted} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="date_start"
            tickFormatter={(v) => formatDate(v)}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false} tickLine={false} width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={2} stroke="#F97316" strokeDasharray="4 4" label={{ value: '2%', fontSize: 10, fill: '#F97316', position: 'right' }} />
          <Bar dataKey="ctr" radius={[4, 4, 0, 0]} maxBarSize={18}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={entry.ctr >= 2 ? '#579601' : '#F97316'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
