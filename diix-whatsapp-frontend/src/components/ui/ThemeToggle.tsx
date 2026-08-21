import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon' | 'switch';
  showLabel?: boolean;
}

export function ThemeToggle({ 
  size = 'sm', 
  variant = 'icon',
  showLabel = false 
}: ThemeToggleProps) {
  const { mode, toggleMode } = useThemeStore();
  
  const isDark = mode === 'dark';

  const sizeClasses = {
    sm: 'min-h-[40px] min-w-[40px] p-2',
    md: 'min-h-[44px] min-w-[44px] p-2.5',
    lg: 'min-h-[48px] min-w-[48px] p-3',
  };

  const handleToggle = () => {
    toggleMode();
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex items-center w-16 h-8 rounded-full transition-colors duration-300",
          isDark ? "bg-accent-primary/20" : "bg-yellow-500/20"
        )}
        aria-label={`Alternar para modo ${isDark ? 'claro' : 'escuro'}`}
      >
        <motion.div
          initial={false}
          animate={{ x: isDark ? 32 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-accent-primary" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
        </motion.div>
        
        <div className="flex-1 mx-8">
          <span className="sr-only">
            Modo {isDark ? 'escuro' : 'claro'}
          </span>
        </div>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleToggle}
        className={cn(sizeClasses[size], "gap-2")}
        aria-label={`Alternar para modo ${isDark ? 'claro' : 'escuro'}`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </motion.div>
        {showLabel && (
          <span className="text-sm">
            {isDark ? 'Modo Escuro' : 'Modo Claro'}
          </span>
        )}
      </Button>
    );
  }

  // Icon variant (default)
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className={cn(sizeClasses[size], "relative overflow-hidden")}
      aria-label={`Alternar para modo ${isDark ? 'claro' : 'escuro'}`}
    >
      {/* Background glow effect */}
      <motion.div
        initial={false}
        animate={{
          opacity: isDark ? 0.3 : 0.1,
          scale: isDark ? 1.2 : 1,
        }}
        className="absolute inset-0 bg-accent-primary rounded-full"
      />
      
      {/* Icon with animation */}
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? -180 : 0,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 0.3 },
          scale: { duration: 0.2, times: [0, 0.5, 1] }
        }}
        className="relative z-10"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-accent-primary" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>

      {/* Tooltip on hover */}
      <span className="sr-only">
        Alternar para modo {isDark ? 'claro' : 'escuro'}
      </span>
    </Button>
  );
}

export default ThemeToggle;
