// app/api/meta/sync/route.ts — Vercel Cron (runs once per day at 6am)
import { NextResponse } from 'next/server'
import { runMetaSync } from '@/lib/meta-sync'

export const maxDuration = 30

export async function GET() {
  const result = await runMetaSync()
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
