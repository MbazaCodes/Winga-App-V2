import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side admin client (service role — bypasses RLS).
// Created lazily inside request handlers so the module never throws at
// build time when the service-role key is not yet configured.
export function createAdminClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-service-role-key',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
