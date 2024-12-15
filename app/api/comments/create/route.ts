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

    const body = await request.json()
    const { prayer_id, content } = body

    if (!prayer_id || !content?.trim()) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Usar o cliente admin para criar o comentário
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .insert({
        prayer_id,
        author_id: session.user.id,
        content: content.trim()
      })
      .select(`
        id,
        content,
        created_at,
        author:users!author_id (
          name,
          image
        )
      `)
      .single()

    if (commentError) {
      throw commentError
    }

    return NextResponse.json(comment)
  } catch (error: any) {
    console.error('Erro ao criar comentário:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
