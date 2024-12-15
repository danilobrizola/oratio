import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prayerId = params.id

  if (!prayerId) {
    return NextResponse.json({ error: 'Prayer ID is required' }, { status: 400 })
  }

  try {
    // Primeiro, pegamos o valor atual
    const { data: currentPrayer, error: fetchError } = await supabase
      .from('prayers')
      .select('prayer_count')
      .eq('id', prayerId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch prayer' },
        { status: 500 }
      )
    }

    // Agora atualizamos com o novo valor
    const { data, error } = await supabase
      .from('prayers')
      .update({ prayer_count: (currentPrayer?.prayer_count || 0) + 1 })
      .eq('id', prayerId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update pray count' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
