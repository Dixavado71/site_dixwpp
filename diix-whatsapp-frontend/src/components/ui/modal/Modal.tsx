import { forwardRef, type ReactNode } from 'react';
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
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
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
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <AnimatePresence>
        <div
          ref={ref}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'w-full glass-panel rounded-xl border border-white/10 overflow-hidden',
              sizeClasses[size]
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-xl font-bold text-text-primary">
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
                    className="ml-auto"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex gap-3 p-6 border-t border-white/10 bg-white/5">
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
