'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'Ocorreu um erro durante a autenticação.'
  if (error === 'Configuration') {
    errorMessage = 'Erro de configuração do servidor.'
  } else if (error === 'AccessDenied') {
    errorMessage = 'Acesso negado. Você não tem permissão para acessar esta página.'
  } else if (error === 'Verification') {
    errorMessage = 'O token de verificação expirou ou já foi usado.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Erro de Autenticação
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            <p className="mb-4">{errorMessage}</p>
            <Link href="/auth/signin">
              <Button>Tentar novamente</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
