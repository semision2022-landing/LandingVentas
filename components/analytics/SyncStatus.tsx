'use client'

import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface SyncStatusProps {
  lastSync: string | null   // ISO timestamp
  status: 'success' | 'error' | 'loading' | 'idle'
  tokenDaysLeft?: number | null
  onSync: () => void
  syncing: boolean
}

export default function SyncStatus({ lastSync, status, tokenDaysLeft, onSync, syncing }: SyncStatusProps) {
  const elapsed = lastSync ? Math.floor((Date.now() - new Date(lastSync).getTime()) / 60000) : null

  const statusBadge = () => {
    if (syncing) return (
      <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
        <RefreshCw size={12} className="animate-spin" /> Sincronizando…
      </span>
    )
    if (status === 'success') return (
      <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
        <CheckCircle size={12} />
        {elapsed !== null ? (elapsed === 0 ? 'Recién sincronizado' : `Sincronizado hace ${elapsed} min`) : 'Sincronizado'}
      </span>
    )
    if (status === 'error') return (
      <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
        <AlertCircle size={12} /> Error de sincronización
      </span>
    )
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#F8FAFC', color: '#64748B' }}>
        <Clock size={12} /> Sin sincronizar
      </span>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {statusBadge()}

      {tokenDaysLeft !== null && tokenDaysLeft !== undefined && tokenDaysLeft <= 10 && (
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
          ⚠️ Token Meta vence en {tokenDaysLeft} día{tokenDaysLeft !== 1 ? 's' : ''}
        </span>
      )}

      <button
        onClick={onSync}
        disabled={syncing}
        className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
        style={{ backgroundColor: '#18224C', color: 'white' }}
      >
        <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
        Sincronizar ahora
      </button>
    </div>
  )
}
