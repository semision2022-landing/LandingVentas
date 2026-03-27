import { NextRequest, NextResponse } from 'next/server'

const PIXEL_ID = process.env.FB_PIXEL_ID
const CAPI_TOKEN = process.env.FB_CAPI_TOKEN

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    console.error('[fb-events] FB_PIXEL_ID o FB_CAPI_TOKEN no configurados')
    return NextResponse.json({ error: 'Facebook CAPI no configurada' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const {
      eventName,
      eventId,
      value,
      currency = 'COP',
      contentName,
      email,
      phone,
      eventSourceUrl,
      clientUserAgent,
    } = body

    if (!eventName || !eventId) {
      return NextResponse.json({ error: 'eventName y eventId son requeridos' }, { status: 400 })
    }

    // Build user_data (hashed fields required by Meta)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData: Record<string, any> = {
      client_user_agent: clientUserAgent ?? '',
    }
    // Normalize + hash email/phone if provided (Meta requires SHA-256)
    if (email) {
      const normalized = email.trim().toLowerCase()
      userData.em = await sha256(normalized)
    }
    if (phone) {
      const normalized = phone.replace(/\D/g, '')
      userData.ph = await sha256(normalized)
    }

    // Build custom_data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customData: Record<string, any> = {}
    if (value !== undefined) {
      customData.value = value
      customData.currency = currency
    }
    if (contentName) {
      customData.content_name = contentName
      customData.content_type = 'product'
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl ?? 'https://ventas.emision.co',
          action_source: 'website',
          user_data: userData,
          ...(Object.keys(customData).length > 0 && { custom_data: customData }),
        },
      ],
    }

    const res = await fetch(
      `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )

    const data = await res.json()

    if (!res.ok) {
      console.error('[fb-events] Meta API error:', JSON.stringify(data))
      return NextResponse.json({ error: data }, { status: 502 })
    }

    return NextResponse.json({ ok: true, events_received: data.events_received })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    console.error('[fb-events] Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/** SHA-256 hash using Web Crypto (Node.js 18+ compatible) */
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
