import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PromotionModal } from '@/components/modals/PromotionModal';
import { useModal } from '@/hooks/useModal';
import { toast } from 'sonner';

const mockPromotions = [
  { id: '1', title: 'Corte + Barba Promoção', discount: 20, type: 'percentage', validUntil: '2024-02-28', active: true },
  { id: '2', title: 'Hidratação Grátis', discount: 30, type: 'fixed', validUntil: '2024-02-15', active: true },
  { id: '3', title: 'Primeira Visita 15% OFF', discount: 15, type: 'percentage', validUntil: '2024-03-31', active: false },
];

export default function TenantPromotions() {
  const [promotions, setPromotions] = useState<typeof mockPromotions>([...mockPromotions]);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPromotions = promotions.filter(promo => promo.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const createModal = useModal();
  const editModal = useModal();
  const deleteConfirmModal = useModal();
  const [selectedPromotion, setSelectedPromotion] = useState<typeof mockPromotions[number] | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);

  const openCreateModal = () => {
    setSelectedPromotion(null);
    setModalMode('create');
  };

  const openEditModal = (promo: typeof mockPromotions[number]) => {
    setSelectedPromotion(promo);
    setModalMode('edit');
  };

  const openDeleteConfirm = (promo: typeof mockPromotions[number]) => {
    setSelectedPromotion(promo);
    deleteConfirmModal.open();
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedPromotion(null);
  };

  const handleCreate = (data: any) => {
    const newPromo = {
      id: String(Date.now()),
      ...data,
    };
    setPromotions((prev) => [...prev, newPromo]);
    toast.success('Promoção criada com sucesso!');
    handleCloseModal();
  };

  const handleEdit = (data: any) => {
    if (!selectedPromotion) return;
    setPromotions((prev) => prev.map(p => p.id === selectedPromotion.id ? { ...p, ...data } : p));
    toast.success('Promoção atualizada com sucesso!');
    handleCloseModal();
  };

  const handleDelete = () => {
    if (!selectedPromotion) return;
    setPromotions((prev) => prev.filter(p => p.id !== selectedPromotion.id));
    toast.success(`${selectedPromotion.title} removida com sucesso!`);
    deleteConfirmModal.close();
    setSelectedPromotion(null);
  };

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
                      <td className="py-3 px-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">{promo.type === 'percentage' ? `${promo.discount}%` : `R$ ${promo.discount}`}</span></td>
                      <td className="py-3 px-4 text-sm text-text-muted">{new Date(promo.validUntil).toLocaleDateString('pt-BR')}</td>
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
