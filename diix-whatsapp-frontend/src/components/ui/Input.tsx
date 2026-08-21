import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  variant?: 'default' | 'glass' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, variant = 'glass', size = 'md', type = 'text', ...props }, ref) => {
    const variants = {
      default: 'bg-white/5 border-white/10 hover:border-white/20',
      glass: 'glass-card border-white/10 hover:border-accent-primary/30',
      premium: 'glass-premium border-white/10 hover:border-accent-primary/50',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
    };
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-text-secondary text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-300",
              "group-focus-within:text-accent-primary"
            )}>
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full rounded-xl border backdrop-blur-sm',
              'focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50',
              'transition-all duration-300 ease-out',
              variants[variant],
              sizes[size],
              icon && 'pl-10',
              error && 'border-error focus:ring-error/50 focus:border-error',
              className
            )}
            {...props}
          />
          {/* Focus glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-xl pointer-events-none",
            "opacity-0 group-focus-within:opacity-100 transition-opacity duration-300",
            "glow-soft"
          )} />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1 animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
