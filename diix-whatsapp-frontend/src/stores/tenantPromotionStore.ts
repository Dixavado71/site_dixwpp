import { create } from 'zustand'
import { toast } from 'sonner'
import { promotionService } from '@/services/promotionService'

interface PromotionFilters {
  search: string
  status: 'active' | 'inactive' | 'all'
  type: 'percentage' | 'fixed' | 'all'
}

interface PromotionStore {
  promotions: Promotion[]
  filters: PromotionFilters
  isLoading: boolean
  error: string | null
  
  fetch: () => Promise<void>
  getById: (id: string) => Promise<Promotion | undefined>
  create: (data: PromotionCreateDTO) => Promise<void>
  update: (id: string, data: PromotionUpdateDTO) => Promise<void>
  delete: (id: string) => Promise<void>
  setFilters: (filters: Partial<PromotionFilters>) => void
  clearError: () => void
}

export const useTenantPromotionStore = create<PromotionStore>((set, get) => ({
  promotions: [],
  filters: {
    search: '',
    status: 'all',
    type: 'all',
  },
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await promotionService.getAll()
      let promotions = response.data || []
      
      const { search, status, type } = get().filters
      
      if (search) {
        promotions = promotions.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (status !== 'all') {
        promotions = promotions.filter((p) => p.status === status)
      }
      
      if (type !== 'all') {
        promotions = promotions.filter((p) => p.type === type)
      }
      
      set({ promotions, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar promoções'
      set({ error: message, isLoading: false })
      toast.error(message)
    }
  },

  getById: async (id: string) => {
    try {
      const promotion = await promotionService.getById(id)
      return promotion
    } catch (error) {
      toast.error('Erro ao buscar promoção')
      return undefined
    }
  },

  create: async (data: PromotionCreateDTO) => {
    set({ isLoading: true, error: null })
    try {
      await promotionService.create(data)
      await get().fetch()
      toast.success('Promoção criada com sucesso!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar promoção'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  update: async (id: string, data: PromotionUpdateDTO) => {
    set({ isLoading: true, error: null })
    try {
      await promotionService.update(id, data)
      await get().fetch()
      toast.success('Promoção atualizada com sucesso!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar promoção'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  delete: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await promotionService.delete(id)
      await get().fetch()
      toast.success('Promoção excluída com sucesso!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir promoção'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  setFilters: (filters: Partial<PromotionFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
    setTimeout(() => get().fetch(), 300)
  },

  clearError: () => set({ error: null }),
}))
