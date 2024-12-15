'use client'

import { useState } from 'react'
import { Button, Input, Label, Switch, Textarea } from '@/components/ui'
import Toast from './Toast'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'

interface Prayer {
  id: string
  title: string
  content: string
  author_id: string
  created_at: string
  is_anonymous: boolean
  prayer_count: number
}

export default function NewPrayerForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, supabase } = useSupabaseAuth()
  const router = useRouter()

  const validateForm = () => {
    if (!user?.id) {
      setError('Você precisa estar logado para enviar uma oração')
      return false
    }

    if (!title.trim()) {
      setError('Por favor, insira um título')
      return false
    }

    if (!content.trim()) {
      setError('Por favor, insira o conteúdo da oração')
      return false
    }

    if (title.trim().length < 3) {
      setError('O título deve ter pelo menos 3 caracteres')
      return false
    }

    if (content.trim().length < 10) {
      setError('O conteúdo deve ter pelo menos 10 caracteres')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

      // Primeiro, verifica se o usuário existe na tabela users
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (userError || !existingUser) {
        // Se o usuário não existe, cria ele primeiro
        const { error: insertUserError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            image: user.user_metadata?.avatar_url
          })

        if (insertUserError) {
          throw insertUserError
        }
      }

      // Agora insere a oração
      const { data, error: insertError } = await supabase
        .from('prayers')
        .insert([
          {
            title: title.trim(),
            content: content.trim(),
            author_id: user.id,
            is_anonymous: isAnonymous,
            prayer_count: 0
          }
        ])
        .select()

      if (insertError) {
        throw insertError
      }

      setToast({ message: 'Oração enviada com sucesso', type: 'success' })
      setTitle('')
      setContent('')
      setIsAnonymous(false)
      router.refresh()
      router.push('/')
      
    } catch (error: any) {
      setError(error.message)
      setToast({ 
        message: error.message === 'new row violates row-level security policy for table "prayers"'
          ? 'Você não tem permissão para enviar orações. Verifique se você está logado.'
          : error.message,
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da sua oração"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua oração"
          className="min-h-[200px]"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
          disabled={isSubmitting}
        />
        <Label htmlFor="anonymous">Enviar anonimamente</Label>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Oração'}
      </Button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  )
}
