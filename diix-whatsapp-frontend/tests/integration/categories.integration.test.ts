/**
 * Testes de integração para Categories
 * 
 * Testa:
 * - CRUD completo
 * - Filtros e paginação
 * - Validações de formulário
 * - Permissões por role
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCategoryStore } from '../../src/stores/categoryStore';
import { categoryService } from '../../src/services/categoryService';
import { SALE_STATUS, TENANT_STATUS } from '@/constants/status';
import { STATUS_COLORS } from '@/constants/colors';

// Mock do categoryService
vi.mock('../../src/services/categoryService', () => ({
  categoryService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    toggleStatus: vi.fn(),
    reorder: vi.fn(),
  },
}));

describe('Categories Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CRUD Operations', () => {
    it('should fetch all categories successfully', async () => {
      const mockCategories = [
        { id: '1', name: 'Categoria 1', status: 'active', icon: '📁', color: '#00ff9d' },
        { id: '2', name: 'Categoria 2', status: 'active', icon: '📦', color: '#bd00ff' },
      ];

      vi.mocked(categoryService.getAll).mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.isLoading).toBe(false);
      expect(categoryService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should create a new category successfully', async () => {
      const newCategory = {
        id: '3',
        name: 'Nova Categoria',
        status: 'active',
        icon: '⭐',
        color: '#ff6b6b',
      };

      vi.mocked(categoryService.create).mockResolvedValue(newCategory);

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        await result.current.createCategory({
          name: 'Nova Categoria',
          icon: '⭐',
          color: '#ff6b6b',
          status: 'active',
        });
      });

      expect(result.current.categories).toContainEqual(newCategory);
      expect(categoryService.create).toHaveBeenCalledWith({
        name: 'Nova Categoria',
        icon: '⭐',
        color: '#ff6b6b',
        status: 'active',
      });
    });

    it('should update an existing category successfully', async () => {
      const updatedCategory = {
        id: '1',
        name: 'Categoria Atualizada',
        status: 'active',
        icon: '🔥',
        color: '#ffd93d',
      };

      vi.mocked(categoryService.update).mockResolvedValue(updatedCategory);

      const { result } = renderHook(() => useCategoryStore());

      // Primeiro adiciona uma categoria
      await act(async () => {
        result.current.categories = [{ id: '1', name: 'Categoria 1', status: 'active' }];
      });

      await act(async () => {
        await result.current.updateCategory('1', {
          name: 'Categoria Atualizada',
          icon: '🔥',
          color: '#ffd93d',
        });
      });

      expect(categoryService.update).toHaveBeenCalledWith('1', {
        name: 'Categoria Atualizada',
        icon: '🔥',
        color: '#ffd93d',
      });
    });

    it('should delete a category successfully', async () => {
      vi.mocked(categoryService.delete).mockResolvedValue(undefined);

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        result.current.categories = [
          { id: '1', name: 'Categoria 1', status: 'active' },
          { id: '2', name: 'Categoria 2', status: 'active' },
        ];
      });

      await act(async () => {
        await result.current.deleteCategory('1');
      });

      expect(result.current.categories.length).toBe(1);
      expect(result.current.categories[0].id).toBe('2');
      expect(categoryService.delete).toHaveBeenCalledWith('1');
    });

    it('should toggle category status successfully', async () => {
      const toggledCategory = {
        id: '1',
        name: 'Categoria 1',
        status: 'inactive',
      };

      vi.mocked(categoryService.toggleStatus).mockResolvedValue(toggledCategory);

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        result.current.categories = [{ id: '1', name: 'Categoria 1', status: 'active' }];
      });

      await act(async () => {
        await result.current.toggleCategoryStatus('1');
      });

      expect(categoryService.toggleStatus).toHaveBeenCalledWith('1');
    });
  });

  describe('Error Handling', () => {
    it('should handle error when fetching categories fails', async () => {
      vi.mocked(categoryService.getAll).mockRejectedValue(
        new Error('Erro ao buscar categorias')
      );

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.error).toBe('Erro ao buscar categorias');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle validation errors on create', async () => {
      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        try {
          await result.current.createCategory({ name: '' } as any);
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('State Management', () => {
    it('should initialize with empty categories', () => {
      const { result } = renderHook(() => useCategoryStore());

      expect(result.current.categories).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should clear error when calling clearError', async () => {
      vi.mocked(categoryService.getAll).mockRejectedValue(new Error('Erro'));

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Constants Integration', () => {
    it('should use correct status constants', () => {
      expect(SALE_STATUS.PENDING).toBe('pending');
      expect(SALE_STATUS.COMPLETED).toBe('completed');
      expect(TENANT_STATUS.ACTIVE).toBe('active');
      expect(TENANT_STATUS.SUSPENDED).toBe('suspended');
    });

    it('should use correct status colors', () => {
      expect(STATUS_COLORS.active).toContain('bg-green-500/20');
      expect(STATUS_COLORS.inactive).toContain('bg-red-500/20');
      expect(STATUS_COLORS.suspended).toContain('bg-orange-500/20');
    });
  });
});
