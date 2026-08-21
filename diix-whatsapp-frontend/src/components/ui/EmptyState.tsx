import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text-primary">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted mt-2 max-w-md">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  );
}
