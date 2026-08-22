import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCRUD } from '../useCRUD';

describe('useCRUD Hook', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  const mockFetchFn = vi.fn(() => Promise.resolve(mockItems));
  const mockCreateFn = vi.fn((data) => Promise.resolve({ id: '3', ...data }));
  const mockUpdateFn = vi.fn((id, data) => Promise.resolve({ id, ...data }));
  const mockDeleteFn = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty data', () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
    }));
    
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches data correctly', async () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
    }));
    
    await act(async () => {
      await result.current.fetchData();
    });
    
    expect(result.current.data).toEqual(mockItems);
    expect(mockFetchFn).toHaveBeenCalledTimes(1);
  });

  it('creates item correctly', async () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
      createFn: mockCreateFn,
    }));
    
    const newItem = { name: 'Item 3' };
    let createdItem;
    
    await act(async () => {
      createdItem = await result.current.createData(newItem);
    });
    
    expect(mockCreateFn).toHaveBeenCalledWith(newItem);
    expect(createdItem).toEqual({ id: '3', name: 'Item 3' });
  });

  it('updates item correctly', async () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
      updateFn: mockUpdateFn,
    }));
    
    // Primeiro carrega os dados
    await act(async () => {
      await result.current.fetchData();
    });
    
    const updatedItem = { name: 'Item Updated' };
    
    await act(async () => {
      await result.current.updateData('1', updatedItem);
    });
    
    expect(mockUpdateFn).toHaveBeenCalledWith('1', updatedItem);
  });

  it('deletes item correctly', async () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
      deleteFn: mockDeleteFn,
    }));
    
    // Primeiro carrega os dados
    await act(async () => {
      await result.current.fetchData();
    });
    
    await act(async () => {
      await result.current.deleteData('1');
    });
    
    expect(mockDeleteFn).toHaveBeenCalledWith('1');
    expect(result.current.data).toHaveLength(1);
  });

  it('sets loading state correctly', async () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
    }));
    
    expect(result.current.isLoading).toBe(false);
    
    act(() => {
      result.current.fetchData();
    });
    
    // Durante o fetch, isLoading deve ser true
    expect(result.current.isLoading).toBe(true);
  });

  it('sets error state correctly', async () => {
    const errorFetchFn = vi.fn(() => Promise.reject({ response: { data: { message: 'Erro no fetch' } } }));
    
    const { result } = renderHook(() => useCRUD({
      fetchFn: errorFetchFn,
    }));
    
    await act(async () => {
      await result.current.fetchData();
    });
    
    expect(result.current.error).toBe('Erro no fetch');
  });

  it('clears error with clearError()', () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
    }));
    
    act(() => {
      result.current.setError('Erro manual');
    });
    
    expect(result.current.error).toBe('Erro manual');
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('clears all data with clear()', () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
    }));
    
    // Simula dados carregados
    act(() => {
      result.current.data = mockItems;
    });
    
    act(() => {
      result.current.clear();
    });
    
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('finds item by id with getById()', async () => {
    const { result } = renderHook(() => useCRUD({
      fetchFn: mockFetchFn,
    }));
    
    await act(async () => {
      await result.current.fetchData();
    });
    
    const found = result.current.getById('1');
    expect(found).toEqual(mockItems[0]);
    
    const notFound = result.current.getById('999');
    expect(notFound).toBeUndefined();
  });
});
