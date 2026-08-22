import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Monitor, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Theme {
  id: string;
  name: string;
  preview: string;
  secondary?: string;
  icon?: React.ReactNode;
}

const themes: Theme[] = [
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    preview: '#00ff9d',
    secondary: '#ff00ff',
    icon: <Monitor className="w-4 h-4" />
  },
  { 
    id: 'light', 
    name: 'Light', 
    preview: '#f3f4f6',
    secondary: '#e5e7eb',
    icon: <Sun className="w-4 h-4" />
  },
  { 
    id: 'corporate', 
    name: 'Corporate', 
    preview: '#1e40af',
    secondary: '#3b82f6',
    icon: <Monitor className="w-4 h-4" />
  },
  { 
    id: 'neon', 
    name: 'Neon', 
    preview: '#ff00ff',
    secondary: '#00ffff',
    icon: <Palette className="w-4 h-4" />
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    preview: '#ffffff',
    secondary: '#f9fafb',
    icon: <Monitor className="w-4 h-4" />
  },
];

export interface ThemeSwitcherProps {
  align?: 'left' | 'right';
  variant?: 'dropdown' | 'grid' | 'compact';
}

export function ThemeSwitcher({ align = 'right', variant = 'dropdown' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  const handleSelectTheme = (themeId: string) => {
    setTheme(themeId as any);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {themes.slice(0, 4).map((t) => (
            <motion.button
              key={t.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectTheme(t.id)}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all",
                theme === t.id 
                  ? "border-accent-primary shadow-lg shadow-accent-primary/50" 
                  : "border-white/20 hover:border-white/40"
              )}
              style={{ 
                background: `linear-gradient(135deg, ${t.preview}, ${t.secondary || t.preview})`,
              }}
              aria-label={`Tema ${t.name}`}
              title={t.name}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[44px] px-3 gap-2"
        aria-label="Selecionar tema"
        aria-expanded={isOpen}
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">{currentTheme?.name || 'Tema'}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute z-50 mt-2 w-72 glass-panel rounded-xl border border-white/10 p-4 shadow-2xl",
                align === 'right' ? "right-0" : "left-0"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">Temas</h3>
                  <span className="text-xs text-text-muted">{themes.length} opções</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTheme(t.id)}
                      className={cn(
                        "group relative flex flex-col items-start gap-2 p-3 rounded-lg border transition-all",
                        theme === t.id
                          ? "border-accent-primary bg-accent-primary/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      {/* Preview */}
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="w-8 h-8 rounded-md shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${t.preview}, ${t.secondary || t.preview})`,
                          }}
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-text-primary">{t.name}</p>
                          <p className="text-xs text-text-muted capitalize">{t.id}</p>
                        </div>
                        {theme === t.id && (
                          <Check className="w-4 h-4 text-accent-primary" />
                        )}
                      </div>

                      {/* Icon */}
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        theme === t.id ? "text-accent-primary" : "text-text-muted"
                      )}>
                        {t.icon}
                        <span>{theme === t.id ? 'Selecionado' : 'Clique para usar'}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Quick Mode Toggle Hint */}
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-text-muted text-center">
                    Dica: Use o toggle no header para modo claro/escuro
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeSwitcher;
