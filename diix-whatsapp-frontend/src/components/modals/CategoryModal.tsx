import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Category } from '@/types';

const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  categories: Category[];
  editingCategory?: Category | null;
}

export function CategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories,
  editingCategory 
}: CategoryModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: '',
      color: '#00ff9d',
      parentId: null,
      status: 'active',
    },
  });

  useEffect(() => {
    if (editingCategory) {
      setValue('name', editingCategory.name);
      setValue('icon', editingCategory.icon || '');
      setValue('color', editingCategory.color || '#00ff9d');
      setValue('parentId', editingCategory.parentId || null);
      setValue('status', editingCategory.status);
    } else {
      reset({
        name: '',
        icon: '',
        color: '#00ff9d',
        parentId: null,
        status: 'active',
      });
    }
  }, [editingCategory, reset, setValue]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      // Error já tratado no store
    }
  };

  if (!isOpen) return null;

  const parentCategories = categories.filter(c => !c.parentId && c.id !== editingCategory?.id);

  // Cores predefinidas
  const predefinedColors = [
    '#00ff9d', '#bd00ff', '#00f3ff', '#ff6b6b', '#ffd93d', 
    '#6bcb77', '#4d96ff', '#f06595', '#ff922b', '#9775fa'
  ];

  // Ícones comuns
  const commonIcons = ['📁', '📦', '🏷️', '⭐', '🔥', '💎', '🎯', '🚀', '💡', '📊'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md glass-panel rounded-xl border border-white/10"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-text-primary">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {editingCategory ? 'Atualize as informações da categoria' : 'Crie uma nova categoria para organizar seus itens'}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Nome *
            </label>
            <Input
              {...register('name')}
              placeholder="Ex: Produtos, Serviços..."
              className={errors.name ? 'border-error' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          {/* Categoria Pai */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Categoria Pai (opcional)
            </label>
            <select
              {...register('parentId')}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            >
              <option value="">Nenhuma (categoria principal)</option>
              {parentCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Ícone
            </label>
            <div className="flex flex-wrap gap-2">
              {commonIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue('icon', icon)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    register('icon').value === icon
                      ? 'bg-accent-primary/20 border-2 border-accent-primary'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Cor
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    register('color').value === color
                      ? 'ring-2 ring-white scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={register('color').value}
                onChange={(e) => setValue('color', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer"
              />
              <Input
                value={register('color').value}
                onChange={(e) => setValue('color', e.target.value)}
                placeholder="#00ff9d"
                className="flex-1"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="active"
                  {...register('status')}
                  className="w-4 h-4 text-accent-primary bg-white/5 border-white/10 focus:ring-accent-primary"
                />
                <span className="text-text-secondary">Ativo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="inactive"
                  {...register('status')}
                  className="w-4 h-4 text-accent-primary bg-white/5 border-white/10 focus:ring-accent-primary"
                />
                <span className="text-text-secondary">Inativo</span>
              </label>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1"
            >
              {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
