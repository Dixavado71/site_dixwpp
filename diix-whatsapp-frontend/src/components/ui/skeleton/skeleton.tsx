'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva('animate-pulse rounded-md bg-white/10', {
  variants: {
    variant: {
      default: '',
      circular: 'rounded-full',
      premium: 'skeleton-premium',
    },
    size: {
      sm: 'h-4 w-full',
      md: 'h-6 w-full',
      lg: 'h-8 w-full',
      xl: 'h-12 w-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(skeletonVariants({ variant, size, className }))} {...props} />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
