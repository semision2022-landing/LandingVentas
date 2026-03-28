// app/api/meta/refresh/route.ts
// Manual sync — POST endpoint protected with Supabase Auth
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // Verify auth cookie
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  // Call the sync endpoint internally
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const syncRes = await fetch(`${base}/api/meta/sync`, { cache: 'no-store' })
  const body = await syncRes.json()
  return NextResponse.json(body, { status: syncRes.status })
}
