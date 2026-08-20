import { useState, useMemo } from 'react';

interface UseDataTableOptions<T> {
  data: T[];
  searchKeys?: (keyof T)[];
  initialPage?: number;
  pageSize?: number;
}

interface DataTableState<T> {
  data: T[];
  filteredData: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  searchTerm: string;
  sortField: keyof T | null;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, any>;
  isLoading: boolean;
  isError: boolean;
}

interface DataTableActions<T> {
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (field: keyof T, direction?: 'asc' | 'desc') => void;
  setFilters: (filters: Record<string, any>) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
}

export function useDataTable<T extends Record<string, any>>({
  data,
  searchKeys,
  initialPage = 1,
  pageSize = 10,
}: UseDataTableOptions<T>): DataTableState<T> & DataTableActions<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(initialPage);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Filtrar dados por termo de busca
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar filtros customizados
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter(item => {
          if (typeof value === 'string') {
            return String(item[key]).toLowerCase().includes(value.toLowerCase());
          }
          return item[key] === value;
        });
      }
    });

    // Aplicar busca por texto
    if (searchTerm && searchKeys && searchKeys.length > 0) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          return value != null && String(value).toLowerCase().includes(term);
        })
      );
    }

    // Aplicar ordenação
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, filters, sortField, sortDirection]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  return {
    data: paginatedData,
    filteredData,
    page,
    pageSize,
    totalPages,
    searchTerm,
    sortField,
    sortDirection,
    filters,
    isLoading,
    isError,
    setSearchTerm: (term: string) => {
      setSearchTerm(term);
      setPage(1);
    },
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    setSort: (field: keyof T, direction: 'asc' | 'desc' = 'asc') => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection(direction);
      }
    },
    setFilters,
    resetFilters: () => {
      setFilters({});
      setSearchTerm('');
      setPage(1);
    },
    goToPage: (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    nextPage: () => {
      if (page < totalPages) {
        setPage(page + 1);
      }
    },
    previousPage: () => {
      if (page > 1) {
        setPage(page - 1);
      }
    },
    setLoading: setIsLoading,
    setError: setIsError,
  };
}
