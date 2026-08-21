import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Bell, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  title?: string;
}

export default function Header({ onMenuClick, isSidebarOpen, title }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <header 
      className={cn(
        "sticky top-0 z-30 glass-panel border-b border-white/10 backdrop-blur-xl",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="min-h-[44px] min-w-[44px] p-2" // Touch target
            aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isSidebarOpen && !isMobile ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </Button>
          
          {title && (
            <h1 className="text-base sm:text-xl font-bold text-text-primary hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search - hidden on very small screens */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 min-h-[44px]"
              />
            </div>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="min-h-[44px] min-w-[44px] p-2 relative"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-primary rounded-full" />
          </Button>

          {/* Date - hidden on mobile */}
          <span className="hidden lg:block text-sm text-text-muted">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </header>
  )
}
