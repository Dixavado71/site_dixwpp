import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Search, Edit, Trash2, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PromotionModal } from '@/components/modals/PromotionModal';
import { useModal } from '@/hooks/useModal';
import { useTenantPromotionStore } from '@/stores/tenantPromotionStore';
import { toast } from 'sonner';
import type { Promotion, PromotionFormData } from '@/types';

export default function TenantPromotions() {
  const { promotions, isLoading, fetch, create, update, delete: deletePromotion } = useTenantPromotionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const tenantId = 'current-tenant-id'; // Substituir pelo tenant real
  
  const createModal = useModal();
  const editModal = useModal();
  const deleteConfirmModal = useModal();
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const filteredPromotions = promotions.filter(promo => 
    promo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedPromotion(null);
    setModalMode('create');
  };

  const openEditModal = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setModalMode('edit');
  };

  const openDeleteConfirm = (promo: Promotion) => {
    setSelectedPromotion(promo);
    deleteConfirmModal.open();
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedPromotion(null);
  };

  const handleCreate = async (data: PromotionFormData) => {
    try {
      await create(data);
      setModalMode(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleEdit = async (data: PromotionFormData) => {
    if (!selectedPromotion) return;
    try {
      await update(selectedPromotion.id, data);
      setModalMode(null);
      setSelectedPromotion(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;
    try {
      await deletePromotion(selectedPromotion.id);
      deleteConfirmModal.close();
      setSelectedPromotion(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  // Stats calculations
  const activePromotions = promotions.filter(p => p.active).length;
  const totalDiscount = promotions.reduce((acc, p) => acc + p.discount, 0);
  const averageDiscount = promotions.length > 0 ? totalDiscount / promotions.length : 0;

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Promoções</h1>
            <p className="text-text-muted mt-1">Gerencie suas promoções</p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Promoção
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total de Promoções</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{promotions.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                  <Tag className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Promoções Ativas</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{activePromotions}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Desconto Médio</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{averageDiscount.toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Promoções</CardTitle>
              <div className="relative w-64">
                <Input placeholder="Buscar promoção..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
              </div>
            ) : filteredPromotions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="w-12 h-12 text-text-muted mb-4" />
                <p className="text-text-secondary">Nenhuma promoção encontrada</p>
                <p className="text-sm text-text-muted mt-1">
                  {searchTerm ? 'Tente buscar por outro termo' : 'Crie a primeira promoção para começar'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Título</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Desconto</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Validade</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPromotions.map((promo) => (
                      <tr key={promo.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary">{promo.title}</td>
                        <td className="py-3 px-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">{promo.discount}%</span></td>
                        <td className="py-3 px-4 text-sm text-text-muted">{new Date(promo.endDate).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4 text-sm">
                          <StatusBadge status={promo.active ? 'active' : 'inactive'} />
                        </td>
                        <td className="py-3 px-4 text-sm text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(promo)} title="Editar"><Edit className="h-4 w-4" /></Button>
                          <Button variant="danger" size="sm" onClick={() => openDeleteConfirm(promo)} title="Excluir"><Trash2 className="h-4 w-4" /></Button>
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
            setSelectedPromotion(null);
          }}
          onConfirm={handleDelete}
          title="Excluir Promoção"
          message={`Tem certeza que deseja excluir a promoção "${selectedPromotion?.title}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          variant="danger"
        />

        {/* Modal de Criar/Editar/Visualizar Promoção */}
        {modalMode && (
          <PromotionModal
            mode={modalMode}
            promotion={selectedPromotion ?? undefined}
            isOpen={!!modalMode}
            onClose={handleCloseModal}
            onSave={modalMode === 'create' ? handleCreate : modalMode === 'edit' ? handleEdit : undefined}
          />
        )}
      </div>
    
  );
}
