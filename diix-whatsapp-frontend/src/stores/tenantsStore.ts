import { create } from 'zustand';
import type { Tenant, CreateTenantDTO, UpdateTenantDTO } from '@/types';
import { tenantService } from '@/services/tenantService';
import { toast } from 'sonner';

interface TenantsFilters {
  status?: 'active' | 'inactive';
  plan?: 'basic' | 'standard' | 'premium' | 'enterprise';
  search?: string;
}

interface TenantsState {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  filters: TenantsFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTenants: (params?: { page?: number; limit?: number }) => Promise<void>;
  getTenantById: (id: string) => Promise<void>;
  createTenant: (data: CreateTenantDTO) => Promise<void>;
  updateTenant: (id: string, data: UpdateTenantDTO) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  toggleTenantStatus: (id: string) => Promise<void>;
  updateTenantPlan: (id: string, plan: 'basic' | 'standard' | 'premium' | 'enterprise') => Promise<void>;
  updateTenantLimits: (id: string, limits: { maxUsers: number; maxClients: number; maxProducts: number; maxMessages: number }) => Promise<void>;
  setFilters: (filters: Partial<TenantsFilters>) => void;
  resetFilters: () => void;
  setSelectedTenant: (tenant: Tenant | null) => void;
  clearError: () => void;
}

export const useTenantsStore = create<TenantsState>((set, get) => ({
  tenants: [],
  selectedTenant: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTenants: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await tenantService.getAll({ 
        ...params, 
        ...filters 
      });
      set({ tenants: response.items, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar tenants',
        isLoading: false 
      });
      toast.error('Erro ao carregar tenants');
    }
  },

  getTenantById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.getById(id);
      set({ selectedTenant: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar tenant',
        isLoading: false 
      });
      toast.error('Erro ao carregar tenant');
    }
  },

  createTenant: async (data: CreateTenantDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.create(data);
      set((state) => ({ 
        tenants: [...state.tenants, response.data],
        isLoading: false 
      }));
      toast.success('Tenant criado com sucesso!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao criar tenant',
        isLoading: false 
      });
      toast.error('Erro ao criar tenant');
      throw error;
    }
  },

  updateTenant: async (id: string, data: UpdateTenantDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.update(id, data);
      set((state) => ({
        tenants: state.tenants.map(tenant => 
          tenant.id === id ? response.data : tenant
        ),
        selectedTenant: state.selectedTenant?.id === id ? response.data : state.selectedTenant,
        isLoading: false
      }));
      toast.success('Tenant atualizado com sucesso!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar tenant',
        isLoading: false 
      });
      toast.error('Erro ao atualizar tenant');
      throw error;
    }
  },

  deleteTenant: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await tenantService.delete(id);
      set((state) => ({
        tenants: state.tenants.filter(tenant => tenant.id !== id),
        selectedTenant: state.selectedTenant?.id === id ? null : state.selectedTenant,
        isLoading: false
      }));
      toast.success('Tenant excluído com sucesso!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao excluir tenant',
        isLoading: false 
      });
      toast.error('Erro ao excluir tenant');
      throw error;
    }
  },

  toggleTenantStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.toggleStatus(id);
      set((state) => ({
        tenants: state.tenants.map(tenant => 
          tenant.id === id ? response.data : tenant
        ),
        isLoading: false
      }));
      toast.success('Status do tenant alterado!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao alterar status',
        isLoading: false 
      });
      toast.error('Erro ao alterar status do tenant');
      throw error;
    }
  },

  updateTenantPlan: async (id: string, plan: 'basic' | 'standard' | 'premium' | 'enterprise') => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.updatePlan(id, plan);
      set((state) => ({
        tenants: state.tenants.map(tenant => 
          tenant.id === id ? response.data : tenant
        ),
        isLoading: false
      }));
      toast.success('Plano do tenant atualizado!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar plano',
        isLoading: false 
      });
      toast.error('Erro ao atualizar plano');
      throw error;
    }
  },

  updateTenantLimits: async (id: string, limits: { maxUsers: number; maxClients: number; maxProducts: number; maxMessages: number }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.updateLimits(id, limits);
      set((state) => ({
        tenants: state.tenants.map(tenant => 
          tenant.id === id ? response.data : tenant
        ),
        isLoading: false
      }));
      toast.success('Limites do tenant atualizados!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar limites',
        isLoading: false 
      });
      toast.error('Erro ao atualizar limites');
      throw error;
    }
  },

  setFilters: (filters: Partial<TenantsFilters>) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters: () => {
    set({ filters: {} });
  },

  setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),

  clearError: () => set({ error: null }),
}));
