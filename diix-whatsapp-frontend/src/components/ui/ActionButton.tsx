import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface ActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon?: ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  showLabel?: boolean;
  children?: ReactNode;
}

export function ActionButton({ 
  icon, 
  label,
  variant = 'ghost',
  showLabel = true,
  className,
  children,
  ...props 
}: ActionButtonProps) {
  return (
    <Button 
      variant={variant} 
      size="sm"
      className={cn(!showLabel && 'p-2', className)}
      {...props}
    >
      {icon}
      {showLabel && label && (
        <span className="ml-2">{label}</span>
      )}
      {children ?? null}
    </Button>
  );
}

// Conjunto de botões de ação comuns para tabelas
export interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onActivate?: () => void;
  isDisabled?: boolean;
}

export function TableActions({ 
  onEdit, 
  onDelete, 
  onView,
  onActivate,
  isDisabled = false 
}: TableActionsProps) {
  return (
    <div className="flex items-center gap-2 justify-end">
      {onView && (
        <ActionButton
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          onClick={onView}
          disabled={isDisabled}
          aria-label="Visualizar"
        />
      )}
      {onEdit && (
        <ActionButton
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          onClick={onEdit}
          disabled={isDisabled}
          aria-label="Editar"
        />
      )}
      {onActivate && (
        <ActionButton
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          variant="primary"
          onClick={onActivate}
          disabled={isDisabled}
          aria-label="Ativar"
        />
      )}
      {onDelete && (
        <ActionButton
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
          variant="danger"
          onClick={onDelete}
          disabled={isDisabled}
          aria-label="Excluir"
        />
      )}
    </div>
  );
}
