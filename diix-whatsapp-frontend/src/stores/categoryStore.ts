import { create } from 'zustand';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types';
import { categoryService } from '@/services/categoryService';
import { toast } from 'sonner';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: string) => Promise<void>;
  createCategory: (data: CreateCategoryDTO) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryDTO) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (ids: string[]) => Promise<void>;
  toggleCategoryStatus: (id: string) => Promise<void>;
  setSelectedCategory: (category: Category | null) => void;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.getAll();
      set({ categories: response.items, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar categorias',
        isLoading: false 
      });
      toast.error('Erro ao carregar categorias');
    }
  },

  getCategoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.getById(id);
      set({ selectedCategory: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao buscar categoria',
        isLoading: false 
      });
      toast.error('Erro ao carregar categoria');
    }
  },

  createCategory: async (data: CreateCategoryDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.create(data);
      set((state) => ({ 
        categories: [...state.categories, response.data],
        isLoading: false 
      }));
      toast.success('Categoria criada com sucesso!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao criar categoria',
        isLoading: false 
      });
      toast.error('Erro ao criar categoria');
      throw error;
    }
  },

  updateCategory: async (id: string, data: UpdateCategoryDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.update(id, data);
      set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === id ? response.data : cat
        ),
        selectedCategory: state.selectedCategory?.id === id ? response.data : state.selectedCategory,
        isLoading: false
      }));
      toast.success('Categoria atualizada com sucesso!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar categoria',
        isLoading: false 
      });
      toast.error('Erro ao atualizar categoria');
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter(cat => cat.id !== id),
        selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
        isLoading: false
      }));
      toast.success('Categoria excluída com sucesso!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao excluir categoria',
        isLoading: false 
      });
      toast.error('Erro ao excluir categoria');
      throw error;
    }
  },

  reorderCategories: async (ids: string[]) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.reorder(ids);
      set((state) => ({
        categories: state.categories.sort((a, b) => {
          return ids.indexOf(a.id) - ids.indexOf(b.id);
        }),
        isLoading: false
      }));
      toast.success('Ordem das categorias atualizada!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao reordenar categorias',
        isLoading: false 
      });
      toast.error('Erro ao reordenar categorias');
      throw error;
    }
  },

  toggleCategoryStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.toggleStatus(id);
      set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === id ? response.data : cat
        ),
        isLoading: false
      }));
      toast.success('Status da categoria alterado!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao alterar status',
        isLoading: false 
      });
      toast.error('Erro ao alterar status da categoria');
      throw error;
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  clearError: () => set({ error: null }),
}));
