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

export async function DELETE(request: Request) {
  console.log('=== INÍCIO DA REQUISIÇÃO DE DELEÇÃO ===')
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

    const { commentId, prayerId } = await request.json()
    console.log('Dados recebidos:', { commentId, prayerId })

    // Verificar se o usuário é o autor do comentário ou da oração
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .select('author_id, prayer:prayers(author_id)')
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

    // Usuário pode deletar se for autor do comentário ou da oração
    const canDelete = 
      comment.author_id === session.user.id || 
      (comment.prayer as any).author_id === session.user.id

    console.log('Verificação de permissão:', {
      commentAuthorId: comment.author_id,
      prayerAuthorId: (comment.prayer as any).author_id,
      sessionUserId: session.user.id,
      canDelete
    })

    if (!canDelete) {
      console.log('Usuário não tem permissão para deletar')
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar este comentário' },
        { status: 401 }
      )
    }

    const { error: deleteError } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId)

    console.log('Resultado da deleção:', {
      error: deleteError?.message
    })

    if (deleteError) {
      console.log('Erro ao deletar comentário:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao deletar comentário' },
        { status: 500 }
      )
    }

    console.log('=== DELEÇÃO CONCLUÍDA COM SUCESSO ===')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('=== ERRO NA DELEÇÃO ===', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
