/**
 * Facebook Pixel client-side helper
 * Uses event_id for deduplication with CAPI server-side events.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

/** Genera un event_id único para deduplicar Pixel ↔ CAPI */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Dispara fbq('track', ...) de forma segura */
export function fbEvent(
  eventName: string,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window === 'undefined' || !window.fbq) return
  const id = eventId ?? generateEventId()
  window.fbq('track', eventName, params, { eventID: id })
}

/** PageView — se llama manualmente en layout */
export function fbPageView() {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'PageView')
}

/**
 * Envía el evento al endpoint CAPI server-side.
 * Llama siempre DESPUÉS de fbEvent() para usar el mismo eventId.
 */
export async function sendCapi(payload: {
  eventName: string
  eventId: string
  value?: number
  currency?: string
  contentName?: string
  email?: string
  phone?: string
}) {
  try {
    await fetch('/api/fb-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        eventSourceUrl: window.location.href,
        clientUserAgent: navigator.userAgent,
      }),
    })
  } catch (e) {
    console.warn('[CAPI] Error sending server event:', e)
  }
}
