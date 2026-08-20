import { create } from 'zustand';
import type { 
  FinancialTransaction, CreateFinancialTransactionDTO, UpdateFinancialTransactionDTO, 
  FinancialStats 
} from '@/types';
import { financialService } from '@/services/financialService';
import { toast } from 'sonner';

interface FinancialFilters {
  status?: 'pending' | 'paid' | 'cancelled';
  type?: 'income' | 'expense';
  startDate?: string;
  endDate?: string;
  tenantId?: string;
  category?: string;
  search?: string;
}

interface FinancialState {
  transactions: FinancialTransaction[];
  selectedTransaction: FinancialTransaction | null;
  stats: FinancialStats | null;
  filters: FinancialFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: (params?: { page?: number; limit?: number }) => Promise<void>;
  getTransactionById: (id: string) => Promise<void>;
  createTransaction: (data: CreateFinancialTransactionDTO) => Promise<void>;
  updateTransaction: (id: string, data: UpdateFinancialTransactionDTO) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransactionStatus: (id: string, status: 'pending' | 'paid' | 'cancelled', paidDate?: string) => Promise<void>;
  reconcileTransaction: (id: string, paidDate: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<FinancialFilters>) => void;
  resetFilters: () => void;
  setSelectedTransaction: (transaction: FinancialTransaction | null) => void;
  clearError: () => void;
  exportCSV: () => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  stats: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTransactions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await financialService.getAll({ 
        ...params, 
        ...filters 
      });
      set({ transactions: response.items, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar transações',
        isLoading: false 
      });
      toast.error('Erro ao carregar transações');
    }
  },

  getTransactionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await financialService.getById(id);
      set({ selectedTransaction: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar transação',
        isLoading: false 
      });
      toast.error('Erro ao carregar transação');
    }
  },

  createTransaction: async (data: CreateFinancialTransactionDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await financialService.create(data);
      set((state) => ({ 
        transactions: [...state.transactions, response.data],
        isLoading: false 
      }));
      toast.success('Transação criada com sucesso!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao criar transação',
        isLoading: false 
      });
      toast.error('Erro ao criar transação');
      throw error;
    }
  },

  updateTransaction: async (id: string, data: UpdateFinancialTransactionDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await financialService.update(id, data);
      set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? response.data : t
        ),
        selectedTransaction: state.selectedTransaction?.id === id ? response.data : state.selectedTransaction,
        isLoading: false
      }));
      toast.success('Transação atualizada com sucesso!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar transação',
        isLoading: false 
      });
      toast.error('Erro ao atualizar transação');
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await financialService.delete(id);
      set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id),
        selectedTransaction: state.selectedTransaction?.id === id ? null : state.selectedTransaction,
        isLoading: false
      }));
      toast.success('Transação excluída com sucesso!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao excluir transação',
        isLoading: false 
      });
      toast.error('Erro ao excluir transação');
      throw error;
    }
  },

  updateTransactionStatus: async (id: string, status: 'pending' | 'paid' | 'cancelled', paidDate?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await financialService.updateStatus(id, status, paidDate);
      set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? response.data : t
        ),
        isLoading: false
      }));
      toast.success('Status da transação atualizado!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar status',
        isLoading: false 
      });
      toast.error('Erro ao atualizar status da transação');
      throw error;
    }
  },

  reconcileTransaction: async (id: string, paidDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await financialService.reconcile(id, paidDate);
      set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? response.data : t
        ),
        isLoading: false
      }));
      toast.success('Transação conciliada com sucesso!');
      get().fetchStats();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao conciliar transação',
        isLoading: false 
      });
      toast.error('Erro ao conciliar transação');
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const { filters } = get();
      const response = await financialService.getStats(filters);
      set({ stats: response.data });
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  },

  setFilters: (filters: Partial<FinancialFilters>) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters: () => {
    set({ filters: {} });
  },

  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

  clearError: () => set({ error: null }),

  exportCSV: async () => {
    try {
      const { filters } = get();
      const blob = await financialService.exportCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financeiro_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Exportação realizada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao exportar transações');
      throw error;
    }
  },
}));
