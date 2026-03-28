'use client'

interface Alert {
  level: 'error' | 'warning' | 'success'
  message: string
  campaignId?: string
  campaignName?: string
}

function levelStyles(level: Alert['level']) {
  if (level === 'error') return { bg: '#FEF2F2', border: '#FECACA', icon: '🔴', color: '#DC2626' }
  if (level === 'warning') return { bg: '#FFFBEB', border: '#FDE68A', icon: '🟡', color: '#D97706' }
  return { bg: '#F0FDF4', border: '#BBF7D0', icon: '🟢', color: '#16A34A' }
}

interface Campaign {
  campaign_id: string
  campaign_name: string
  ctr: number
  cpc: number
  frequency: number
  spend: number
  impressions: number
  clicks: number
  date_stop?: string | null
}

function generateAlerts(campaigns: Campaign[]): Alert[] {
  const alerts: Alert[] = []
  const now = Date.now()
  const threeDays = 3 * 24 * 60 * 60 * 1000

  for (const c of campaigns) {
    if (c.ctr < 1 && c.impressions > 1000) {
      alerts.push({ level: 'error', message: `"${c.campaign_name}" tiene CTR muy bajo (${c.ctr.toFixed(2)}%). Considera cambiar los creativos.`, campaignId: c.campaign_id, campaignName: c.campaign_name })
    } else if (c.ctr >= 3) {
      alerts.push({ level: 'success', message: `"${c.campaign_name}" está rindiendo excelente (CTR ${c.ctr.toFixed(2)}%). ¡Considera aumentar el presupuesto!`, campaignId: c.campaign_id, campaignName: c.campaign_name })
    }
    if (c.frequency > 3) {
      alerts.push({ level: 'warning', message: `La audiencia de "${c.campaign_name}" ya ha visto el anuncio ${c.frequency.toFixed(1)} veces. Riesgo de saturación.`, campaignId: c.campaign_id, campaignName: c.campaign_name })
    }
    if (c.cpc > 2000 && c.clicks > 0) {
      alerts.push({ level: 'error', message: `El CPC de "${c.campaign_name}" es muy alto ($${Math.round(c.cpc).toLocaleString('es-CO')} COP). Revisa las pujas.`, campaignId: c.campaign_id, campaignName: c.campaign_name })
    }
    if (c.date_stop && (now - new Date(c.date_stop).getTime()) > threeDays && c.spend === 0) {
      alerts.push({ level: 'warning', message: `"${c.campaign_name}" no ha tenido gasto en más de 3 días. Puede estar pausada o sin presupuesto.`, campaignId: c.campaign_id, campaignName: c.campaign_name })
    }
  }

  if (alerts.length === 0) {
    alerts.push({ level: 'success', message: 'Todas las campañas están en parámetros normales. ¡Buen trabajo! 🎉' })
  }
  return alerts
}

// Extend Campaign type for internal use
type CampaignExt = Campaign & { impressions: number }

export default function AlertsPanel({ campaigns }: { campaigns: CampaignExt[] }) {
  const alerts = generateAlerts(campaigns)
  const errors = alerts.filter((a) => a.level === 'error').length
  const warnings = alerts.filter((a) => a.level === 'warning').length
  const successes = alerts.filter((a) => a.level === 'success').length

  return (
    <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E2E8F0' }}>
      <div className="px-5 py-4 flex items-center gap-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <p className="text-sm font-bold flex-1" style={{ color: '#18224C' }}>
          ⚡ Alertas e Insights automáticos
        </p>
        <div className="flex items-center gap-3 text-xs">
          {errors > 0 && <span className="font-semibold" style={{ color: '#DC2626' }}>🔴 {errors} error{errors > 1 ? 'es' : ''}</span>}
          {warnings > 0 && <span className="font-semibold" style={{ color: '#D97706' }}>🟡 {warnings} aviso{warnings > 1 ? 's' : ''}</span>}
          {successes > 0 && <span className="font-semibold" style={{ color: '#16A34A' }}>🟢 {successes} positivo{successes > 1 ? 's' : ''}</span>}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {alerts.map((alert, i) => {
          const s = levelStyles(alert.level)
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
            >
              <span className="shrink-0 mt-0.5 text-base">{s.icon}</span>
              <p style={{ color: s.color }} className="leading-relaxed text-xs">{alert.message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
