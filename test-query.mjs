const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/conversations?select=*,agents!assigned_to(name)&or=(visitor_email.not.is.null,visitor_phone.not.is.null,visitor_name.not.is.null,lead_source_type.eq.manual)&order=created_at.desc&limit=5`

fetch(url, {
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  }
}).then(res => res.json()).then(data => {
  console.log('API Response:')
  console.log(data)
}).catch(err => console.error(err))
