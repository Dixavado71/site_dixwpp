import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'premium' | 'neon';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'glass', hover = true, ...props }, ref) => {
    const variants = {
      default: 'bg-bg-secondary border border-white/10',
      glass: 'glass-card',
      premium: 'glass-premium',
      neon: 'glass-card neon-glow-green',
    };

    const hoverEffects = hover 
      ? 'hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)' 
      : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6',
          variants[variant],
          hoverEffects,
          className
        )}
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
        className={cn('mb-4 flex items-center justify-between', className)}
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
  gradient?: boolean;
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Component = 'h3', gradient = false, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'text-xl font-bold',
          gradient ? 'text-gradient-premium' : 'text-text-primary',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-text-muted mt-1', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

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

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-6 pt-4 border-t border-white/10', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

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
  variant?: 'default' | 'glass' | 'premium' | 'neon';
  gradient?: boolean;
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  className,
  variant = 'glass',
  gradient = false,
}: KPICardProps) {
  return (
    <Card variant={variant} className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted">{title}</p>
          <p className={cn(
            "text-3xl font-bold mt-2",
            gradient ? 'text-gradient-premium' : 'text-text-primary'
          )}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <span className={cn(
                "text-sm font-medium px-2 py-0.5 rounded-full",
                trend.isPositive 
                  ? 'bg-success/20 text-success-bright' 
                  : 'bg-error/20 text-error-bright'
              )}>
                {trend.label} {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-4 rounded-2xl bg-accent-primary/10 text-accent-primary glow-soft">
            {icon}
          </div>
        )}
      </div>
    </Card>
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
    <div className={cn("text-center py-16 fade-in", className)}>
      <div className="mx-auto w-16 h-16 flex items-center justify-center text-text-muted mb-6 rounded-2xl bg-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="text-text-muted mt-3 max-w-md mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// LoadingState component with skeleton
export interface LoadingStateProps {
  message?: string;
  className?: string;
  variant?: 'spinner' | 'skeleton';
}

export function LoadingState({
  message = 'Carregando...',
  className,
  variant = 'spinner',
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <div className="w-12 h-12 rounded-full skeleton-premium mb-4"></div>
        <div className="h-4 w-32 skeleton-premium rounded"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12 fade-in", className)}>
      <div className="relative">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-primary"></div>
        <div className="absolute inset-0 rounded-full glow-soft animate-pulse"></div>
      </div>
      {message && <span className="ml-4 text-text-muted font-medium">{message}</span>}
    </div>
  );
}

// StatusBadge component
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'paid' | 'cancelled' | 'completed';
  className?: string;
  variant?: 'default' | 'glow';
}

const statusConfig = {
  active: { label: 'Ativo', class: 'bg-green-500/20 text-green-400 border-green-500/30', glow: 'glow-soft' },
  inactive: { label: 'Inativo', class: 'bg-red-500/20 text-red-400 border-red-500/30', glow: '' },
  pending: { label: 'Pendente', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', glow: '' },
  paid: { label: 'Pago', class: 'bg-green-500/20 text-green-400 border-green-500/30', glow: 'glow-soft' },
  cancelled: { label: 'Cancelado', class: 'bg-red-500/20 text-red-400 border-red-500/30', glow: '' },
  completed: { label: 'Concluído', class: 'bg-green-500/20 text-green-400 border-green-500/30', glow: 'glow-soft' },
};

export function StatusBadge({ status, className, variant = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-semibold border",
      config.class,
      variant === 'glow' ? config.glow : '',
      className
    )}>
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
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButton({
  variant = 'custom',
  icon,
  onClick,
  label,
  disabled,
  className,
  size = 'md',
}: ActionButtonProps) {
  const variantClasses = {
    edit: 'hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary hover:scale-110',
    delete: 'hover:bg-error/10 text-text-secondary hover:text-error hover:scale-110',
    activate: 'hover:bg-green-500/10 text-green-400 hover:scale-110',
    deactivate: 'hover:bg-red-500/10 text-red-400 hover:scale-110',
    custom: 'hover:bg-white/5 hover:scale-110',
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl transition-all duration-200 ripple",
        variantClasses[variant],
        sizes[size],
        className
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
