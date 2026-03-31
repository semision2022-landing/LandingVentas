const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/conversations`

fetch(url, {
  method: 'POST',
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    session_id: `wa_test_123`,
    status: 'closed',
    visitor_name: 'Prueba Terminal',
    visitor_email: 'test@emision.co',
    visitor_phone: '12345678',
    plan_interest: 'Plan X',
    lead_source: 'whatsapp'
  })
}).then(res => res.json()).then(data => {
  console.log('Insert Result:', data)
}).catch(err => console.error(err))
