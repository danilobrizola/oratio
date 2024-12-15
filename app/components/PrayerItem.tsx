'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Toast from './Toast'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Image from 'next/image'

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
}

interface PrayerItemProps {
  prayer: Prayer
}

export default function PrayerItem({ prayer }: PrayerItemProps) {
  const [prayCount, setPrayCount] = useState(prayer.prayer_count || 0)
  const [hasPrayed, setHasPrayed] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>(prayer.comments || [])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
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
      setToast({ message: 'Você precisa estar logado para orar', type: 'error' })
      return
    }

    if (hasPrayed) {
      setToast({ message: 'Você já orou por este pedido', type: 'error' })
      return
    }

    try {
      const { error: countError } = await supabase
        .from('prayer_counts')
        .insert({
          prayer_id: prayer.id,
          user_id: user.id
        })

      if (countError) {
        if (countError.code === '23505') {
          setToast({ message: 'Você já orou por este pedido', type: 'error' })
          return
        }
        throw countError
      }

      const { error: updateError } = await supabase
        .rpc('increment_prayer_count', {
          prayer_id: prayer.id
        })

      if (updateError) throw updateError

      setPrayCount(prev => prev + 1)
      setHasPrayed(true)
      setToast({ message: 'Oração registrada com sucesso!', type: 'success' })
    } catch (error: any) {
      setToast({ message: error.message || 'Erro ao registrar oração', type: 'error' })
    }
  }

  const handleComment = async () => {
    if (!user) {
      setToast({ message: 'Você precisa estar logado para comentar', type: 'error' })
      return
    }

    if (!newComment.trim()) {
      setToast({ message: 'O comentário não pode estar vazio', type: 'error' })
      return
    }

    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          prayer_id: prayer.id,
          author_id: user.id,
          content: newComment.trim()
        })
        .select(`
          id,
          content,
          created_at,
          author: users!author_id (
            name,
            image
          )
        `)
        .single()

      if (error) {
        setHasPrayed(false)
        return
      }

      setComments(prev => [...prev, comment])
      setNewComment('')
      setToast({ message: 'Comentário adicionado com sucesso!', type: 'success' })
    } catch (error: any) {
      setToast({ message: error.message || 'Erro ao adicionar comentário', type: 'error' })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{prayer.title}</h3>
          <p className="text-gray-600 mb-4">{prayer.content}</p>
          <div className="flex items-center gap-2">
            {!prayer.is_anonymous && prayer.author?.image && (
              <Image
                src={prayer.author.image}
                alt={prayer.author.name || 'Autor'}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <p className="text-sm text-gray-500">
              {prayer.is_anonymous
                ? 'Anônimo'
                : `Por ${prayer.author?.name || 'Usuário desconhecido'}`}
            </p>
          </div>
        </div>
        {user && (
          <button
            onClick={handlePray}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              hasPrayed
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>🙏</span>
            <span>{prayCount}</span>
          </button>
        )}
        {!user && prayCount > 0 && (
          <div className="flex items-center space-x-2 px-4 py-2">
            <span>🙏</span>
            <span>{prayCount}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Comentários ({comments.length})</h4>
        {user && (
          <form onSubmit={(e) => e.preventDefault()} className="mb-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={handleComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Enviar
              </Button>
            </div>
          </form>
        )}
        {!user && comments.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum comentário ainda</p>
        )}
        {(user || comments.length > 0) && (
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  {comment.author?.image && (
                    <Image
                      src={comment.author.image}
                      alt={comment.author.name || 'Autor do comentário'}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <p className="text-sm text-gray-500">
                    {comment.author?.name || 'Usuário desconhecido'}
                  </p>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
