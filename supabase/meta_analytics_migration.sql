-- ================================================
-- Meta Ads Analytics Cache Tables
-- Run in Supabase SQL Editor
-- ================================================

CREATE TABLE IF NOT EXISTS meta_campaigns_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fetched_at timestamptz DEFAULT now(),
  account_id text,
  campaign_id text UNIQUE,
  campaign_name text,
  status text,
  objective text,
  spend numeric DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  reach integer DEFAULT 0,
  ctr numeric DEFAULT 0,
  cpc numeric DEFAULT 0,
  cpm numeric DEFAULT 0,
  conversions integer DEFAULT 0,
  cost_per_conversion numeric DEFAULT 0,
  frequency numeric DEFAULT 0,
  date_start date,
  date_stop date
);

CREATE TABLE IF NOT EXISTS meta_adsets_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fetched_at timestamptz DEFAULT now(),
  campaign_id text,
  adset_id text UNIQUE,
  adset_name text,
  status text,
  spend numeric DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  ctr numeric DEFAULT 0,
  cpc numeric DEFAULT 0,
  reach integer DEFAULT 0,
  date_start date,
  date_stop date
);

-- Daily insights for charts
CREATE TABLE IF NOT EXISTS meta_daily_insights (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fetched_at timestamptz DEFAULT now(),
  account_id text,
  date_start date,
  spend numeric DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  reach integer DEFAULT 0,
  ctr numeric DEFAULT 0,
  cpc numeric DEFAULT 0,
  UNIQUE(account_id, date_start)
);

-- Sync log
CREATE TABLE IF NOT EXISTS meta_sync_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  synced_at timestamptz DEFAULT now(),
  status text, -- 'success' | 'error'
  error_message text,
  campaigns_synced integer DEFAULT 0,
  adsets_synced integer DEFAULT 0
);

-- Enable RLS (API routes use service role, so RLS doesn't block them)
ALTER TABLE meta_campaigns_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_adsets_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_daily_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_sync_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admin panel) to read
CREATE POLICY "Authenticated users can read meta_campaigns_cache"
  ON meta_campaigns_cache FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read meta_adsets_cache"
  ON meta_adsets_cache FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read meta_daily_insights"
  ON meta_daily_insights FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read meta_sync_log"
  ON meta_sync_log FOR SELECT TO authenticated USING (true);
