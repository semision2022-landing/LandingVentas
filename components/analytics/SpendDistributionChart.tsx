'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCOP } from '@/lib/meta-formatters'

const COLORS = ['#18224C', '#00D0FF', '#5F4EDA', '#579601', '#F97316', '#EF4444', '#8B5CF6', '#EC4899']

interface Campaign { campaign_name: string; spend: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-lg px-4 py-2.5" style={{ background: '#18224C', color: 'white' }}>
      <p className="text-xs mb-1 font-semibold">{payload[0]?.name}</p>
      <p className="font-bold">{formatCOP(payload[0]?.value)}</p>
      <p className="text-xs opacity-60">{payload[0]?.payload?.pct?.toFixed(1)}% del total</p>
    </div>
  )
}

export default function SpendDistributionChart({ campaigns }: { campaigns: Campaign[] }) {
  const total = campaigns.reduce((s, c) => s + (c.spend || 0), 0)
  const data = campaigns
    .filter((c) => c.spend > 0)
    .map((c) => ({ name: c.campaign_name, value: c.spend, pct: total > 0 ? (c.spend / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="rounded-2xl p-5 bg-white flex items-center justify-center" style={{ border: '1px solid #E2E8F0', minHeight: 260 }}>
        <p className="text-sm" style={{ color: '#94A3B8' }}>Sin datos de inversión</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #E2E8F0' }}>
      <p className="text-sm font-bold mb-4" style={{ color: '#18224C' }}>🎯 Distribución del gasto</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ fontSize: 11, color: '#64748B' }}>{value.length > 22 ? `${value.slice(0, 22)}…` : value}</span>}
            iconSize={10}
            wrapperStyle={{ paddingTop: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
