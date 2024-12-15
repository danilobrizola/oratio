import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID não encontrado')
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET não encontrado')
}

function generateUUID() {
  return crypto.randomUUID()
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false
      }

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Verificar se o usuário já existe
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        const userId = existingUser?.id || generateUUID()

        // Sincronizar o usuário na tabela public.users
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: userId,
            email: user.email,
            name: user.name,
            image: user.image
          })

        if (upsertError) {
          console.error('Erro ao sincronizar usuário com tabela users:', upsertError)
          return false
        }

        // Atualizar o ID do usuário para uso no JWT
        user.id = userId

        return true
      } catch (error) {
        console.error('Erro ao sincronizar usuário com Supabase:', error)
        return false
      }
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
        
        try {
          const jwtSecret = process.env.SUPABASE_JWT_SECRET!.replace(/["']/g, '')
          
          // Extrair o ref do URL do Supabase
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
          const ref = supabaseUrl.split('//')[1].split('.')[0]
          
          const payload = {
            iss: 'supabase',
            ref: ref,
            aud: 'authenticated',
            role: 'authenticated',
            sub: session.user.id,
            email: session.user.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
          }
          
          console.log('Payload do JWT:', payload)
          
          const access_token = jwt.sign(
            payload,
            Buffer.from(jwtSecret, 'base64'),
            { 
              algorithm: 'HS256'
            }
          )
          
          session.access_token = access_token
        } catch (error) {
          console.error('Erro ao gerar token JWT:', error)
        }
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
})

export { handler as GET, handler as POST }
