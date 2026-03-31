import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallas',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallas'
)

async function main() {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, visitor_name, visitor_email, visitor_phone, created_at, status, lead_source_type')
    .order('created_at', { ascending: false })
    .limit(10)

  console.log('Error:', error)
  console.log('10 recent:', data)
}

main()
