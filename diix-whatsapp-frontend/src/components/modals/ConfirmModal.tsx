import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-error',
    iconBg: 'bg-error/10',
    confirmBtnVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-500/10',
    confirmBtnVariant: 'primary' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-accent-cyan',
    iconBg: 'bg-accent-cyan/10',
    confirmBtnVariant: 'primary' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/10',
    confirmBtnVariant: 'primary' as const,
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Erro já tratado no handler
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md glass-panel rounded-xl border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header com ícone */}
          <div className={`p-6 border-b border-white/10 ${config.iconBg}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${config.iconBg}`}>
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            <p className="text-text-secondary">{message}</p>
          </div>

          {/* Ações */}
          <div className="flex gap-3 p-6 pt-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={config.confirmBtnVariant}
              onClick={handleConfirm}
              className="flex-1"
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
