import { createClient } from "@supabase/supabase-js"

// Cliente admin com service role key — ignora RLS
// Usar APENAS em Server Actions / Route Handlers, nunca no cliente
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
