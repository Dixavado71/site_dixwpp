import * as React from 'react';
import { cn } from '@/lib/utils';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';

const progressVariants = cva(
  'relative overflow-hidden rounded-full bg-white/10 transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-accent-primary shadow-lg shadow-accent-primary/30',
        success: 'bg-green-500 shadow-lg shadow-green-500/30',
        warning: 'bg-yellow-500 shadow-lg shadow-yellow-500/30',
        danger: 'bg-red-500 shadow-lg shadow-red-500/30',
      },
      size: {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ProgressBarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'value'>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, showLabel = false, variant, size = 'md', animated = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className={cn('w-full', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <ProgressPrimitive.Root
          ref={ref}
          className={cn('relative overflow-hidden rounded-full bg-white/10', size === 'sm' ? 'h-2' : size === 'md' ? 'h-3' : 'h-4')}
          value={percentage}
          max={100}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              'h-full w-full flex-1 transition-all duration-500 ease-in-out',
              progressVariants({ variant }),
              animated && 'animate-pulse'
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </ProgressPrimitive.Root>
        {showLabel && (
          <p className="mt-1 text-xs text-text-muted text-right">{percentage.toFixed(0)}%</p>
        )}
      </div>
    );
  }
);

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

Progress.displayName = 'Progress';

// Legacy export for backward compatibility
export const ProgressBar = Progress;
export default Progress;
