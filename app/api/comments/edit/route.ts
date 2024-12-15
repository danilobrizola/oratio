import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const { commentId, content } = await request.json()
    const authHeader = request.headers.get('Authorization')
    
    console.log('Auth Header:', authHeader) // Debug

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Token de autorização ausente ou inválido', { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    console.log('Token:', token) // Debug

    // Cliente admin para operações no banco
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar o token do usuário
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    console.log('User:', user, 'Auth Error:', authError) // Debug

    if (authError || !user) {
      return new NextResponse('Usuário não autorizado', { status: 401 })
    }

    // Verificar se o usuário é o autor do comentário
    const { data: comment } = await supabaseAdmin
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single()

    console.log('Comment:', comment) // Debug

    if (!comment) {
      return new NextResponse('Comentário não encontrado', { status: 404 })
    }

    // Apenas o autor do comentário pode editá-lo
    if (comment.author_id !== user.id) {
      return new NextResponse('Você não tem permissão para editar este comentário', { status: 401 })
    }

    const { error } = await supabaseAdmin
      .from('comments')
      .update({ content })
      .eq('id', commentId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error editing comment:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Erro interno do servidor', 
      { status: 500 }
    )
  }
}
