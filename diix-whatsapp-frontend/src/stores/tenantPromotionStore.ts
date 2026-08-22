import { create } from 'zustand'
import { toast } from 'sonner'
import { promotionService } from '@/services/promotionService'
import type { Promotion, CreatePromotionDTO, UpdatePromotionDTO } from '@/types'

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
  create: (data: CreatePromotionDTO) => Promise<void>
  update: (id: string, data: UpdatePromotionDTO) => Promise<void>
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
      const promotions = await promotionService.getAll('')
      let filteredPromotions = promotions || []
      
      const { search, status, type } = get().filters
      
      if (search) {
        filteredPromotions = filteredPromotions.filter((p: Promotion) =>
          p.title.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (status !== 'all') {
        filteredPromotions = filteredPromotions.filter((p: Promotion) => p.active === (status === 'active'))
      }
      
      if (type !== 'all') {
        // Assuming type field exists or needs to be derived
        // filteredPromotions = filteredPromotions.filter((p: Promotion) => p.type === type)
      }
      
      set({ promotions: filteredPromotions, isLoading: false })
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

  create: async (data: CreatePromotionDTO) => {
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

  update: async (id: string, data: UpdatePromotionDTO) => {
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
