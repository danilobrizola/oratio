import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Excluir comentários
    const { error: commentsError } = await supabase
      .from('comments')
      .delete()
      .eq('author_id', user.id)

    if (commentsError) throw commentsError

    // Excluir prayer_counts
    const { error: countsError } = await supabase
      .from('prayer_counts')
      .delete()
      .eq('user_id', user.id)

    if (countsError) throw countsError

    // Excluir orações
    const { error: prayersError } = await supabase
      .from('prayers')
      .delete()
      .eq('author_id', user.id)

    if (prayersError) throw prayersError

    // Excluir usuário da tabela users
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)

    if (userError) throw userError

    // Excluir a conta do Supabase Auth usando o cliente admin
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (authError) throw authError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
