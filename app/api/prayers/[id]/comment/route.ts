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
  const { content } = await request.json()

  if (!prayerId) {
    return NextResponse.json({ error: 'Prayer ID is required' }, { status: 400 })
  }

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        content,
        prayer_id: prayerId,
        author_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

