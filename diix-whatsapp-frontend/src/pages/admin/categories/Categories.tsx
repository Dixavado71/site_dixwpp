import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { useCategoryStore } from '@/stores/categoryStore';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types';
import { toast } from 'sonner';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        // Error já tratado no store
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleCategoryStatus(id);
    } catch (error) {
      // Error já tratado no store
    }
  };

  const handleSubmitCategory = async (data: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data as UpdateCategoryDTO);
    } else {
      await createCategory(data as CreateCategoryDTO);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Categorias</h1>
          <p className="text-text-muted mt-1">Gerencie categorias e subcategorias com drag-and-drop</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <FolderPlus className="w-5 h-5 mr-2" />
          Nova Categoria
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total de Categorias</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{categories.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
              <FolderPlus className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Categorias Ativas</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {categories.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
              <GripVertical className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Subcategorias</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {categories.filter(c => c.parentId).length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-accent-cyan/10 text-accent-cyan">
              <FolderPlus className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lista de Categorias */}
      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmitCategory}
        categories={categories}
        editingCategory={editingCategory}
      />
    </div>
  );
}
