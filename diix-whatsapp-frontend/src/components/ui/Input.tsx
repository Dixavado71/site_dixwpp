import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-text-secondary text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50',
            'transition-all duration-300 backdrop-blur-sm',
            'hover:border-white/20',
            error && 'border-error focus:ring-error/50 focus:border-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
