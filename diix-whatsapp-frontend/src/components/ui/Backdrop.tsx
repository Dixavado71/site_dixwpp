import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BackdropProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  zIndex?: number;
}

/**
 * Componente de backdrop/overlay para sidebar e modais
 * 
 * @example
 * ```tsx
 * <Backdrop isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
 * ```
 */
export function Backdrop({ 
  isOpen, 
  onClose, 
  className,
  zIndex = 30 
}: BackdropProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={cn(
              'fixed inset-0 bg-black/60 backdrop-blur-sm',
              'z-[--backdrop-z-index]',
              className
            )}
            style={{ '--backdrop-z-index': zIndex - 1 } as React.CSSProperties}
            aria-hidden="true"
          />
          
          {/* Área clicável para fechar ao clicar fora */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[--area-z-index]"
            style={{ '--area-z-index': zIndex } as React.CSSProperties}
            onClick={onClose}
            aria-label="Fechar menu"
          />
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Hook simplificado para usar backdrop
 */
export function useBackdrop() {
  const renderBackdrop = (isOpen: boolean, onClose: () => void, zIndex?: number) => {
    return <Backdrop isOpen={isOpen} onClose={onClose} zIndex={zIndex} />
  }

  return { renderBackdrop }
}

export default Backdrop
