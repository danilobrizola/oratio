'use client'

import { useState, useMemo } from 'react'
import { PrayerWithAuthorAndComments } from '@/types/supabase'
import PrayerItem from './PrayerItem'
import PrayButton from './PrayButton'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PrayerListProps {
  prayers: PrayerWithAuthorAndComments[]
}

interface LastPrayer {
  id: string
  full_name: string
  image: string | null
}

export default function PrayerList({ prayers }: PrayerListProps) {
  const [showPrayersModal, setShowPrayersModal] = useState(false)
  const [lastPrayers, setLastPrayers] = useState<LastPrayer[]>([])
  const [currentPrayerId, setCurrentPrayerId] = useState<string | null>(null)
  const { user, supabase } = useSupabaseAuth()

  // Filtra as orações não ocultas
  const visiblePrayers = useMemo(() => {
    return prayers.filter(prayer => !prayer.is_hidden)
  }, [prayers])

  const fetchLastPrayers = async (prayerId: string) => {
    try {
      const { data, error } = await supabase
        .from('prayer_counts')
        .select(`
          user_id,
          users!prayer_counts_user_id_fkey (
            id,
            name,
            image
          )
        `)
        .eq('prayer_id', prayerId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      if (data) {
        setLastPrayers(data.map(item => ({
          id: item.users.id,
          full_name: item.users.name,
          image: item.users.image
        })))
      }
    } catch (error) {
      console.error('Erro ao buscar últimas orações:', error)
    }
  }

  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      // toast({
      //   title: "Faça login para criar uma oração",
      //   description: "É necessário fazer login para criar pedidos de oração.",
      //   variant: "destructive",
      // })
      return
    }

    // if (!title.trim() || !content.trim()) {
    //   toast({
    //     title: "Campos obrigatórios",
    //     description: "Por favor, preencha todos os campos.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    try {
      const { data: prayer, error } = await supabase
        .from('prayers')
        .insert([
          {
            // title: title.trim(),
            // content: content.trim(),
            author_id: user.id,
            // is_anonymous: isAnonymous,
          },
        ])
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
        .single()

      if (error) throw error

      // setPrayers(prev => [prayer, ...prev])
      // setTitle('')
      // setContent('')
      // setIsAnonymous(false)
      // setDialogOpen(false)
      // toast({
      //   title: "Oração criada",
      //   description: "Seu pedido de oração foi criado com sucesso!",
      // })

      // Recarregar a página após criar a oração
      window.location.reload()
    } catch (error: any) {
      console.error('Error creating prayer:', error)
      // toast({
      //   title: "Erro ao criar oração",
      //   description: error.message,
      //   variant: "destructive",
      // })
    }
  }

  if (visiblePrayers.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="mb-4 p-4 bg-gray-100 rounded-full">
          🙏
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma oração encontrada
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          Seja o primeiro a compartilhar um pedido de oração. 
          Juntos, podemos criar uma comunidade forte de apoio e intercessão.
        </p>
        {user ? (
          
          <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Compartilhe um pedido de oração agora! ❤️‍🔥
          </p>
        </div>
          
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Faça login para compartilhar seus pedidos de oração!
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {visiblePrayers.map((prayer) => (
          <div key={prayer.id} className="relative">
            <PrayerItem prayer={prayer} />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {prayer.status === 'answered' && (
                <div className="flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                  ✓ Respondida
                </div>
              )}
              <div onClick={(e) => e.stopPropagation()}>
                <PrayButton
                  prayerId={prayer.id}
                  initialPrayerCount={prayer.prayer_count}
                  onPrayerCountChange={(newCount) => {
                    // Atualizar o contador no estado local se necessário
                  }}
                  onShowLastPrayers={async () => {
                    setCurrentPrayerId(prayer.id)
                    await fetchLastPrayers(prayer.id)
                    setShowPrayersModal(true)
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </>
  )
}
