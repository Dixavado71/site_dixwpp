import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('glass-card rounded-xl p-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for Card
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('text-xl font-semibold text-text-primary', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };

// KPICard component

export interface KPICardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  className,
}: KPICardProps) {
  return (
    <div className={`glass-card rounded-xl p-6 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.label} {trend.value > 0 ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// EmptyState component
export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className || ''}`}>
      <div className="mx-auto w-12 h-12 flex items-center justify-center text-text-muted mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-text-primary">{title}</h3>
      <p className="text-text-muted mt-2">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// LoadingState component
export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Carregando...',
  className,
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className || ''}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
      {message && <span className="ml-3 text-text-muted">{message}</span>}
    </div>
  );
}

// StatusBadge component
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'paid' | 'cancelled' | 'completed';
  className?: string;
}

const statusConfig = {
  active: { label: 'Ativo', class: 'bg-green-500/20 text-green-400' },
  inactive: { label: 'Inativo', class: 'bg-red-500/20 text-red-400' },
  pending: { label: 'Pendente', class: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Pago', class: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Cancelado', class: 'bg-red-500/20 text-red-400' },
  completed: { label: 'Concluído', class: 'bg-green-500/20 text-green-400' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class} ${className || ''}`}>
      {config.label}
    </span>
  );
}

// ActionButton component
export interface ActionButtonProps {
  variant?: 'edit' | 'delete' | 'activate' | 'deactivate' | 'custom';
  icon: ReactNode;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({
  variant = 'custom',
  icon,
  onClick,
  label,
  disabled,
  className,
}: ActionButtonProps) {
  const variantClasses = {
    edit: 'hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary',
    delete: 'hover:bg-error/10 text-text-secondary hover:text-error',
    activate: 'hover:bg-green-500/10 text-green-400',
    deactivate: 'hover:bg-red-500/10 text-red-400',
    custom: 'hover:bg-white/5',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${variantClasses[variant]} ${className || ''}`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
