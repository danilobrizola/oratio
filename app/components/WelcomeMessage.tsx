'use client'

import { Button } from '@/components/ui/button'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'

export default function WelcomeMessage() {
  const { user } = useSupabaseAuth()

  if (user) return null

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-5xl bg-blue-50 p-6 rounded-lg shadow-sm mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Bem-vindo ao Oratio 🙏🏻
        </h2>
        <p className="text-blue-800 mb-4">
          Sinta-se à vontade para acompanhar e orar pelos pedidos listados abaixo.
          Para interagir, compartilhar seus próprios pedidos e enviar palavras de encorajamento,
          faça login com sua conta Google.
        </p>
        <p className="text-sm text-yellow-700 mt-3">
          Utilizamos o login do Google para manter nossa comunidade segura e protegida.
        </p>
      </div>
    </div>
  )
}
