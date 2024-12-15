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
      const { data: comment, error } = await supabase
        .from('comments')
        .insert([
          {
            prayer_id: prayer.id,
            author_id: user.id,
            content: newComment.trim(),
          },
        ])
        .select(`
          id,
          content,
          created_at,
          author:users!author_id (
            name,
            image
          )
        `)
        .single()

      if (error) throw error

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
    async function fetchPrayer() {
      try {
        const { data: prayerData, error: prayerError } = await supabase
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

        if (prayerError) throw prayerError

        setPrayer(prayerData)

        // Verificar se o usuário já orou
        if (user) {
          const { data: prayerCount, error: countError } = await supabase
            .from('prayer_counts')
            .select('id')
            .eq('prayer_id', params.id)
            .eq('user_id', user.id)
            .maybeSingle()

          if (!countError && prayerCount) {
            setHasPrayed(true)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPrayer()
    }
  }, [params.id, user])

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
        {prayer.status === 'answered' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700 font-medium mb-2">
              <span className="mr-2">✨</span>
              Esta oração foi respondida!
            </div>
            <p className="text-green-600 text-sm">
              O autor poderá compartilhar nos comentários como Deus respondeu esta oração. 
              Você ainda pode orar e comentar neste pedido para fortalecer nossa comunidade em oração.
            </p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {prayer.is_anonymous ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">A</span>
                </div>
              ) : prayer.author?.image ? (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={prayer.author.image}
                    alt={prayer.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    {prayer.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{prayer.title}</h1>
                <p className="text-sm text-gray-500">
                  por {prayer.is_anonymous ? 'Anônimo' : prayer.author?.name} • {' '}
                  {new Date(prayer.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            {prayer.status === 'answered' && (
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">✓ Respondida</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                >
                  Ver testemunho
                </Button>
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <p className="text-gray-700 whitespace-pre-wrap">{prayer.content}</p>

          {/* Ações */}
          <div className="flex items-center gap-4 pt-4 border-t">
            {user && (
              <PrayButton
                prayerId={prayer.id}
                initialPrayerCount={prayer.prayer_count}
                onPrayerCountChange={(newCount) => 
                  setPrayer(prev => prev ? { ...prev, prayer_count: newCount } : null)
                }
                onShowLastPrayers={async () => {
                  await fetchLastPrayers()
                  setShowPrayersModal(true)
                }}
              />
            )}
            {!user && prayer.prayer_count > 0 && (
              <div className="flex items-center space-x-2 px-4 py-2">
                <span>🙏</span>
                <span>{prayer.prayer_count}</span>
              </div>
            )}
          </div>

          {/* Seção de comentários */}
          <div className="space-y-6 pt-6 border-t">
            <h2 className="text-lg font-semibold">Comentários</h2>
            
            {user && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Compartilhe uma palavra de encorajamento..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleComment} disabled={!newComment.trim()}>
                  Comentar
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {prayer.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  {comment.author?.image ? (
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={comment.author.image}
                        alt={`Foto de ${comment.author.name}`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {comment.author.name === 'Anônimo' ? 'A' : comment.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{comment.author?.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}

              {prayer.comments?.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog do testemunho */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Testemunho da Oração</DialogTitle>
            <DialogDescription className="pt-4">
              {prayer.status_message || 
                "Uma oração respondida é aquela também que muitas vezes nosso Deus não fala. " +
                "O silêncio ou o acontecimento de algo que era diferente daquilo que esperávamos também é uma resposta. " +
                "Saiba que Ele conhece todas as coisas e a vontade dEle é boa perfeita e agradável."
              }
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Dialog de últimas orações */}
      <Dialog open={showPrayersModal} onOpenChange={setShowPrayersModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pessoas que oraram por este pedido</DialogTitle>
            <DialogDescription>
              As últimas pessoas que se juntaram em oração
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {lastPrayers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.full_name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{user.full_name}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
