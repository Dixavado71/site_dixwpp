import { useState, useCallback } from 'react';

interface UseModalOptions<T = any> {
  defaultOpen?: boolean;
  initialData?: T | null;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseModalReturn<T = any> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
  reset: () => void;
}

export function useModal<T = any>(options: UseModalOptions<T> = {}): UseModalReturn<T> {
  const { defaultOpen = false, initialData = null, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [data, setData] = useState<T | null>(initialData);

  const open = useCallback((newData?: T) => {
    if (newData !== undefined) {
      setData(newData);
    }
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const reset = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return { isOpen, data, open, close, toggle, reset };
}
