'use client'

import { useEffect, useState } from 'react'
import { createClient, User } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUser = async (user: User) => {
    try {
      // Usar exatamente o mesmo UUID do Supabase Auth
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id, // Este é o auth.uid()
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          image: user.user_metadata?.avatar_url
        })

      if (upsertError) {
        console.error('Erro ao sincronizar usuário:', upsertError)
      }
    } catch (error: any) {
      console.error('Erro ao sincronizar usuário:', error.message)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        syncUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        syncUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return
  }

  return {
    user,
    loading,
    signOut,
    supabase
  }
}
