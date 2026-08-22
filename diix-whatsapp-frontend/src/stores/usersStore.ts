import { create } from 'zustand';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface UsersFilters {
  role?: 'super_admin' | 'admin';
  status?: 'active' | 'inactive';
  search?: string;
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  filters: UsersFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUsers: (params?: { page?: number; limit?: number }) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  createUser: (data: CreateUserDTO) => Promise<void>;
  updateUser: (id: string, data: UpdateUserDTO) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  setFilters: (filters: Partial<UsersFilters>) => void;
  resetFilters: () => void;
  setSelectedUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  selectedUser: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchUsers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await userService.getAll({
        ...params,
        ...filters
      });
      set({ users: response.items, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      toast.error(error.message || 'Erro ao buscar usuários');
    }
  },

  getUserById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getById(id);
      set({ selectedUser: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      toast.error(error.message || 'Erro ao buscar usuário');
    }
  },

  createUser: async (data: CreateUserDTO) => {
    set({ isLoading: true, error: null });
    try {
      await userService.create(data);
      toast.success('Usuário criado com sucesso!');
      const { fetchUsers } = get();
      fetchUsers();
      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      toast.error(error.message || 'Erro ao criar usuário');
      throw error;
    }
  },

  updateUser: async (id: string, data: UpdateUserDTO) => {
    set({ isLoading: true, error: null });
    try {
      await userService.update(id, data);
      toast.success('Usuário atualizado com sucesso!');
      const { fetchUsers } = get();
      fetchUsers();
      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      toast.error(error.message || 'Erro ao atualizar usuário');
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.delete(id);
      toast.success('Usuário excluído com sucesso!');
      const { fetchUsers } = get();
      fetchUsers();
      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      toast.error(error.message || 'Erro ao excluir usuário');
      throw error;
    }
  },

  toggleUserStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = get().users.find(u => u.id === id);
      if (!user) return;
      
      await userService.update(id, { status: user.status === 'active' ? 'inactive' : 'active' });
      toast.success(`Usuário ${user.status === 'active' ? 'inativado' : 'ativado'} com sucesso!`);
      const { fetchUsers } = get();
      fetchUsers();
      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      toast.error(error.message || 'Erro ao alterar status do usuário');
    }
  },

  setFilters: (filters: Partial<UsersFilters>) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters: () => {
    set({ filters: {} });
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  clearError: () => {
    set({ error: null });
  },
}));
