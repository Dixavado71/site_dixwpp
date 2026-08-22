import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  // Status gerais
  pending: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Pago', color: 'bg-green-500/20 text-green-400' },
  completed: { label: 'Concluído', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
  active: { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
  inactive: { label: 'Inativo', color: 'bg-red-500/20 text-red-400' },
  
  // Tipos de transação
  income: { label: 'Entrada', color: 'bg-green-500/20 text-green-400' },
  expense: { label: 'Saída', color: 'bg-red-500/20 text-red-400' },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function StatusBadge({ 
  status, 
  variant,
  size = 'md',
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status] || { 
    label: status, 
    color: 'bg-white/10 text-text-secondary' 
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium capitalize',
        sizeClasses[size],
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
