'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Image from 'next/image'
import Link from 'next/link'
import PrayButton from './PrayButton'

interface Comment {
  id: string
  content: string
  author: {
    name: string
    image: string
  }
  created_at: string
}

interface Prayer {
  id: string
  title: string
  content: string
  author: {
    name: string
    image: string
  }
  is_anonymous: boolean
  prayer_count: number
  comments: Comment[]
  answered: boolean
}

interface PrayerItemProps {
  prayer: Prayer
}

export default function PrayerItem({ prayer }: PrayerItemProps) {
  const [prayCount, setPrayCount] = useState(prayer.prayer_count || 0)
  const [hasPrayed, setHasPrayed] = useState(false)
  const [comments, setComments] = useState<Comment[]>(prayer.comments || [])
  const { user, supabase } = useSupabaseAuth()
  
  useEffect(() => {
    if (user?.id) {
      checkIfUserHasPrayed()
    }
  }, [user, prayer.id])

  const checkIfUserHasPrayed = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('prayer_counts')
        .select('id')
        .eq('prayer_id', prayer.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        setHasPrayed(false)
        return
      }

      setHasPrayed(!!data)
    } catch (error) {
      setHasPrayed(false)
    }
  }

  const handlePray = async () => {
    if (!user) {
      return
    }

    if (hasPrayed) {
      return
    }

    try {
      const { error: countError } = await supabase
        .from('prayer_counts')
        .insert({
          prayer_id: prayer.id,
          user_id: user.id
        })

      if (countError) throw countError

      const { error: updateError } = await supabase
        .rpc('increment_prayer_count', {
          prayer_id: prayer.id,
        })

      if (updateError) throw updateError

      setPrayCount(prev => prev + 1)
      setHasPrayed(true)
    } catch (error: any) {
      console.error('Erro ao orar:', error.message)
    }
  }

  // Pega os últimos 3 comentários, ordenados do mais recente para o mais antigo
  const lastThreeComments = [...comments]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return (
    <div>
      <Link href={`/prayers/${prayer.id}`}>
        <Card className="w-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!prayer.is_anonymous && prayer.author.image && (
                  <Image
                    src={prayer.author.image}
                    alt={prayer.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {prayer.title}
                    {prayer.answered && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        Oração Respondida 🙏
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Por {prayer.is_anonymous ? 'Anônimo' : prayer.author.name}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{prayer.content}</p>
            
            {lastThreeComments.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-medium text-gray-900">Últimos comentários</h4>
                {lastThreeComments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2 text-sm">
                    {comment.author?.image && (
                      <Image
                        src={comment.author.image}
                        alt={comment.author.name}
                        width={24}
                        height={24}
                        className="rounded-full mt-1"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{comment.author.name}</p>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {comments.length > 3 && (
                  <p className="text-sm text-gray-500">
                    Ver mais {comments.length - 3} comentário{comments.length - 3 !== 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
      
      <div className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
        {user ? (
          <PrayButton
            prayerId={prayer.id}
            initialPrayerCount={prayer.prayer_count}
            onPrayerCountChange={(newCount) => setPrayCount(newCount)}
          />
        ) : (
          <div className="flex items-center space-x-2 px-4 py-2">
            <span>🙏</span>
            <span>{prayCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}
