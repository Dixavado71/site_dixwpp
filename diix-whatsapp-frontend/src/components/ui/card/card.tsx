import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-2xl p-6 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary border border-white/10',
        glass: 'glass-card',
        premium: 'glass-premium',
        neon: 'glass-card neon-glow-green',
      },
      hover: {
        true: 'hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'glass',
      hover: true,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardVariants({ variant, hover, className }))} {...props} />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4 flex items-center justify-between', className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    gradient?: boolean;
  }
>(({ className, as: Component = 'h3', gradient = false, ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        'text-xl font-bold',
        gradient ? 'text-gradient-premium' : 'text-text-primary',
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p ref={ref} className={cn('text-sm text-text-muted mt-1', className)} {...props} />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('', className)} {...props} />;
  }
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mt-6 pt-4 border-t border-white/10', className)} {...props} />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
