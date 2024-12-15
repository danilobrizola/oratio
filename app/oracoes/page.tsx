'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OracoesPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orações</h1>
        <Link href="/oracoes/nova">
          <Button>Nova Oração</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Aqui virão os cards de orações */}
        <div className="p-4 border rounded-lg shadow-sm">
          <p className="text-gray-600 mb-2">
            Em breve você verá as orações aqui...
          </p>
        </div>
      </div>
    </div>
  )
}
