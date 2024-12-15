'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { PrayerWithAuthorAndComments } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import PrayButton from '../../components/PrayButton'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PrayerPage() {
  const params = useParams()
  const { user } = useSupabaseAuth()
  const [prayer, setPrayer] = useState<PrayerWithAuthorAndComments | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [hasPrayed, setHasPrayed] = useState(false)
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showPrayersModal, setShowPrayersModal] = useState(false)
  const [lastPrayers, setLastPrayers] = useState<Array<{
    id: string
    full_name: string
    image: string
  }>>([])

  const fetchLastPrayers = async () => {
    const { data } = await supabase
      .from('prayer_counts')
      .select(`
        user_id,
        users!prayer_counts_user_id_fkey (
          id,
          name,
          image
        )
      `)
      .eq('prayer_id', prayer.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setLastPrayers(data.map(item => ({
        id: item.users.id,
        full_name: item.users.name,
        image: item.users.image
      })))
    }
  }

  const handlePray = async () => {
    if (!user || !prayer) return

    try {
      const { error: countError } = await supabase
        .from('prayer_counts')
        .insert([
          {
            prayer_id: prayer.id,
            user_id: user.id,
          },
        ])

      if (countError) throw countError

      // Atualizar contador de orações
      const { error: updateError } = await supabase
        .rpc('increment_prayer_count', {
          prayer_id: prayer.id,
        })

      if (updateError) throw updateError

      setPrayer(prev => prev ? {
        ...prev,
        prayer_count: prev.prayer_count + 1
      } : null)
      setHasPrayed(true)
      toast({
        title: "Oração registrada",
        description: "Obrigado por orar por este pedido!",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao registrar oração",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handlePrayClick = async () => {
    if (!user || !prayer) {
      toast({
        title: "Faça login para orar",
        description: "É necessário fazer login para interagir com as orações.",
      })
      return
    }

    if (hasPrayed) {
      await fetchLastPrayers()
      setShowPrayersModal(true)
      return
    }

    try {
      // Inserir na tabela prayer_counts
      const { error: countError } = await supabase
        .from('prayer_counts')
        .insert([
          {
            prayer_id: prayer.id,
            user_id: user.id,
          },
        ])

      if (countError) throw countError

      // Atualizar contador de orações
      const { error: updateError } = await supabase
        .rpc('increment_prayer_count', {
          prayer_id: prayer.id,
        })

      if (updateError) throw updateError

      setHasPrayed(true)
      setPrayer(prev => prev ? {
        ...prev,
        prayer_count: prev.prayer_count + 1
      } : null)
      
      toast({
        title: "Amém! ",
        description: "Sua oração foi registrada.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua oração.",
        variant: "destructive",
      })
    }
  }

  const handleComment = async () => {
    if (!user || !prayer || !newComment.trim()) return

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prayer_id: prayer.id,
          content: newComment.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const comment = await response.json()

      setPrayer(prev => prev ? {
        ...prev,
        comments: [...prev.comments, comment]
      } : null)
      setNewComment('')
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso!",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar comentário",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        const { data: prayer, error } = await supabase
          .from('prayers')
          .select(`
            *,
            author:users!author_id (
              id,
              name,
              email,
              image
            ),
            comments (
              id,
              content,
              created_at,
              author:users!author_id (
                name,
                image
              )
            )
          `)
          .eq('id', params.id)
          .single()

        if (error) throw error

        // Ordenar comentários do mais recente para o mais antigo
        if (prayer.comments) {
          prayer.comments.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        }

        setPrayer(prayer)
      } catch (error: any) {
        console.error('Error fetching prayer:', error)
        toast({
          title: "Erro ao carregar oração",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPrayer()
  }, [params.id, supabase, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (!prayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Oração não encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            {!prayer.is_anonymous && prayer.author.image ? (
              <Image
                src={prayer.author.image}
                alt={prayer.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-lg">
                  {prayer.is_anonymous ? 'A' : prayer.author.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{prayer.title}</h1>
              <p className="text-gray-600">
                Por {prayer.is_anonymous ? 'Anônimo' : prayer.author.name} • {' '}
                {formatDistanceToNow(new Date(prayer.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-6 whitespace-pre-wrap">{prayer.content}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PrayButton
                prayerId={prayer.id}
                initialPrayerCount={prayer.prayer_count}
                onPrayerCountChange={(newCount) => {
                  setPrayer(prev => prev ? {
                    ...prev,
                    prayer_count: newCount
                  } : null)
                }}
                onShowLastPrayers={async () => {
                  await fetchLastPrayers()
                  setShowPrayersModal(true)
                }}
              />
            </div>
            {prayer.status === 'answered' && (
              <div className="flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                ✓ Oração respondida
              </div>
            )}
          </div>

          {prayer.status === 'answered' && prayer.status_message && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Testemunho</h3>
              <p className="text-green-700 whitespace-pre-wrap">{prayer.status_message}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Comentários</h2>

          {user ? (
            <div className="mb-8">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Deixe seu comentário..."
                className="mb-4"
              />
              <Button 
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                Comentar
              </Button>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                Faça login para deixar um comentário
              </p>
            </div>
          )}

          <div className="space-y-6">
            {prayer.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                {comment.author?.image ? (
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={comment.author.image}
                      alt={comment.author.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500">
                      {comment.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showPrayersModal} onOpenChange={setShowPrayersModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Últimas pessoas que oraram</DialogTitle>
            <DialogDescription>
              Estas são as últimas pessoas que intercederam por este pedido
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {lastPrayers.map((prayer) => (
              <div key={prayer.id} className="flex items-center gap-3">
                {prayer.image ? (
                  <Image
                    src={prayer.image}
                    alt={prayer.full_name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {prayer.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="font-medium">{prayer.full_name}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
