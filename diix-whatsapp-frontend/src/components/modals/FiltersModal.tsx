import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  title: string;
  fields: FilterField[];
  initialFilters?: Record<string, any>;
  isLoading?: boolean;
}

export function FiltersModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  title,
  fields,
  initialFilters = {},
  isLoading = false,
}: FiltersModalProps) {
  const handleApply = () => {
    const formData = new FormData(document.getElementById('filters-form') as HTMLFormElement);
    const filters: Record<string, any> = {};
    
    fields.forEach((field) => {
      const value = formData.get(field.key);
      if (value !== null && value !== '') {
        filters[field.key] = field.type === 'boolean' ? value === 'on' : value;
      }
    });
    
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-panel rounded-xl border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                <p className="text-sm text-text-muted mt-1">
                  Defina os critérios de filtragem
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

          {/* Campos de Filtro */}
          <form id="filters-form" className="p-6 space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {field.label}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    name={field.key}
                    defaultValue={initialFilters[field.key] || ''}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  >
                    <option value="">Todos</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={field.key}
                      defaultChecked={initialFilters[field.key] || false}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent-primary focus:ring-accent-primary"
                    />
                    <span className="text-text-secondary">Ativo</span>
                  </label>
                ) : field.type === 'date' ? (
                  <Input
                    type="date"
                    name={field.key}
                    defaultValue={initialFilters[field.key] || ''}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'number' ? (
                  <Input
                    type="number"
                    name={field.key}
                    defaultValue={initialFilters[field.key] || ''}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    type="text"
                    name={field.key}
                    defaultValue={initialFilters[field.key] || ''}
                    placeholder={field.placeholder}
                    icon={<Search className="w-4 h-4" />}
                  />
                )}
              </div>
            ))}
          </form>

          {/* Ações */}
          <div className="flex gap-3 p-6 pt-0">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="flex-1"
              disabled={isLoading}
            >
              Limpar Filtros
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleApply}
              className="flex-1"
              isLoading={isLoading}
            >
              Aplicar Filtros
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
