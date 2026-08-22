import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  showToasts?: boolean;
}

/**
 * Hook para gerenciar atalhos de teclado globais
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     {
 *       key: 'n',
 *       ctrl: true,
 *       action: () => handleNew(),
 *       description: 'Criar novo item',
 *     },
 *     {
 *       key: 's',
 *       ctrl: true,
 *       action: () => handleSave(),
 *       description: 'Salvar',
 *     },
 *     {
 *       key: 'Escape',
 *       action: () => handleClose(),
 *       description: 'Fechar modal',
 *     },
 *   ],
 * });
 * ```
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  showToasts = false,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignora se estiver digitando em input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Permite Escape mesmo em inputs
        if (event.key !== 'Escape') return;
      }

      const shortcut = shortcuts.find((s) => {
        // Verifica tecla principal
        if (s.key.toLowerCase() !== event.key.toLowerCase()) return false;

        // Verifica modificadores
        if (s.ctrl && !event.ctrlKey) return false;
        if (s.shift && !event.shiftKey) return false;
        if (s.alt && !event.altKey) return false;
        if (s.meta && !event.metaKey) return false;

        // Verifica se não há modificadores extras
        if (event.ctrlKey && !s.ctrl) return false;
        if (event.shiftKey && !s.shift) return false;
        if (event.altKey && !s.alt) return false;
        if (event.metaKey && !s.meta) return false;

        return true;
      });

      if (shortcut) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        
        if (showToasts) {
          toast.info(`Atalho: ${shortcut.description}`);
        }
        
        shortcut.action();
      }
    },
    [shortcuts, enabled, showToasts]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Hook pre-configurado com atalhos comuns
 */
export function useCommonShortcuts(actions: {
  onNew?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.onNew) {
    shortcuts.push({
      key: 'n',
      ctrl: true,
      action: actions.onNew,
      description: 'Criar novo',
    });
  }

  if (actions.onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      action: actions.onSave,
      description: 'Salvar',
    });
  }

  if (actions.onDelete) {
    shortcuts.push({
      key: 'Delete',
      action: actions.onDelete,
      description: 'Excluir selecionado',
    });
  }

  if (actions.onEdit) {
    shortcuts.push({
      key: 'e',
      action: actions.onEdit,
      description: 'Editar',
    });
  }

  if (actions.onCancel) {
    shortcuts.push({
      key: 'Escape',
      action: actions.onCancel,
      description: 'Cancelar',
    });
  }

  if (actions.onSearch) {
    shortcuts.push({
      key: 'f',
      ctrl: true,
      action: actions.onSearch,
      description: 'Buscar',
    });
  }

  if (actions.onRefresh) {
    shortcuts.push({
      key: 'r',
      ctrl: true,
      action: actions.onRefresh,
      description: 'Atualizar',
    });
  }

  useKeyboardShortcuts({ shortcuts });
}

/**
 * Hook para navegação com teclado
 */
export function useNavigationShortcuts(navigate: (path: string | number) => void) {
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'g',
        ctrl: true,
        action: () => navigate('/'),
        description: 'Ir para Dashboard',
      },
      {
        key: '1',
        ctrl: true,
        action: () => navigate('/'),
        description: 'Ir para página 1',
      },
      {
        key: '2',
        ctrl: true,
        action: () => {
          if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
          }
        },
        description: 'Voltar página',
      },
    ],
  });
}

export default useKeyboardShortcuts;
