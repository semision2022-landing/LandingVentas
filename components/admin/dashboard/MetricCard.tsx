interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  bgColor: string
  change?: string
  alert?: boolean
}

export default function MetricCard({ label, value, icon, color, bgColor, change, alert }: MetricCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-md"
      style={{
        border: alert ? '2px solid #F97316' : '1px solid #E2E8F0',
        boxShadow: alert ? '0 0 0 4px rgba(249,115,22,0.08)' : '',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: '#64748B' }}>{label}</span>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgColor, color }}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold" style={{ color: alert ? '#F97316' : '#18224C' }}>
          {value}
        </p>
        {change && <p className="text-xs mt-1" style={{ color: '#64748B' }}>{change}</p>}
      </div>
    </div>
  )
}
