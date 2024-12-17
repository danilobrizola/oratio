'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useSupabaseClient } from './useSupabaseClient'
import { useToast } from '@/components/ui/use-toast'

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const syncUser = async (user: User) => {
    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error: any) {
      console.error('Erro ao sincronizar usuário:', error)
      toast({
        title: "Erro ao sincronizar dados",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    let mounted = true

    // Verificar sessão inicial
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            await syncUser(session.user)
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    checkSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser(session.user)
          await syncUser(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, toast])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error)
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return { user, loading, signOut, supabase }
}
