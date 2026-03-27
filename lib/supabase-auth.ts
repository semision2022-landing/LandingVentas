import { createBrowserClient } from '@supabase/ssr'

/** Cliente Supabase para componentes del admin (persiste sesión en cookies) */
export function createAuthClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
