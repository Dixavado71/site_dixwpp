import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Search, MoreVertical, Edit2, Trash2, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services'
import type { Tenant, CreateTenantDTO, UpdateTenantDTO } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const tenantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().min(1, 'Documento é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  active: z.boolean(),
})

type TenantForm = z.infer<typeof tenantSchema>

export default function AdminTenants() {
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
  } = useForm<TenantForm>({
    resolver: zodResolver(tenantSchema),
  })

  // Fetch tenants from API
  const { data: tenantsData, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await adminService.getTenants()
      return response.data
    },
  })

  const tenants = tenantsData?.items

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateTenantDTO) => {
      const response = await adminService.createTenant(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] })
      toast.success('Tenant criado com sucesso!')
      setShowModal(false)
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar tenant')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTenantDTO }) => {
      const response = await adminService.updateTenant(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      toast.success('Tenant atualizado com sucesso!')
      setShowModal(false)
      setEditingId(null)
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar tenant')
    },
  })

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await adminService.toggleTenantStatus(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] })
      toast.success('Status do tenant atualizado!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar status')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminService.deleteTenant(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] })
      toast.success('Tenant excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir tenant')
    },
  })

  const filteredTenants = tenants?.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.document.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (tenant: Tenant) => {
    setEditingId(tenant.id)
    setValue('name', tenant.name)
    setValue('document', tenant.document)
    setValue('email', tenant.email)
    setValue('phone', tenant.phone)
    setValue('active', tenant.active)
    setShowModal(true)
  }

  const onSubmit = (data: TenantForm) => {
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Tenants</h1>
          <p className="text-text-muted">Gerencie todos os tenants do sistema</p>
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
          Novo Tenant
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
              placeholder="Buscar por nome ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Tenants Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
          </div>
        ) : filteredTenants?.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            Nenhum tenant encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-4 px-6 text-text-muted font-medium">Nome</th>
                  <th className="text-left py-4 px-6 text-text-muted font-medium">Documento</th>
                  <th className="text-left py-4 px-6 text-text-muted font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-text-muted font-medium">Telefone</th>
                  <th className="text-left py-4 px-6 text-text-muted font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-text-muted font-medium">Data Criação</th>
                  <th className="text-right py-4 px-6 text-text-muted font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants?.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-text-primary font-medium">{tenant.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">{tenant.document}</td>
                    <td className="py-4 px-6 text-text-secondary">{tenant.email}</td>
                    <td className="py-4 px-6 text-text-secondary">{tenant.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                        tenant.active
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'bg-error/10 text-error'
                      }`}>
                        {tenant.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {tenant.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-muted">
                      {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(tenant)}
                          disabled={updateMutation.isPending}
                          className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleMutation.mutate(tenant.id)}
                          disabled={toggleMutation.isPending}
                          className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-accent-secondary transition-colors disabled:opacity-50"
                        >
                          {tenant.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja excluir o tenant ${tenant.name}?`)) {
                              deleteMutation.mutate(tenant.id)
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              {editingId ? 'Editar Tenant' : 'Novo Tenant'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome do tenant"
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Documento</label>
                <input
                  type="text"
                  {...register('document')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="CNPJ ou CPF"
                />
                {errors.document && <p className="text-error text-sm mt-1">{errors.document.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">E-mail</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="email@empresa.com"
                />
                {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
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
