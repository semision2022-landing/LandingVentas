'use client'

interface QuickRepliesProps {
  onSelect: (text: string) => void
  visible: boolean
}

const quickReplies = [
  '¿Cuánto cuestan los planes?',
  '¿Qué incluye la habilitación DIAN?',
  '¿Funciona en el celular?',
  'Hablar con un asesor',
]

export default function QuickReplies({ onSelect, visible }: QuickRepliesProps) {
  if (!visible) return null

  return (
    <div className="px-4 pb-3 flex flex-wrap gap-2">
      {quickReplies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 border"
          style={{
            borderColor: 'var(--navy)',
            color: 'var(--navy)',
            backgroundColor: 'rgba(24, 34, 76, 0.05)',
          }}
        >
          {reply}
        </button>
      ))}
    </div>
  )
}
