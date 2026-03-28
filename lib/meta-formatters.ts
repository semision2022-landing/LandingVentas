// lib/meta-formatters.ts
// Formatting utilities for Meta Ads metrics

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatCOP(value: number): string {
  return COP.format(value)
}

export function formatPct(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return new Intl.NumberFormat('es-CO').format(value)
}

export function formatChange(current: number, previous: number): { pct: number; positive: boolean } {
  if (previous === 0) return { pct: 0, positive: true }
  const pct = ((current - previous) / previous) * 100
  return { pct, positive: pct >= 0 }
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short',
  })
}

export function statusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'ACTIVE': return '#22C55E'
    case 'PAUSED': return '#F97316'
    case 'ARCHIVED': return '#94A3B8'
    case 'DELETED': return '#EF4444'
    default: return '#94A3B8'
  }
}

export function statusLabel(status: string): string {
  switch (status?.toUpperCase()) {
    case 'ACTIVE': return 'Activa'
    case 'PAUSED': return 'Pausada'
    case 'ARCHIVED': return 'Archivada'
    case 'DELETED': return 'Eliminada'
    default: return status ?? 'Desconocido'
  }
}

export function scoreMetric(metric: 'ctr' | 'cpc' | 'frequency', value: number): 'good' | 'ok' | 'bad' {
  if (metric === 'ctr') {
    if (value >= 3) return 'good'
    if (value >= 1) return 'ok'
    return 'bad'
  }
  if (metric === 'cpc') {
    if (value <= 500) return 'good'
    if (value <= 2000) return 'ok'
    return 'bad'
  }
  if (metric === 'frequency') {
    if (value <= 2) return 'good'
    if (value <= 3) return 'ok'
    return 'bad'
  }
  return 'ok'
}
