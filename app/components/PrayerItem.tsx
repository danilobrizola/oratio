'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

  // Formata o texto do pedido de oração para mostrar apenas as primeiras 200 caracteres
  const truncatedContent = prayer.content.length > 200 
    ? `${prayer.content.slice(0, 200)}...` 
    : prayer.content

  return (
    <div>
      <Link href={`/prayers/${prayer.id}`}>
        <Card className="w-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!prayer.is_anonymous && prayer.author.image ? (
                  <Image
                    src={prayer.author.image}
                    alt={prayer.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {prayer.is_anonymous ? 'A' : prayer.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {prayer.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    Por {prayer.is_anonymous ? 'Anônimo' : prayer.author.name}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-700 mb-6 line-clamp-3">{truncatedContent}</p>
            
            {lastThreeComments.length > 0 && (
              <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Últimos comentários</h4>
                  {comments.length > 3 && (
                    <Link 
                      href={`/prayers/${prayer.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver todos os {comments.length} comentários
                    </Link>
                  )}
                </div>
                
                <div className="space-y-4">
                  {lastThreeComments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      {comment.author?.image ? (
                        <Image
                          src={comment.author.image}
                          alt={comment.author.name}
                          width={24}
                          height={24}
                          className="rounded-full mt-1"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                          <span className="text-gray-500 text-xs">
                            {comment.author.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {comment.author.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
