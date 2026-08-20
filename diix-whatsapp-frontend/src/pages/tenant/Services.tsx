import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Plus, Clock, DollarSign, Edit2, Trash2, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantService } from '../../services'
import type { Service as IService, CreateServiceDTO, UpdateServiceDTO } from '../../types'
import { z } from 'zod'

// Zod schema para validação de serviços
const serviceSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  duration: z.number().int().positive('Duração deve ser maior que zero'),
  isActive: z.boolean().default(true)
})

type ServiceFormData = z.infer<typeof serviceSchema>

// Formatador de moeda BRL
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Parser de string monetária para número
const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
}

export default function TenantServices() {
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<IService | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const queryClient = useQueryClient()

  // Query para listar serviços
  const { data: servicesData, isLoading, error } = useQuery({
    queryKey: ['tenant-services'],
    queryFn: async () => {
      const response = await tenantService.getServices()
      // A API pode retornar array direto ou objeto com data.services
      if (Array.isArray(response)) {
        return response
      }
      // Se for um objeto, tenta acessar response.data ou response diretamente
      const result = response as any
      if (result?.data?.services) {
        return result.data.services
      }
      if (result?.services) {
        return result.services
      }
      return []
    }
  })

  // Mutation para criar serviço
  const createMutation = useMutation({
    mutationFn: async (data: CreateServiceDTO) => {
      const response = await tenantService.createService(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-services'] })
      toast.success('Serviço criado com sucesso!')
      setShowModal(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar serviço')
    }
  })

  // Mutation para atualizar serviço
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateServiceDTO }) => {
      const response = await tenantService.updateService(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-services'] })
      toast.success('Serviço atualizado com sucesso!')
      setShowModal(false)
      setEditingService(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar serviço')
    }
  })

  // Mutation para excluir serviço
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await tenantService.deleteService(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-services'] })
      toast.success('Serviço excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir serviço')
    }
  })

  // Filtrar serviços
  const filteredServices = (servicesData || []).filter((service: IService) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? true : // API não retorna campo active, considerar todos como ativos
      statusFilter === 'inactive' ? false : true
    return matchesSearch && matchesStatus
  })

  const handleOpenModal = (service?: IService) => {
    if (service) {
      setEditingService(service)
    } else {
      setEditingService(null)
    }
    setShowModal(true)
  }

  const handleDelete = (service: IService) => {
    toast(`Tem certeza que deseja excluir o serviço "${service.name}"?`, {
      action: {
        label: 'Excluir',
        onClick: () => deleteMutation.mutate(service.id)
      },
      duration: 10000
    })
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Serviços</h1>
          <p className="text-text-muted">Gerencie seus serviços prestados</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card rounded-xl p-6 text-center text-error">
          <p>Erro ao carregar serviços: {(error as any).message}</p>
        </div>
      )}

      {/* Services List */}
      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredServices.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Nenhum serviço encontrado</h3>
              <p className="text-text-muted mb-4">Comece cadastrando seu primeiro serviço</p>
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity"
              >
                Cadastrar Serviço
              </button>
            </div>
          ) : (
            filteredServices.map((service: IService) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center neon-glow-purple">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-1">{service.name}</h3>
                      {service.description && (
                        <p className="text-text-secondary text-sm mb-2">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration} minutos
                        </div>
                        <div className="flex items-center gap-1 text-accent-primary font-bold">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(service.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(service)}
                      className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowModal(false)
            setEditingService(null)
          }}
          onCreate={(data) => createMutation.mutate(data)}
          onUpdate={(id, data) => updateMutation.mutate({ id, data })}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  )
}

// Componente do Modal
function ServiceModal({
  service,
  onClose,
  onCreate,
  onUpdate,
  isLoading
}: {
  service: IService | null
  onClose: () => void
  onCreate: (data: CreateServiceDTO) => void
  onUpdate: (id: string, data: UpdateServiceDTO) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || 0,
    duration: service?.duration || 60,
    isActive: true
  })
  const [priceInput, setPriceInput] = useState(service ? formatCurrency(service.price) : '')
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar com Zod
    const result = serviceSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: any = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ServiceFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      duration: formData.duration
    }

    if (service) {
      onUpdate(service.id, payload)
    } else {
      onCreate(payload)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPriceInput(value)
    const numericValue = parseCurrency(value)
    setFormData(prev => ({ ...prev, price: numericValue }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          {service ? 'Editar Serviço' : 'Novo Serviço'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-2">Nome do Serviço</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.name ? 'border-error' : 'border-white/10'} text-text-primary focus:outline-none focus:border-accent-primary/50`}
              placeholder="Ex: Consultoria Técnica"
            />
            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">Descrição</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 resize-none"
              placeholder="Descrição detalhada do serviço"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">Duração (minutos)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.duration ? 'border-error' : 'border-white/10'} text-text-primary focus:outline-none focus:border-accent-primary/50`}
                placeholder="60"
                min="1"
              />
              {errors.duration && <p className="text-xs text-error mt-1">{errors.duration}</p>}
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Preço</label>
              <input
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.price ? 'border-error' : 'border-white/10'} text-text-primary focus:outline-none focus:border-accent-primary/50`}
                placeholder="R$ 0,00"
              />
              {errors.price && <p className="text-xs text-error mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : (service ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
