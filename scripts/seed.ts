import './loadEnv'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL não encontrado no .env.local')
if (!supabaseKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não encontrado no .env.local')

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Função para gerar UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const user1Id = generateUUID()
const user2Id = generateUUID()
const prayer1Id = generateUUID()
const prayer2Id = generateUUID()
const comment1Id = generateUUID()
const comment2Id = generateUUID()

const users = [
  {
    id: user1Id,
    name: 'João Silva',
    email: 'joao@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=João',
    created_at: new Date().toISOString()
  },
  {
    id: user2Id,
    name: 'Maria Santos',
    email: 'maria@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    created_at: new Date().toISOString()
  }
]

const prayers = [
  {
    id: prayer1Id,
    title: 'Oração pela família',
    content: 'Senhor, abençoe minha família e nos mantenha unidos em seu amor.',
    author_id: user1Id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
    prayer_count: 0
  },
  {
    id: prayer2Id,
    title: 'Gratidão pela saúde',
    content: 'Agradeço a Deus pela saúde e proteção durante este ano.',
    author_id: user2Id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
    prayer_count: 0
  }
]

const comments = [
  {
    id: comment1Id,
    content: 'Amém! Estou orando junto com você.',
    author_id: user2Id,
    prayer_id: prayer1Id,
    created_at: new Date().toISOString()
  },
  {
    id: comment2Id,
    content: 'Que Deus continue te abençoando!',
    author_id: user1Id,
    prayer_id: prayer2Id,
    created_at: new Date().toISOString()
  }
]

async function seed() {
  try {
    // Limpar dados existentes
    console.log('Limpando dados existentes...')
    await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('prayers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Inserir usuários
    console.log('Inserindo usuários...')
    const { error: usersError } = await supabase
      .from('users')
      .insert(users)
    
    if (usersError) {
      throw new Error(`Erro ao inserir usuários: ${usersError.message}`)
    }

    // Inserir orações
    console.log('Inserindo orações...')
    const { error: prayersError } = await supabase
      .from('prayers')
      .insert(prayers)
    
    if (prayersError) {
      throw new Error(`Erro ao inserir orações: ${prayersError.message}`)
    }

    // Inserir comentários
    console.log('Inserindo comentários...')
    const { error: commentsError } = await supabase
      .from('comments')
      .insert(comments)
    
    if (commentsError) {
      throw new Error(`Erro ao inserir comentários: ${commentsError.message}`)
    }

    console.log('Dados inseridos com sucesso!')
  } catch (error) {
    console.error('Erro ao fazer seed:', error)
  }
}

seed()
