import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-text-secondary text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50',
            'transition-all duration-300 backdrop-blur-sm resize-y min-h-[100px]',
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

Textarea.displayName = 'Textarea';

export { Textarea };
