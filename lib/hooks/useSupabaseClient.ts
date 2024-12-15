import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { Database } from '@/types/database'

export function useSupabaseClient() {
  const { data: session } = useSession()

  const supabase = useMemo(() => {
    const client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
        global: {
          headers: session?.access_token 
            ? { 
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
              }
            : {}
        }
      }
    )

    return client
  }, [session?.access_token])

  return supabase
}
