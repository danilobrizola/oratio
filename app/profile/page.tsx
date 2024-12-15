'use client'

import { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { PrayerWithAuthorAndComments } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const { user, signOut, supabase } = useSupabaseAuth()
  const [prayers, setPrayers] = useState<PrayerWithAuthorAndComments[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerWithAuthorAndComments | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [prayerToDelete, setPrayerToDelete] = useState<PrayerWithAuthorAndComments | null>(null)
  const [testimony, setTestimony] = useState('')
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchUserPrayers = async () => {
      try {
        const { data: prayers, error } = await supabase
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
          `)
          .eq('author_id', user.id)
          .eq('is_hidden', false)
          .order('created_at', { ascending: false })

        if (error) throw error

        setPrayers(prayers || [])
      } catch (error: any) {
        console.error('Error fetching prayers:', error.message)
        toast({
          title: "Erro ao carregar orações",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserPrayers()
  }, [user, supabase, toast])

  const handleMarkAsAnswered = async (prayer: PrayerWithAuthorAndComments) => {
    try {
      const { error } = await supabase
        .from('prayers')
        .update({
          status: 'answered',
          status_message: testimony || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', prayer.id)

      if (error) throw error

      setPrayers(prayers.map(p => 
        p.id === prayer.id 
          ? { ...p, status: 'answered', status_message: testimony || '', updated_at: new Date().toISOString() }
          : p
      ))

      toast({
        title: "Oração atualizada",
        description: "Oração marcada como respondida com sucesso.",
      })

      setDialogOpen(false)
      setTestimony('')
    } catch (error: any) {
      console.error('Erro ao atualizar oração:', error)
      toast({
        title: "Erro ao atualizar oração",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleHidePrayer = async (prayer: PrayerWithAuthorAndComments) => {
    try {
      const { error } = await supabase
        .from('prayers')
        .update({ is_hidden: true })
        .eq('id', prayer.id)

      if (error) throw error

      setPrayers(prayers.filter(p => p.id !== prayer.id))

      toast({
        title: "Oração ocultada",
        description: "A oração foi ocultada com sucesso.",
      })
      
      setDeleteDialogOpen(false)
      setPrayerToDelete(null)
    } catch (error: any) {
      toast({
        title: "Erro ao ocultar oração",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== 'DELETAR') return

    setDeleteLoading(true)

    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao excluir conta')
      }

      // Redirecionar primeiro, depois fazer logout
      router.push('/')
      
      toast({
        title: "Conta excluída",
        description: "Sua conta e todos os dados foram excluídos com sucesso.",
      })

      // Fazer logout por último
      await signOut()
    } catch (error: any) {
      console.error('Erro ao excluir conta:', error)
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setDeleteAccountDialogOpen(false)
      setDeleteConfirmation('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Minhas Orações</h1>
          <Button
            variant="destructive"
            onClick={() => setDeleteAccountDialogOpen(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Excluir minha conta
          </Button>
        </div>
        
        <div className="space-y-6">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-white p-6 rounded-lg shadow-sm border space-y-4"
            >
              <div className="flex items-center justify-between">
                <Link 
                  href={`/prayers/${prayer.id}`}
                  className="text-xl font-semibold hover:text-blue-600 transition-colors"
                >
                  {prayer.title}
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(prayer.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <p className="text-gray-700">{prayer.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {prayer.prayer_count} orações
                  </span>
                  <span className="text-sm text-gray-500">
                    {prayer.comments?.length || 0} comentários
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {prayer.status === 'active' ? (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPrayer(prayer)}
                        >
                          Marcar como Respondida
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Marcar oração como respondida</DialogTitle>
                          <DialogDescription className="pt-4">
                            Compartilhe como Deus respondeu esta oração. Seu testemunho pode fortalecer a fé de outros irmãos! 
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Textarea
                            placeholder="Compartilhe seu testemunho..."
                            value={testimony}
                            onChange={(e) => setTestimony(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setDialogOpen(false)
                              setTestimony('')
                              setSelectedPrayer(null)
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => {
                              if (selectedPrayer) {
                                handleMarkAsAnswered(selectedPrayer)
                              }
                            }}
                          >
                            Confirmar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-green-600 font-medium">✓ Respondida</span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    onClick={() => {
                      setPrayerToDelete(prayer)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {prayers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Você ainda não compartilhou nenhuma oração</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ocultar oração</DialogTitle>
            <DialogDescription className="pt-4">
              Tem certeza que deseja ocultar esta oração? Ela não será mais visível para você nem para outros usuários.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setPrayerToDelete(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (prayerToDelete) {
                  handleHidePrayer(prayerToDelete)
                }
              }}
            >
              Sim, ocultar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de exclusão de conta */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir conta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              <br /><br />
              Digite <strong>DELETAR</strong> para confirmar a exclusão da sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Digite DELETAR"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteAccountDialogOpen(false)
                setDeleteConfirmation('')
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmation !== 'DELETAR' || deleteLoading}
              onClick={handleDeleteAccount}
            >
              {deleteLoading ? 'Excluindo...' : 'Excluir conta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
