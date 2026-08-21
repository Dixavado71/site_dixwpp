import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Edit, Trash2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ProductModal } from '@/components/modals/ProductModal';
import { useTenantProductStore } from '@/stores/tenantProductStore';
import { useModal } from '@/hooks/useModal';
import type { Product } from '@/types';

export default function TenantProducts() {
  const { products, loading, fetch, create, update, delete: deleteProduct } = useTenantProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const tenantId = 'current-tenant-id'; // Substituir pelo tenant real
  
  // Modais
  const createModal = useModal();
  const editModal = useModal();
  const viewModal = useModal();
  const deleteConfirmModal = useModal();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);

  useEffect(() => {
    fetch(tenantId);
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && typeof product.category === 'object' && 'name' in product.category && 
     String(product.category.name).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = async (data: any) => {
    try {
      await create(tenantId, data);
      setModalMode(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedProduct) return;
    try {
      await update(selectedProduct.id, data);
      setModalMode(null);
      setSelectedProduct(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      deleteConfirmModal.close();
      setSelectedProduct(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  // Stats calculations
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => (p.stock ?? 0) < 10).length;
  const totalStockValue = products.reduce((acc, p) => acc + ((p.stock ?? 0) * p.price), 0);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setModalMode('create');
  };

  const openViewModal = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('view');
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
  };

  const openDeleteConfirm = (product: Product) => {
    setSelectedProduct(product);
    deleteConfirmModal.open();
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
  };

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Produtos</h1>
            <p className="text-text-muted mt-1">Gerencie seu estoque de produtos</p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total de Produtos</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{totalProducts}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                  <Package className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-1">{lowStockProducts}</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Package className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Valor em Estoque</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">R$ {totalStockValue.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Produtos</CardTitle>
              <div className="relative w-64">
                <Input placeholder="Buscar produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-text-muted mb-4" />
                <p className="text-text-secondary">Nenhum produto encontrado</p>
                <p className="text-sm text-text-muted mt-1">
                  {searchTerm ? 'Tente buscar por outro termo' : 'Crie o primeiro produto para começar'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Nome</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Categoria</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Preço</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Estoque</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary">{product.name}</td>
                        <td className="py-3 px-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">{typeof product.category === 'object' && product.category ? product.category.name : String(product.category || '-')}</span></td>
                        <td className="py-3 px-4 text-sm text-text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                        <td className="py-3 px-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${product.stock && product.stock > 10 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{product.stock ?? 0} un</span></td>
                        <td className="py-3 px-4 text-sm text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(product)} title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => openDeleteConfirm(product)} title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmModal
          isOpen={deleteConfirmModal.isOpen}
          onClose={() => {
            deleteConfirmModal.close();
            setSelectedProduct(null);
          }}
          onConfirm={handleDelete}
          title="Excluir Produto"
          message={`Tem certeza que deseja excluir o produto "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          variant="danger"
        />

        {/* Modal de Criar/Editar/Visualizar Produto */}
        {modalMode && (
          <ProductModal
            mode={modalMode}
            product={selectedProduct ?? undefined}
            isOpen={!!modalMode}
            onClose={handleCloseModal}
          />
        )}
      </div>
    
  );
}
