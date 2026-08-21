import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
  glow?: 'none' | 'soft' | 'medium' | 'intense';
  ripple?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    children, 
    disabled, 
    glow = 'none',
    ripple = true,
    icon,
    iconPosition = 'left',
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
    
    const variants = {
      primary: 'bg-accent-primary text-black hover:bg-accent-primary/90 shadow-neon-green hover:shadow-neon-green-intense',
      secondary: 'bg-gradient-to-r from-accent-secondary to-accent-cyan text-white hover:from-accent-secondary/90 hover:to-accent-cyan/90 shadow-neon-purple hover:shadow-neon-purple-intense',
      outline: 'border-2 border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10 hover:border-accent-primary',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
      danger: 'bg-error/20 text-error border border-error/50 hover:bg-error/30 hover:shadow-neon-green-intense',
      glass: 'glass-premium text-text-primary hover:bg-white/10',
      gradient: 'bg-gradient-to-r from-accent-primary via-accent-cyan to-accent-secondary text-white hover:scale-105 shadow-lg',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3',
    };

    const glowEffects = {
      none: '',
      soft: 'glow-soft',
      medium: 'glow-medium',
      intense: 'glow-intense glow-pulse',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size],
          glowEffects[glow],
          ripple ? 'ripple' : '',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Gradient overlay for gradient variant */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        )}
        
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className={cn("animate-spin", iconPosition === 'left' ? 'mr-2' : 'ml-2', "h-5 w-5")} />
        )}
        
        {/* Icon left */}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {/* Children */}
        <span>{children}</span>
        
        {/* Icon right */}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
