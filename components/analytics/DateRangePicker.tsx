'use client'

type Preset = 'today' | 'yesterday' | 'last_7d' | 'last_30d' | 'this_month'

const OPTIONS: { label: string; value: Preset }[] = [
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Últimos 7 días', value: 'last_7d' },
  { label: 'Últimos 30 días', value: 'last_30d' },
  { label: 'Este mes', value: 'this_month' },
]

interface DateRangePickerProps {
  value: Preset
  onChange: (value: Preset) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all"
          style={{
            backgroundColor: value === o.value ? '#18224C' : '#F1F5F9',
            color: value === o.value ? 'white' : '#64748B',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export type { Preset }
