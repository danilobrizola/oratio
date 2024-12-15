import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente admin do Supabase com a service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // 1. Primeiro excluímos todos os dados relacionados ao usuário usando o cliente admin
    try {
      // Excluir comentários
      await supabaseAdmin
        .from('comments')
        .delete()
        .eq('author_id', user.id)

      // Excluir prayer_counts
      await supabaseAdmin
        .from('prayer_counts')
        .delete()
        .eq('user_id', user.id)

      // Excluir orações
      await supabaseAdmin
        .from('prayers')
        .delete()
        .eq('author_id', user.id)

      // Excluir usuário da tabela users
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', user.id)

      // 2. Por último, excluímos a autenticação
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
      if (authError) throw authError

      // 3. Limpar os cookies
      cookieStore.set({ 
        name: 'sb-access-token', 
        value: '', 
        maxAge: 0,
        path: '/' 
      })
      cookieStore.set({ 
        name: 'sb-refresh-token', 
        value: '', 
        maxAge: 0,
        path: '/' 
      })

      return NextResponse.json({ success: true })
    } catch (error: any) {
      console.error('Erro durante a exclusão:', error)
      
      // Se falhou em algum ponto, tentamos reverter a autenticação
      try {
        await supabaseAdmin.auth.admin.deleteUser(user.id)
      } catch (authError) {
        console.error('Erro ao excluir autenticação:', authError)
      }

      throw error
    }
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
