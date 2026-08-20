import { useState, useEffect } from 'react';
import { FolderPlus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCategoryStore } from '@/stores/categoryStore';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryModal } from '@/components/modals/CategoryModal';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types';
import { KPICard, EmptyState } from '@/components/ui/Card';
import { useModal } from '@/hooks/useModal';

export default function CategoriesPage() {
  const { 
    categories, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    toggleCategoryStatus,
    isLoading 
  } = useCategoryStore();
  
  const modal = useModal();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    modal.open();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategory(id);
    }
  };

  const handleSubmitCategory = async (data: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data as UpdateCategoryDTO);
    } else {
      await createCategory(data as CreateCategoryDTO);
    }
    modal.close();
    setEditingCategory(null);
  };

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    subcategories: categories.filter(c => c.parentId).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Categorias</h1>
          <p className="text-text-muted mt-1">Gerencie categorias e subcategorias com drag-and-drop</p>
        </div>
        <Button variant="primary" onClick={modal.open}>
          <FolderPlus className="w-5 h-5 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KPICard
          title="Total de Categorias"
          value={stats.total}
          icon={<FolderPlus className="h-6 w-6" />}
        />
        <KPICard
          title="Categorias Ativas"
          value={stats.active}
          icon={<GripVertical className="h-6 w-6" />}
        />
        <KPICard
          title="Subcategorias"
          value={stats.subcategories}
          icon={<FolderPlus className="h-6 w-6" />}
        />
      </div>

      {/* Lista de Categorias */}
      {isLoading ? (
        <EmptyState
          icon={<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary" />}
          title="Carregando..."
          description=""
        />
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleCategoryStatus}
        />
      )}

      {/* Modal */}
      <CategoryModal
        isOpen={modal.isOpen}
        onClose={() => {
          modal.close();
          setEditingCategory(null);
        }}
        onSubmit={handleSubmitCategory}
        categories={categories}
        editingCategory={editingCategory}
      />
    </div>
  );
}
