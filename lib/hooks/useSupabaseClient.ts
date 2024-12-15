'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function useSupabaseClient() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabase
}
