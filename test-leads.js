import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function main() {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, visitor_name, visitor_email, visitor_phone, created_at, status, lead_source_type')
    .order('created_at', { ascending: false })
    .limit(10)

  console.log('Error?', error)
  console.log('10 recent Leads:', data)
}

main()
