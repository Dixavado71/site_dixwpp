import { create } from 'zustand';
import type { Sale, CreateSaleDTO, UpdateSaleDTO, SalesStats } from '@/types';
import { saleService } from '@/services/saleService';
import { toast } from 'sonner';

interface SalesFilters {
  status?: 'pending' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  tenantId?: string;
  search?: string;
}

interface SalesState {
  sales: Sale[];
  selectedSale: Sale | null;
  stats: SalesStats | null;
  filters: SalesFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSales: (params?: { page?: number; limit?: number }) => Promise<void>;
  getSaleById: (id: string) => Promise<void>;
  createSale: (data: CreateSaleDTO) => Promise<void>;
  updateSale: (id: string, data: UpdateSaleDTO) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  updateSaleStatus: (id: string, status: 'pending' | 'completed' | 'cancelled') => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<SalesFilters>) => void;
  resetFilters: () => void;
  setSelectedSale: (sale: Sale | null) => void;
  clearError: () => void;
  exportCSV: () => Promise<void>;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  selectedSale: null,
  stats: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchSales: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await saleService.getAll({ 
        ...params, 
        ...filters 
      });
      set({ sales: response.items, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar vendas',
        isLoading: false 
      });
      toast.error('Erro ao carregar vendas');
    }
  },

  getSaleById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await saleService.getById(id);
      set({ selectedSale: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar venda',
        isLoading: false 
      });
      toast.error('Erro ao carregar venda');
    }
  },

  createSale: async (data: CreateSaleDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await saleService.create(data);
      set((state) => ({ 
        sales: [...state.sales, response.data],
        isLoading: false 
      }));
      toast.success('Venda criada com sucesso!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao criar venda',
        isLoading: false 
      });
      toast.error('Erro ao criar venda');
      throw error;
    }
  },

  updateSale: async (id: string, data: UpdateSaleDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await saleService.update(id, data);
      set((state) => ({
        sales: state.sales.map(sale => 
          sale.id === id ? response.data : sale
        ),
        selectedSale: state.selectedSale?.id === id ? response.data : state.selectedSale,
        isLoading: false
      }));
      toast.success('Venda atualizada com sucesso!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar venda',
        isLoading: false 
      });
      toast.error('Erro ao atualizar venda');
      throw error;
    }
  },

  deleteSale: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await saleService.delete(id);
      set((state) => ({
        sales: state.sales.filter(sale => sale.id !== id),
        selectedSale: state.selectedSale?.id === id ? null : state.selectedSale,
        isLoading: false
      }));
      toast.success('Venda excluída com sucesso!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao excluir venda',
        isLoading: false 
      });
      toast.error('Erro ao excluir venda');
      throw error;
    }
  },

  updateSaleStatus: async (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    set({ isLoading: true, error: null });
    try {
      const response = await saleService.updateStatus(id, status);
      set((state) => ({
        sales: state.sales.map(sale => 
          sale.id === id ? response.data : sale
        ),
        isLoading: false
      }));
      toast.success('Status da venda atualizado!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar status',
        isLoading: false 
      });
      toast.error('Erro ao atualizar status da venda');
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const { filters } = get();
      const response = await saleService.getStats(filters);
      set({ stats: response.data });
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  },

  setFilters: (filters: Partial<SalesFilters>) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters: () => {
    set({ filters: {} });
  },

  setSelectedSale: (sale) => set({ selectedSale: sale }),

  clearError: () => set({ error: null }),

  exportCSV: async () => {
    try {
      const { filters } = get();
      const blob = await saleService.exportCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Exportação realizada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao exportar vendas');
      throw error;
    }
  },
}));
