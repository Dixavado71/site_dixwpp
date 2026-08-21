import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  showPageNumbers?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  showPageNumbers = true,
  className,
}) => {
  const pages = React.useMemo(() => {
    const delta = 2;
    const range: (number | 'ellipsis')[] = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      range.unshift('ellipsis');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('ellipsis');
    }
    
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  }, [currentPage, totalPages]);

  const startIndex = pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const endIndex = pageSize ? Math.min(currentPage * pageSize, totalItems || 0) : undefined;

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {(totalItems && pageSize) && (
        <p className="text-sm text-muted-foreground">
          Mostrando {startIndex}-{endIndex} de {totalItems} resultados
        </p>
      )}
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          aria-label="Primeira página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {pages.map((page, index) =>
              page === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="inline-flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm',
                    page === currentPage
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  )}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
