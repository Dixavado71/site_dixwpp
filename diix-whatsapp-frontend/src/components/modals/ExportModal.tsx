import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileJson, FileSpreadsheet, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'pdf' | 'json' | 'xlsx', filters?: Record<string, any>) => Promise<void>;
  title: string;
  formats?: ('csv' | 'pdf' | 'json' | 'xlsx')[];
  filters?: Record<string, any>;
  isLoading?: boolean;
}

const formatOptions = {
  csv: {
    label: 'CSV',
    description: 'Planilha compatível com Excel',
    icon: FileSpreadsheet,
  },
  pdf: {
    label: 'PDF',
    description: 'Documento formatado para impressão',
    icon: FileText,
  },
  json: {
    label: 'JSON',
    description: 'Formato estruturado para integração',
    icon: FileJson,
  },
  xlsx: {
    label: 'Excel',
    description: 'Planilha Excel formatada',
    icon: FileSpreadsheet,
  },
};

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  title,
  formats = ['csv', 'pdf', 'json'],
  filters,
  isLoading = false,
}: ExportModalProps) {
  const handleExport = async (format: 'csv' | 'pdf' | 'json' | 'xlsx') => {
    try {
      await onExport(format, filters);
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
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{title}</h2>
              <p className="text-sm text-text-muted mt-1">
                Selecione o formato de exportação
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Opções de Formato */}
          <div className="p-6 space-y-3">
            {formats.map((format) => {
              const option = formatOptions[format];
              const Icon = option.icon;
              
              return (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-lg border border-white/10 hover:border-accent-primary/50 hover:bg-accent-primary/5 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent-primary/10 text-accent-primary group-hover:bg-accent-primary/20 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary">{option.label}</h3>
                      <p className="text-sm text-text-muted">{option.description}</p>
                    </div>
                    <Download className="w-5 h-5 text-text-secondary group-hover:text-accent-primary transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cancelar */}
          <div className="p-6 pt-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
