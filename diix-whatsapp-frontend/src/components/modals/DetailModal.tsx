import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DetailField {
  key: string;
  label: string;
  render?: (value: any, data: Record<string, any>) => React.ReactNode;
  format?: 'text' | 'currency' | 'date' | 'status' | 'email';
}

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: React.ReactNode;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  fields: DetailField[];
  actions?: ActionButton[];
  isLoading?: boolean;
}

const formatValue = (value: any, format?: string) => {
  if (value === null || value === undefined) return '-';
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(value));
    case 'date':
      return new Date(value).toLocaleDateString('pt-BR');
    case 'email':
      return (
        <a
          href={`mailto:${value}`}
          className="text-accent-primary hover:underline"
        >
          {value}
        </a>
      );
    case 'status':
      const statusColors: Record<string, string> = {
        active: 'bg-green-500/20 text-green-400',
        inactive: 'bg-red-500/20 text-red-400',
        pending: 'bg-yellow-500/20 text-yellow-400',
        paid: 'bg-green-500/20 text-green-400',
        cancelled: 'bg-red-500/20 text-red-400',
      };
      const statusLabels: Record<string, string> = {
        active: 'Ativo',
        inactive: 'Inativo',
        pending: 'Pendente',
        paid: 'Pago',
        cancelled: 'Cancelado',
      };
      const statusKey = typeof value === 'string' ? value.toLowerCase() : 'pending';
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[statusKey] || 'bg-gray-500/20 text-gray-400'}`}>
          {statusLabels[statusKey] || value}
        </span>
      );
    default:
      return String(value);
  }
};

export function DetailModal({
  isOpen,
  onClose,
  title,
  data,
  fields,
  actions = [],
  isLoading = false,
}: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl glass-panel rounded-xl border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                <p className="text-sm text-text-muted mt-1">
                  Visualização detalhada
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Campos de Detalhe */}
          <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
            <dl className="space-y-4">
              {fields.map((field) => {
                const value = data[field.key];
                const displayValue = field.render
                  ? field.render(value, data)
                  : formatValue(value, field.format);

                return (
                  <div
                    key={field.key}
                    className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/5"
                  >
                    <dt className="text-sm font-medium text-text-secondary">
                      {field.label}
                    </dt>
                    <dd className="col-span-2 text-sm text-text-primary">
                      {displayValue}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* Ações */}
          {actions.length > 0 && (
            <div className="flex gap-3 p-6 border-t border-white/10">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={action.variant || 'ghost'}
                  onClick={action.onClick}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          {actions.length === 0 && (
            <div className="p-6 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
