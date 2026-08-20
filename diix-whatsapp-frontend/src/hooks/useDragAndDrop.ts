import { useState, useCallback, useEffect } from 'react';

interface UseDragAndDropOptions<T extends { id: string; order?: number }> {
  items: T[];
  onReorder?: (ids: string[]) => Promise<void>;
  enabled?: boolean;
}

interface UseDragAndDropReturn<T extends { id: string; order?: number }> {
  draggedItem: T | null;
  isDragging: boolean;
  handleDragStart: (item: T) => void;
  handleDragOver: (e: React.DragEvent, item: T) => void;
  handleDrop: (e: React.DragEvent, targetItem: T) => void;
  handleDragEnd: () => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
}

export function useDragAndDrop<T extends { id: string; order?: number }>({
  items,
  onReorder,
  enabled = true,
}: UseDragAndDropOptions<T>): UseDragAndDropReturn<T> {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localItems, setLocalItems] = useState<T[]>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleDragStart = useCallback((item: T) => {
    if (!enabled) return;
    setDraggedItem(item);
    setIsDragging(true);
  }, [enabled]);

  const handleDragOver = useCallback((e: React.DragEvent, _item: T) => {
    if (!enabled || !draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, [enabled, draggedItem]);

  const handleDrop = useCallback(async (e: React.DragEvent, targetItem: T) => {
    if (!enabled || !draggedItem || draggedItem.id === targetItem.id) return;
    e.preventDefault();

    const fromIndex = localItems.findIndex(item => item.id === draggedItem.id);
    const toIndex = localItems.findIndex(item => item.id === targetItem.id);

    if (fromIndex === -1 || toIndex === -1) return;

    // Reordenar localmente
    const newItems = [...localItems];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);

    // Atualizar ordem
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLocalItems(reorderedItems as T[]);

    // Chamar callback de reordenamento
    if (onReorder) {
      try {
        await onReorder(reorderedItems.map(item => item.id));
      } catch (error) {
        // Reverter em caso de erro
        setLocalItems(items);
        console.error('Erro ao reordenar:', error);
      }
    }

    handleDragEnd();
  }, [enabled, draggedItem, localItems, onReorder, items]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
  }, []);

  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newItems = [...localItems];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);

    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLocalItems(reorderedItems as T[]);

    if (onReorder) {
      onReorder(reorderedItems.map(item => item.id));
    }
  }, [localItems, onReorder]);

  return {
    draggedItem,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    reorderItems,
  };
}
