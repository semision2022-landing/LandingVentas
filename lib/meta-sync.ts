// lib/meta-sync.ts
// Shared sync logic — called by both /api/meta/sync and /api/meta/refresh

import { createClient } from '@supabase/supabase-js'
import { fetchCampaigns, fetchAdsets, fetchDailyInsights } from '@/lib/meta-api'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface SyncResult {
  ok: boolean
  campaigns?: number
  adsets?: number
  daily?: number
  ms?: number
  error?: string
}

export type DatePreset = 'today' | 'yesterday' | 'last_7d' | 'last_30d' | 'this_month'

// Map UI presets to Meta API date_preset values
const META_PRESET: Record<DatePreset, string> = {
  today: 'today',
  yesterday: 'yesterday',
  last_7d: 'last_7d',
  last_30d: 'last_30d',
  this_month: 'this_month',
}

export async function runMetaSync(uiPreset: DatePreset = 'last_30d'): Promise<SyncResult> {
  const datePreset = META_PRESET[uiPreset]
  const supabase = getSupabase()
  const startedAt = Date.now()
  let campaignsSynced = 0
  let adsetsSynced = 0

  try {
    // ── 1. Campaigns ────────────────────────────────────────────────────────
    const campaigns = await fetchCampaigns(datePreset)

    const campaignRows = campaigns.map((c) => {
      const ins = c.insights?.data?.[0]
      const conversions =
        ins?.actions
          ?.filter((a) =>
            ['purchase', 'lead', 'complete_registration'].includes(a.action_type)
          )
          .reduce((sum, a) => sum + Number(a.value || 0), 0) ?? 0
      const spend = Number(ins?.spend ?? 0)
      const costPerConversion = conversions > 0 ? spend / conversions : 0
      return {
        account_id: process.env.META_AD_ACCOUNT_ID,
        campaign_id: c.id,
        campaign_name: c.name,
        status: c.status,
        objective: c.objective,
        spend,
        impressions: Number(ins?.impressions ?? 0),
        clicks: Number(ins?.clicks ?? 0),
        reach: Number(ins?.reach ?? 0),
        ctr: Number(ins?.ctr ?? 0),
        cpc: Number(ins?.cpc ?? 0),
        cpm: Number(ins?.cpm ?? 0),
        conversions,
        cost_per_conversion: costPerConversion,
        frequency: Number(ins?.frequency ?? 0),
        date_start: ins?.date_start ?? null,
        date_stop: ins?.date_stop ?? null,
        fetched_at: new Date().toISOString(),
      }
    })

    if (campaignRows.length > 0) {
      const { error } = await supabase
        .from('meta_campaigns_cache')
        .upsert(campaignRows, { onConflict: 'campaign_id', ignoreDuplicates: false })
      if (error) throw new Error(`campaigns upsert: ${error.message}`)
      campaignsSynced = campaignRows.length
    }

    // ── 2. Adsets ─────────────────────────────────────────────────────────
    const adsets = await fetchAdsets(datePreset)

    const adsetRows = adsets.map((a) => {
      const ins = a.insights?.data?.[0]
      return {
        campaign_id: a.campaign_id,
        adset_id: a.id,
        adset_name: a.name,
        status: a.status,
        spend: Number(ins?.spend ?? 0),
        impressions: Number(ins?.impressions ?? 0),
        clicks: Number(ins?.clicks ?? 0),
        ctr: Number(ins?.ctr ?? 0),
        cpc: Number(ins?.cpc ?? 0),
        reach: Number(ins?.reach ?? 0),
        date_start: ins?.date_start ?? null,
        date_stop: ins?.date_stop ?? null,
        fetched_at: new Date().toISOString(),
      }
    })

    if (adsetRows.length > 0) {
      const { error } = await supabase
        .from('meta_adsets_cache')
        .upsert(adsetRows, { onConflict: 'adset_id', ignoreDuplicates: false })
      if (error) throw new Error(`adsets upsert: ${error.message}`)
      adsetsSynced = adsetRows.length
    }

    // ── 3. Daily insights ─────────────────────────────────────────────────
    const daily = await fetchDailyInsights(datePreset)
    const dailyRows = daily.map((d) => ({
      account_id: process.env.META_AD_ACCOUNT_ID,
      date_start: d.date_start,
      spend: Number(d.spend ?? 0),
      impressions: Number(d.impressions ?? 0),
      clicks: Number(d.clicks ?? 0),
      reach: Number(d.reach ?? 0),
      ctr: Number(d.ctr ?? 0),
      cpc: Number(d.cpc ?? 0),
      fetched_at: new Date().toISOString(),
    }))
    if (dailyRows.length > 0) {
      await supabase
        .from('meta_daily_insights')
        .upsert(dailyRows, { onConflict: 'account_id,date_start', ignoreDuplicates: false })
    }

    // ── 4. Log success ────────────────────────────────────────────────────
    await supabase.from('meta_sync_log').insert({
      status: 'success',
      campaigns_synced: campaignsSynced,
      adsets_synced: adsetsSynced,
    })

    return {
      ok: true,
      campaigns: campaignsSynced,
      adsets: adsetsSynced,
      daily: dailyRows.length,
      ms: Date.now() - startedAt,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    // best-effort log
    try {
      await supabase.from('meta_sync_log').insert({ status: 'error', error_message: message })
    } catch { /* ignore */ }
    return { ok: false, error: message }
  }
}
