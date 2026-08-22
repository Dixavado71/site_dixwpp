'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const progressVariants = cva('relative overflow-hidden rounded-full bg-white/10', {
  variants: {
    variant: {
      default: '',
      primary: '',
      gradient: '',
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
});

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants>
>(({ className, value, variant, size, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 transition-all duration-500 ease-out',
        variant === 'gradient'
          ? 'bg-gradient-to-r from-accent-primary via-accent-cyan to-accent-secondary'
          : 'bg-accent-primary'
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
