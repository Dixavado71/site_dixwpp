'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as BadgePrimitive from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-accent-primary/10 text-accent-primary border-accent-primary/30',
        secondary: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30 glow-soft',
        error: 'bg-error/20 text-error-bright border-error/50',
        warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        outline: 'border-white/20 text-text-secondary hover:border-accent-primary/50',
        glass: 'glass-card border-white/10 text-text-primary',
        gradient: 'bg-gradient-to-r from-accent-primary to-accent-cyan text-black border-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props} />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
