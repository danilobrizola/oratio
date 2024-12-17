'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Image from 'next/image'

export default function Header() {
  const { user, signOut, supabase } = useSupabaseAuth()

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex justify-center px-4 py-3">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative">
              <Image
                src="/placeholder-partner.png"
                alt="Logo do Parceiro"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <Link 
              href="/" 
              className="text-2xl md:text-4xl font-bold text-gray-800 group relative hover:opacity-80 transition-opacity"
            >
              <span>Oratio 🙏🏻</span>
              <span className="absolute -bottom-4 left-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                orando uns pelos outros
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                {user.user_metadata?.avatar_url && (
                  <Link href="/profile">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Avatar do usuário"
                      width={32}
                      height={32}
                      className="rounded-full hidden sm:block hover:opacity-80 transition-opacity"
                    />
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className="text-sm text-gray-600 hidden sm:block hover:text-gray-900 transition-colors"
                >
                  Olá, {user.user_metadata?.full_name || 'Usuário'}
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="text-sm"
                  size="sm"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                className="flex items-center gap-2"
                size="sm"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 hidden sm:block">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <span className="sm:block">Entrar</span>
                <span className="hidden sm:inline">com Google</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
