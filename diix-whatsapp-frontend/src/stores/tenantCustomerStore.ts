import { create } from 'zustand'
import { toast } from 'sonner'
import { customerService } from '@/services/customerService'
import type { Client, CreateClientDTO, UpdateClientDTO } from '@/types'

interface CustomerFilters {
  search: string
  status: 'active' | 'inactive' | 'all'
}

interface CustomerStore {
  customers: Client[]
  filters: CustomerFilters
  isLoading: boolean
  loading: boolean
  error: string | null
  
  fetch: () => Promise<void>
  getById: (id: string) => Promise<Client | undefined>
  create: (data: CreateClientDTO) => Promise<void>
  update: (id: string, data: UpdateClientDTO) => Promise<void>
  delete: (id: string) => Promise<void>
  setFilters: (filters: Partial<CustomerFilters>) => void
  clearError: () => void
}

export const useTenantCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  filters: {
    search: '',
    status: 'all',
  },
  isLoading: false,
  loading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      let customers = await customerService.getAll('current-tenant-id')
      
      const { search, status } = get().filters
      
      if (search) {
        customers = customers.filter((c: Client) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.document?.includes(search)
        )
      }
      
      if (status !== 'all') {
        customers = customers.filter((c: Client) => (status === 'active'))
      }
      
      set({ customers, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar clientes'
      set({ error: message, isLoading: false })
      toast.error(message)
    }
  },

  getById: async (id: string) => {
    try {
      const customer = await customerService.getById(id)
      return customer
    } catch (error) {
      toast.error('Erro ao buscar cliente')
      return undefined
    }
  },

  create: async (data: CreateClientDTO) => {
    set({ isLoading: true, error: null })
    try {
      await customerService.create(data)
      await get().fetch()
      toast.success('Cliente criado com sucesso!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar cliente'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  update: async (id: string, data: UpdateClientDTO) => {
    set({ isLoading: true, error: null })
    try {
      await customerService.update(id, data)
      await get().fetch()
      toast.success('Cliente atualizado com sucesso!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar cliente'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  delete: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await customerService.delete(id)
      await get().fetch()
      toast.success('Cliente excluído com sucesso!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir cliente'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  setFilters: (filters: Partial<CustomerFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
    setTimeout(() => get().fetch(), 300)
  },

  clearError: () => set({ error: null }),
}))
