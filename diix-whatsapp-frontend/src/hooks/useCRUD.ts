import { useState, useCallback } from 'react';

interface UseCRUDOptions<T, CreateDTO, UpdateDTO> {
  fetchFn: () => Promise<T[]>;
  createFn?: (data: CreateDTO) => Promise<T>;
  updateFn?: (id: string, data: UpdateDTO) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  onSuccess?: (action: 'create' | 'update' | 'delete', data?: T) => void;
  onError?: (action: 'create' | 'update' | 'delete', error: any) => void;
}

interface UseCRUDReturn<T, CreateDTO, UpdateDTO> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  createData: (dto: CreateDTO) => Promise<T | null>;
  updateData: (id: string, dto: UpdateDTO) => Promise<T | null>;
  deleteData: (id: string) => Promise<boolean>;
  clearError: () => void;
  // Métodos adicionais para testes e uso simplificado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
  getById: (id: string) => T | undefined;
}

export function useCRUD<T extends { id: string }, CreateDTO, UpdateDTO>({
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  onSuccess,
  onError,
}: UseCRUDOptions<T, CreateDTO, UpdateDTO>): UseCRUDReturn<T, CreateDTO, UpdateDTO> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao buscar dados';
      setError(errorMsg);
      onError?.('create', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, onError]);

  const createData = useCallback(async (dto: CreateDTO): Promise<T | null> => {
    if (!createFn) {
      setError('Função de criação não disponível');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await createFn(dto);
      setData(prev => [...prev, result]);
      onSuccess?.('create', result);
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao criar registro';
      setError(errorMsg);
      onError?.('create', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [createFn, onSuccess, onError]);

  const updateData = useCallback(async (id: string, dto: UpdateDTO): Promise<T | null> => {
    if (!updateFn) {
      setError('Função de atualização não disponível');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateFn(id, dto);
      setData(prev => prev.map(item => item.id === id ? result : item));
      onSuccess?.('update', result);
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar registro';
      setError(errorMsg);
      onError?.('update', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [updateFn, onSuccess, onError]);

  const deleteData = useCallback(async (id: string): Promise<boolean> => {
    if (!deleteFn) {
      setError('Função de exclusão não disponível');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await deleteFn(id);
      setData(prev => prev.filter(item => item.id !== id));
      onSuccess?.('delete');
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao excluir registro';
      setError(errorMsg);
      onError?.('delete', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deleteFn, onSuccess, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Métodos utilitários para testes e uso simplificado
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const clear = useCallback(() => {
    setData([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const getById = useCallback((id: string): T | undefined => {
    return data.find(item => item.id === id);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    createData,
    updateData,
    deleteData,
    clearError,
    setLoading,
    setError,
    clear,
    getById,
  };
}
