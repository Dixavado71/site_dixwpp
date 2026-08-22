import { create } from 'zustand';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductFilters {
  search: string;
  categoryId?: string;
  status?: 'active' | 'inactive';
}

interface TenantProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  
  // Actions
  fetch: (tenantId: string) => Promise<void>;
  create: (tenantId: string, data: any) => Promise<void>;
  update: (id: string, data: any) => Promise<void>;
  delete: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;
}

export const useTenantProductStore = create<TenantProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    categoryId: undefined,
    status: undefined,
  },

  fetch: async (tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productService.getAll(tenantId);
      set({ products, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar produtos';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  create: async (tenantId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await productService.create({ ...data, tenantId });
      toast.success('Produto criado com sucesso');
      await get().fetch(tenantId);
      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar produto';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  update: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await productService.update(id, data);
      toast.success('Produto atualizado com sucesso');
      const tenantId = get().products.find(p => p.id === id)?.tenantId || '';
      if (tenantId) {
        await get().fetch(tenantId);
      }
      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar produto';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  delete: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await productService.delete(id);
      toast.success('Produto removido com sucesso');
      const tenantId = get().products.find(p => p.id === id)?.tenantId || '';
      if (tenantId) {
        await get().fetch(tenantId);
      }
      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover produto';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  toggleStatus: async (id: string) => {
    try {
      await productService.toggleStatus(id);
      toast.success('Status alterado com sucesso');
      const tenantId = get().products.find(p => p.id === id)?.tenantId || '';
      if (tenantId) {
        await get().fetch(tenantId);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao alterar status';
      set({ error: message });
      toast.error(message);
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearError: () => set({ error: null }),
}));
