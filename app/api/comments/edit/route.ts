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

export async function PUT(request: Request) {
  console.log('=== INÍCIO DA REQUISIÇÃO DE EDIÇÃO ===')
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
    console.log('Sessão:', {
      hasSession: !!session,
      sessionError: sessionError?.message
    })

    if (sessionError || !session) {
      console.log('Usuário não autenticado')
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { commentId, content } = await request.json()
    console.log('Dados recebidos:', { commentId, content })

    // Verificar se o usuário é o autor do comentário
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single()

    console.log('Dados do comentário:', { 
      comment,
      commentError: commentError?.message
    })

    if (!comment) {
      console.log('Comentário não encontrado')
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      )
    }

    // Apenas o autor do comentário pode editá-lo
    console.log('Comparando autores:', {
      commentAuthorId: comment.author_id,
      sessionUserId: session.user.id
    })

    if (comment.author_id !== session.user.id) {
      console.log('Usuário não é o autor do comentário')
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este comentário' },
        { status: 401 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from('comments')
      .update({ content })
      .eq('id', commentId)

    console.log('Resultado da atualização:', {
      error: updateError?.message
    })

    if (updateError) {
      console.log('Erro ao atualizar comentário:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar comentário' },
        { status: 500 }
      )
    }

    console.log('=== EDIÇÃO CONCLUÍDA COM SUCESSO ===')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('=== ERRO NA EDIÇÃO ===', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
