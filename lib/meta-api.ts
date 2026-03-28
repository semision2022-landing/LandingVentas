// lib/meta-api.ts
// Meta Marketing API v19.0 helper

const BASE = 'https://graph.facebook.com'
const VERSION = process.env.META_API_VERSION ?? 'v19.0'
const TOKEN = process.env.META_ACCESS_TOKEN ?? ''
const ACCOUNT = process.env.META_AD_ACCOUNT_ID ?? '' // act_XXXXXXX

export interface MetaCampaign {
  id: string
  name: string
  status: string
  objective: string
  insights?: {
    data: Array<{
      spend: string
      impressions: string
      clicks: string
      reach: string
      ctr: string
      cpc: string
      cpm: string
      frequency: string
      actions?: Array<{ action_type: string; value: string }>
      cost_per_action?: Array<{ action_type: string; value: string }>
      date_start: string
      date_stop: string
    }>
  }
}

export interface MetaAdset {
  id: string
  name: string
  campaign_id: string
  status: string
  insights?: {
    data: Array<{
      spend: string
      impressions: string
      clicks: string
      ctr: string
      cpc: string
      reach: string
      date_start: string
      date_stop: string
    }>
  }
}

export interface MetaDailyInsight {
  spend: string
  impressions: string
  clicks: string
  reach: string
  ctr: string
  cpc: string
  date_start: string
  date_stop: string
}

function buildUrl(path: string, params: Record<string, string>): string {
  const url = new URL(`${BASE}/${VERSION}/${path}`)
  url.searchParams.set('access_token', TOKEN)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  return url.toString()
}

async function metaFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = buildUrl(path, params)
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Meta API ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ─── Fetch campaigns with inline insights ──────────────────────────────────
export async function fetchCampaigns(datePreset = 'last_30d'): Promise<MetaCampaign[]> {
  const data = await metaFetch<{ data: MetaCampaign[] }>(
    `${ACCOUNT}/campaigns`,
    {
      fields: `id,name,status,objective,insights.date_preset(${datePreset}){spend,impressions,clicks,reach,ctr,cpc,cpm,frequency,actions,date_start,date_stop}`,
      limit: '200',
    }
  )
  return data.data ?? []
}

// ─── Fetch adsets with inline insights ─────────────────────────────────────
export async function fetchAdsets(datePreset = 'last_30d'): Promise<MetaAdset[]> {
  const data = await metaFetch<{ data: MetaAdset[] }>(
    `${ACCOUNT}/adsets`,
    {
      fields: `id,name,campaign_id,status,insights.date_preset(${datePreset}){spend,impressions,clicks,ctr,cpc,reach,date_start,date_stop}`,
      limit: '500',
    }
  )
  return data.data ?? []
}

// ─── Fetch daily account-level insights for charts ─────────────────────────
export async function fetchDailyInsights(datePreset = 'last_30d'): Promise<MetaDailyInsight[]> {
  const data = await metaFetch<{ data: MetaDailyInsight[] }>(
    `${ACCOUNT}/insights`,
    {
      fields: 'spend,impressions,clicks,reach,ctr,cpc,date_start,date_stop',
      date_preset: datePreset,
      time_increment: '1',
      limit: '90',
    }
  )
  return data.data ?? []
}

// ─── Token expiry check ─────────────────────────────────────────────────────
export async function checkTokenExpiry(): Promise<{ daysLeft: number | null; error?: string }> {
  try {
    const url = buildUrl('debug_token', {
      input_token: TOKEN,
      access_token: `${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`,
    })
    const res = await fetch(url)
    const json = await res.json()
    const expiresAt: number | undefined = json?.data?.expires_at
    if (!expiresAt) return { daysLeft: null }
    const msLeft = expiresAt * 1000 - Date.now()
    const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))
    return { daysLeft }
  } catch (e) {
    return { daysLeft: null, error: String(e) }
  }
}
