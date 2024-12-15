'use client'

import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

interface PrayButtonProps {
  prayerId: string
  initialPrayerCount: number
  onPrayerCountChange?: (newCount: number) => void
  onShowLastPrayers?: () => void
}

export default function PrayButton({ 
  prayerId, 
  initialPrayerCount,
  onPrayerCountChange,
  onShowLastPrayers
}: PrayButtonProps) {
  const [prayCount, setPrayCount] = useState(initialPrayerCount)
  const [hasPrayed, setHasPrayed] = useState(false)
  const { user, supabase } = useSupabaseAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user?.id) {
      checkIfUserHasPrayed()
    }
  }, [user, prayerId])

  const checkIfUserHasPrayed = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('prayer_counts')
        .select('id')
        .eq('prayer_id', prayerId)
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

  const handlePrayClick = async () => {
    if (!user) {
      toast({
        title: "Faça login para orar",
        description: "É necessário fazer login para interagir com as orações.",
      })
      return
    }

    if (hasPrayed) {
      onShowLastPrayers?.()
      return
    }

    try {
      const { error: countError } = await supabase
        .from('prayer_counts')
        .insert([
          {
            prayer_id: prayerId,
            user_id: user.id,
          },
        ])

      if (countError) throw countError

      const { error: updateError } = await supabase
        .rpc('increment_prayer_count', {
          prayer_id: prayerId,
        })

      if (updateError) throw updateError

      const newCount = prayCount + 1
      setPrayCount(newCount)
      setHasPrayed(true)
      onPrayerCountChange?.(newCount)
      
      toast({
        title: "Amém! 🙏🏻",
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

  return (
    <Button
      onClick={handlePrayClick}
      className={`flex items-center space-x-2 ${
        hasPrayed
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      variant="ghost"
    >
      <span>🙏</span>
      <span>{prayCount}</span>
    </Button>
  )
}
