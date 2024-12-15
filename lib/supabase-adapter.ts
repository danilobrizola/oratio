import { createClient } from '@supabase/supabase-js'
import { Adapter, AdapterAccount } from 'next-auth/adapters'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL está faltando')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY está faltando')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)

export default {
  async createUser(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email: user.email,
          name: user.name,
          image: user.image,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUser(id) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()

    if (error) return null
    return data
  },

  async getUserByAccount({ providerAccountId, provider }) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*, users(*)')
      .eq('provider_account_id', providerAccountId)
      .eq('provider', provider)
      .single()

    if (error || !data?.users) return null
    return data.users
  },

  async updateUser(user) {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: user.name,
        email: user.email,
        image: user.image,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async linkAccount(account) {
    const { data, error } = await supabase.from('accounts').insert([
      {
        user_id: account.userId,
        type: account.type,
        provider: account.provider,
        provider_account_id: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      },
    ])

    if (error) throw error
    return data
  },

  async createSession(session) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          user_id: session.userId,
          expires: new Date(session.expires).toISOString(),
          session_token: session.sessionToken,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return {
      ...data,
      expires: new Date(data.expires),
    }
  },

  async getSessionAndUser(sessionToken) {
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, users(*)')
      .eq('session_token', sessionToken)
      .single()

    if (sessionError) return null
    if (!session) return null

    const { users: user, ...sessionData } = session

    return {
      session: {
        ...sessionData,
        expires: new Date(sessionData.expires),
      },
      user,
    }
  },

  async updateSession(session) {
    const { data, error } = await supabase
      .from('sessions')
      .update({
        expires: new Date(session.expires).toISOString(),
      })
      .eq('session_token', session.sessionToken)
      .select()
      .single()

    if (error) throw error
    return {
      ...data,
      expires: new Date(data.expires),
    }
  },

  async deleteSession(sessionToken) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken)

    if (error) throw error
  },

  async createVerificationToken(token) {
    const { data, error } = await supabase
      .from('verification_tokens')
      .insert([
        {
          identifier: token.identifier,
          token: token.token,
          expires: new Date(token.expires).toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return {
      ...data,
      expires: new Date(data.expires),
    }
  },

  async useVerificationToken({ identifier, token }) {
    const { data, error } = await supabase
      .from('verification_tokens')
      .delete()
      .match({ identifier, token })
      .select()
      .single()

    if (error) return null
    return data ? {
      ...data,
      expires: new Date(data.expires),
    } : null
  },
} satisfies Adapter
