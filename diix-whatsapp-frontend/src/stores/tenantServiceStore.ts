import { create } from 'zustand';
import { toast } from 'sonner';
import { tenantServices } from '@/services/tenantServices';
import type { Service, CreateServiceDTO, UpdateServiceDTO } from '@/types';

interface ServiceFilters {
  search: string;
  status: 'active' | 'inactive' | 'all';
  categoryId?: string;
}

interface TenantServiceStore {
  services: Service[];
  filters: ServiceFilters;
  isLoading: boolean;
  error: string | null;
  tenantId: string | null;
  
  setTenantId: (tenantId: string) => void;
  fetch: () => Promise<void>;
  getById: (id: string) => Promise<Service | undefined>;
  create: (data: CreateServiceDTO) => Promise<void>;
  update: (id: string, data: UpdateServiceDTO) => Promise<void>;
  delete: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  clearError: () => void;
}

export const useTenantServiceStore = create<TenantServiceStore>((set, get) => ({
  services: [],
  filters: {
    search: '',
    status: 'all',
    categoryId: undefined,
  },
  isLoading: false,
  error: null,
  tenantId: null,

  setTenantId: (tenantId: string) => {
    set({ tenantId });
    if (tenantId) {
      get().fetch();
    }
  },

  fetch: async () => {
    const tenantId = get().tenantId;
    if (!tenantId) return;
    
    set({ isLoading: true, error: null });
    try {
      const services = await tenantServices.getAll(tenantId);
      let filteredServices = services || [];
      
      const { search, status } = get().filters;
      
      if (search) {
        filteredServices = filteredServices.filter((s: Service) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (status !== 'all') {
        filteredServices = filteredServices.filter((s: Service) => s.active === (status === 'active'));
      }
      
      set({ services: filteredServices, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar serviços';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  getById: async (id: string) => {
    try {
      const service = await tenantServices.getById(id);
      return service;
    } catch (error) {
      toast.error('Erro ao buscar serviço');
      return undefined;
    }
  },

  create: async (data: CreateServiceDTO) => {
    set({ isLoading: true, error: null });
    try {
      await tenantServices.create(data);
      await get().fetch();
      toast.success('Serviço criado com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar serviço';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  update: async (id: string, data: UpdateServiceDTO) => {
    set({ isLoading: true, error: null });
    try {
      await tenantServices.update(id, data);
      await get().fetch();
      toast.success('Serviço atualizado com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar serviço';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  delete: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await tenantServices.delete(id);
      await get().fetch();
      toast.success('Serviço excluído com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir serviço';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  toggleStatus: async (id: string) => {
    try {
      await tenantServices.toggleStatus(id);
      await get().fetch();
      toast.success('Status alterado com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao alterar status';
      set({ error: message });
      toast.error(message);
    }
  },

  setFilters: (filters: Partial<ServiceFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
    setTimeout(() => get().fetch(), 300);
  },

  clearError: () => set({ error: null }),
}));
