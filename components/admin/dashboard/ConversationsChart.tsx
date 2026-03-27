'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  date: string
  conversations: number
  sales: number
}

interface ConversationsChartProps {
  data: DataPoint[]
}

export default function ConversationsChart({ data }: ConversationsChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E2E8F0' }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: '#18224C' }}>
        Conversaciones y ventas — últimos 7 días
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'Poppins' }}
            labelStyle={{ color: '#18224C', fontWeight: 600 }}
          />
          <Line type="monotone" dataKey="conversations" name="Conversaciones" stroke="#18224C" strokeWidth={2} dot={{ r: 3, fill: '#18224C' }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="sales" name="Ventas" stroke="#00D0FF" strokeWidth={2} dot={{ r: 3, fill: '#00D0FF' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
