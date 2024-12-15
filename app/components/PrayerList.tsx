'use client'

import { PrayerWithAuthorAndComments } from '@/types/supabase'
import PrayerItem from './PrayerItem'

interface PrayerListProps {
  prayers: PrayerWithAuthorAndComments[]
}

export default function PrayerList({ prayers }: PrayerListProps) {
  if (prayers.length === 0) {
    return <div>Nenhuma oração encontrada.</div>
  }

  return (
    <div className="space-y-6">
      {prayers.map((prayer) => (
        <PrayerItem key={prayer.id} prayer={prayer} />
      ))}
    </div>
  )
}
