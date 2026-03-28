// app/api/meta/refresh/route.ts — Manual sync, POST protected with Supabase Auth
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { runMetaSync, type DatePreset } from '@/lib/meta-sync'

export const maxDuration = 30

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // Verify auth token
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  // Read optional datePreset from body
  let datePreset: DatePreset = 'last_30d'
  try {
    const body = await req.json()
    if (body?.datePreset) datePreset = body.datePreset as DatePreset
  } catch { /* no body = use default */ }

  const result = await runMetaSync(datePreset)
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
