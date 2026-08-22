import { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Edit, Trash2, CheckCircle, XCircle, FolderIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Category } from '@/types';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isLoading?: boolean;
}

export function CategoryList({ 
  categories, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  isLoading = false 
}: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Separar categorias pai e filhas
  const parentCategories = filteredCategories.filter(c => !c.parentId);
  const getChildCategories = (parentId: string) => 
    filteredCategories.filter(c => c.parentId === parentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FolderIcon className="mx-auto h-12 w-12 text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-text-muted">Crie sua primeira categoria para começar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Lista de Categorias com Drag-and-Drop */}
      <Reorder.Group axis="y" values={parentCategories} onReorder={() => {}}>
        {parentCategories.map((category) => (
          <Reorder.Item key={category.id} value={category}>
            <motion.div layout>
              <CategoryItem
                category={category}
                childCategories={getChildCategories(category.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

interface CategoryItemProps {
  category: Category;
  childCategories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function CategoryItem({ category, childCategories, onEdit, onDelete, onToggleStatus }: CategoryItemProps) {
  return (
    <>
      <Card className="group hover:border-accent-primary/30 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Drag Handle */}
            <button
              className="p-2 rounded-lg hover:bg-white/5 text-text-muted cursor-grab active:cursor-grabbing"
              aria-label="Arrastar para reordenar"
            >
              <GripVertical className="h-5 w-5" />
            </button>

            {/* Ícone e Cor */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.icon ? (
                <span className="text-xl">{category.icon}</span>
              ) : (
                <FolderIcon className="h-5 w-5" />
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary truncate">{category.name}</h3>
              <p className="text-sm text-text-muted">
                {childCategories.length} subcategorias • Ordem: {category.order}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {category.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>

              {/* Ações */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(category.id)}
                  aria-label={category.status === 'active' ? 'Desativar' : 'Ativar'}
                >
                  {category.status === 'active' ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  aria-label="Editar categoria"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  aria-label="Excluir categoria"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subcategorias */}
      {childCategories.length > 0 && (
        <div className="ml-8 space-y-2">
          {childCategories.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              childCategories={[]}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </>
  );
}
