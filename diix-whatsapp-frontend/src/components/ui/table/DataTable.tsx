import { forwardRef, type ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  className?: string;
  emptyState?: ReactNode;
  loading?: boolean;
}

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

export const DataTable = forwardRef<HTMLTableElement, DataTableProps<any>>(
  ({ columns, data, className, emptyState, loading }, ref) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      );
    }

    if (data.length === 0) {
      return emptyState || (
        <div className="text-center py-12 text-text-muted">
          Nenhum dado encontrado
        </div>
      );
    }

    // Mobile: transform into cards
    if (isMobile) {
      return (
        <div className="space-y-3">
          {data.map((row, rowIndex) => (
            <div
              key={(row as any).id || rowIndex}
              className="glass-panel rounded-lg border border-white/10 p-4 space-y-3"
            >
              {columns.map((column) => (
                <div 
                  key={String(column.key)}
                  className="flex justify-between items-start gap-4"
                >
                  <span className="text-sm font-medium text-text-muted min-w-[100px]">
                    {column.header}:
                  </span>
                  <span className="text-sm text-text-primary text-right flex-1">
                    {column.cell ? column.cell(row) : String(row[column.key] ?? '')}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    // Desktop: traditional table
    return (
      <div className="overflow-x-auto scrollbar-thin">
        <table ref={ref} className={cn('w-full', className)}>
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'text-left py-4 px-6 text-sm font-medium text-text-muted whitespace-nowrap',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={(row as any).id || rowIndex}
                className="border-b border-border hover:bg-white/5 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn('py-4 px-6 text-sm text-text-primary whitespace-nowrap', column.className)}
                  >
                    {column.cell ? column.cell(row) : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';
