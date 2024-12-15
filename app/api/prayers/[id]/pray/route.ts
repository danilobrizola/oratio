import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from "next-auth/next"

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
    const { data, error } = await supabase
      .from('prayers')
      .update({ pray_count: supabase.raw('pray_count + 1') })
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
    return NextResponse.json({ error: 'Failed to update pray count' }, { status: 500 })
  }
}
