import { Virtuoso } from 'react-virtuoso';
import type { ReactNode } from 'react';

interface VirtualizedListProps<T> {
  data: T[];
  itemHeight?: number;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  className?: string;
}

/**
 * Componente de lista virtualizada para grandes volumes de dados
 * 
 * @description Usa react-virtuoso para renderizar apenas os itens visíveis,
 * melhorando significativamente a performance em listas com +100 itens.
 */
export function VirtualizedList<T>({
  data,
  itemHeight = 60,
  renderItem,
  emptyMessage = 'Nenhum item encontrado',
  className = '',
}: VirtualizedListProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 text-muted-foreground ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <Virtuoso
      style={{ height: Math.min(data.length * itemHeight, 600) }}
      totalCount={data.length}
      itemContent={(index) => renderItem(data[index], index)}
      className={className}
      overscan={200} // Renderiza 200px extras acima e abaixo da viewport
      components={{
        Header: () => <div className="sticky top-0 bg-background z-10" />,
        Footer: () => <div className="h-4" />,
      }}
    />
  );
}

/**
 * Hook utilitário para verificar se deve usar lista virtualizada
 */
export function useVirtualizationRecommendation(itemCount: number): boolean {
  return itemCount > 100; // Recomenda virtualização para +100 itens
}

export default VirtualizedList;
