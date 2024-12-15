'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PrayerWithAuthorAndComments } from '@/types/supabase'
import PrayerList from './components/PrayerList'
import NewPrayerForm from './components/NewPrayerForm'
import Pagination from './components/Pagination'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'

const ITEMS_PER_PAGE = 10

export const revalidate = 0 // desabilita o cache da página

export default function Home() {
  const { user } = useSupabaseAuth()
  const [prayers, setPrayers] = useState<PrayerWithAuthorAndComments[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrayers() {
      try {
        const from = (currentPage - 1) * ITEMS_PER_PAGE
        const to = from + ITEMS_PER_PAGE - 1

        const { data, error, count } = await supabase
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
              author_id,
              created_at,
              author:users!author_id (
                name,
                image
              )
            )
          `, { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to)

        if (error) throw error

        setPrayers(data || [])
        setTotalCount(count || 0)
      } catch (error) {
        console.error('Erro ao carregar orações:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrayers()
  }, [currentPage])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {user && (
            <Suspense fallback={<div>Carregando formulário...</div>}>
              <NewPrayerForm />
            </Suspense>
          )}
          
          <Suspense fallback={<div>Carregando orações...</div>}>
            {loading ? (
              <div>Carregando orações...</div>
            ) : (
              <PrayerList prayers={prayers} />
            )}
          </Suspense>

          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
    </div>
  )
}
