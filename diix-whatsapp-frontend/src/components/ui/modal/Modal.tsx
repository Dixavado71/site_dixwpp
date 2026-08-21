import { forwardRef, type ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      footer,
      size = 'md',
      closeOnOverlayClick = true,
      showCloseButton = true,
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    // Mobile: fullscreen modal
    // Desktop: centered modal with max-height
    const containerClasses = cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-black/60 backdrop-blur-sm",
      isMobile ? 'p-0' : 'p-4'
    );

    const contentClasses = cn(
      'w-full glass-panel rounded-xl border border-white/10 overflow-hidden',
      isMobile 
        ? 'h-full max-h-[100vh] rounded-none' 
        : cn(sizeClasses[size], 'max-h-[90vh]'),
      'flex flex-col'
    );

    return (
      <AnimatePresence>
        <div
          ref={ref}
          className={containerClasses}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={contentClasses}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-text-primary truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-text-muted mt-1">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Fechar modal"
                    className="ml-2 min-h-[44px] min-w-[44px] p-2 flex-shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Body - scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
              {children}
            </div>

            {/* Footer - sticky at bottom */}
            {footer && (
              <div className="flex gap-3 p-4 sm:p-6 border-t border-white/10 bg-white/5 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }
);

Modal.displayName = 'Modal';

// Sub-components for common modal patterns
export interface ConfirmModalProps extends Omit<ModalProps, 'children' | 'footer'> {
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  message: string;
  isConfirming?: boolean;
}

export const ConfirmModal = forwardRef<HTMLDivElement, ConfirmModalProps>(
  (
    {
      onConfirm,
      onCancel,
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      confirmVariant = 'danger',
      message,
      isConfirming = false,
      ...modalProps
    },
    ref
  ) => {
    return (
      <Modal
        ref={ref}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={onCancel || modalProps.onClose} disabled={isConfirming}>
              {cancelText}
            </Button>
            <Button variant={confirmVariant} onClick={onConfirm} isLoading={isConfirming}>
              {confirmText}
            </Button>
          </>
        }
        {...modalProps}
      >
        <p className="text-text-secondary">{message}</p>
      </Modal>
    );
  }
);

ConfirmModal.displayName = 'ConfirmModal';
