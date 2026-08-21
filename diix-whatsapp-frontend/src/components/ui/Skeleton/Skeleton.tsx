import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const variantClasses = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
  rounded: 'rounded-md',
};

const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'animate-shimmer',
  none: '',
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted',
          variantClasses[variant],
          animationClasses[animation],
          className
        )}
        style={{
          width,
          height,
          minWidth: variant === 'circular' ? height : undefined,
          minHeight: variant === 'circular' ? width : undefined,
        }}
        aria-busy="true"
        aria-label="Carregando..."
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
