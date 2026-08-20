import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Edit2, Trash2, Phone, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantService } from '@/services'
import type { Client, CreateClientDTO, UpdateClientDTO } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  document: z.string().optional().or(z.literal('')),
})

type ClientForm = z.infer<typeof clientSchema>

export default function TenantClients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  })

  // Fetch clients from API
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await tenantService.getClients()
      return response.data
    },
  })

  const clients = clientsData?.items

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateClientDTO) => {
      const response = await tenantService.createClient(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['tenantDashboardStats'] })
      toast.success('Cliente criado com sucesso!')
      setShowModal(false)
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar cliente')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClientDTO }) => {
      const response = await tenantService.updateClient(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente atualizado com sucesso!')
      setShowModal(false)
      setEditingId(null)
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar cliente')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await tenantService.deleteClient(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['tenantDashboardStats'] })
      toast.success('Cliente excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir cliente')
    },
  })

  const filteredClients = clients?.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  )

  const handleEdit = (client: Client) => {
    setEditingId(client.id)
    setValue('name', client.name)
    setValue('phone', client.phone)
    setValue('email', client.email || '')
    setValue('document', client.document || '')
    setShowModal(true)
  }

  const onSubmit = (data: ClientForm) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Clientes</h1>
          <p className="text-text-muted">Gerencie sua base de clientes</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            reset()
            setShowModal(true)
          }}
          disabled={createMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
          </div>
        ) : filteredClients?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-muted">
            Nenhum cliente encontrado
          </div>
        ) : (
          filteredClients?.map((client) => (
            <motion.div
              key={client.id}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{client.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Phone className="w-3 h-3" />
                      {client.phone}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(client)}
                    disabled={updateMutation.isPending}
                    className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
                        deleteMutation.mutate(client.id)
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {client.email && (
                <div className="flex items-center gap-1 text-sm text-text-muted mb-3">
                  <Mail className="w-3 h-3" />
                  {client.email}
                </div>
              )}

              {client.document && (
                <p className="text-sm text-text-secondary">Documento: {client.document}</p>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {editingId ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome Completo</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome do cliente"
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Telefone</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">E-mail</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="email@cliente.com"
                />
                {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Documento (opcional)</label>
                <input
                  type="text"
                  {...register('document')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="CPF ou CNPJ"
                />
                {errors.document && <p className="text-error text-sm mt-1">{errors.document.message}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
