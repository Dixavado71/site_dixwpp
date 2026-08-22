import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden gap-2',
  {
    variants: {
      variant: {
        primary: 'bg-accent-primary text-black hover:bg-accent-primary/90 shadow-neon-green hover:shadow-neon-green-intense',
        secondary: 'bg-gradient-to-r from-accent-secondary to-accent-cyan text-white hover:from-accent-secondary/90 hover:to-accent-cyan/90 shadow-neon-purple hover:shadow-neon-purple-intense',
        outline: 'border-2 border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10 hover:border-accent-primary',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
        danger: 'bg-error/20 text-error border border-error/50 hover:bg-error/30 hover:shadow-neon-green-intense',
        glass: 'glass-premium text-text-primary hover:bg-white/10',
        gradient: 'bg-gradient-to-r from-accent-primary via-accent-cyan to-accent-secondary text-white hover:scale-105 shadow-lg',
        link: 'text-accent-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
        icon: 'h-10 w-10',
      },
      glow: {
        none: '',
        soft: 'glow-soft',
        medium: 'glow-medium',
        intense: 'glow-intense glow-pulse',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: 'none',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      isLoading,
      children,
      disabled,
      asChild = false,
      icon,
      iconPosition = 'left',
      ripple = true,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow, className }), ripple ? 'ripple' : '')}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Gradient overlay for gradient variant */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        )}

        {/* Loading spinner */}
        {isLoading && (
          <Loader2
            className={cn(
              'animate-spin h-5 w-5',
              iconPosition === 'left' && children ? 'mr-2' : ''
            )}
          />
        )}

        {/* Icon left */}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Children */}
        {children && <span>{children}</span>}

        {/* Icon right */}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
