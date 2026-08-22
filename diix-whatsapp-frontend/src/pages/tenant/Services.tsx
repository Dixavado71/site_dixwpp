import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Plus, Search, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ServiceModal } from '@/components/modals/ServiceModal';
import { useModal } from '@/hooks/useModal';
import { useTenantServiceStore } from '@/stores/tenantServiceStore';
import { toast } from 'sonner';
import type { Service, ServiceFormData } from '@/types';

export default function TenantServices() {
  const { services, isLoading, fetch, create, update, delete: deleteService } = useTenantServiceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const tenantId = 'current-tenant-id'; // Substituir pelo tenant real
  
  const createModal = useModal();
  const editModal = useModal();
  const deleteConfirmModal = useModal();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);

  useEffect(() => {
    // Configurar tenantId e buscar serviços
    const store = useTenantServiceStore.getState();
    store.setTenantId(tenantId);
  }, []);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedService(null);
    setModalMode('create');
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setModalMode('edit');
  };

  const openDeleteConfirm = (service: Service) => {
    setSelectedService(service);
    deleteConfirmModal.open();
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedService(null);
  };

  const handleCreate = async (data: ServiceFormData) => {
    try {
      await create(data);
      setModalMode(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleEdit = async (data: ServiceFormData) => {
    if (!selectedService) return;
    try {
      await update(selectedService.id, data);
      setModalMode(null);
      setSelectedService(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      await deleteService(selectedService.id);
      deleteConfirmModal.close();
      setSelectedService(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const activeServices = services.filter(s => s.active).length;
  const averagePrice = services.length > 0 
    ? services.reduce((acc, s) => acc + s.price, 0) / services.length 
    : 0;

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Serviços</h1>
            <p className="text-text-muted mt-1">Gerencie sua grade de serviços</p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total de Serviços</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{services.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                  <Scissors className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Serviços Ativos</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{activeServices}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Preço Médio</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">R$ {averagePrice.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Serviços</CardTitle>
              <div className="relative w-64">
                <Input placeholder="Buscar serviço..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Scissors className="w-12 h-12 text-text-muted mb-4" />
                <p className="text-text-secondary">Nenhum serviço encontrado</p>
                <p className="text-sm text-text-muted mt-1">
                  {searchTerm ? 'Tente buscar por outro termo' : 'Crie o primeiro serviço para começar'}
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Duração</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary">{service.name}</td>
                        <td className="py-3 px-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">{service.categoryId || '-'}</span></td>
                        <td className="py-3 px-4 text-sm text-text-primary">R$ {service.price.toFixed(2).replace('.', ',')}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{service.duration} min</td>
                        <td className="py-3 px-4 text-sm">
                          <StatusBadge status={service.active ? 'active' : 'inactive'} />
                        </td>
                        <td className="py-3 px-4 text-sm text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(service)} title="Editar"><Edit className="h-4 w-4" /></Button>
                          <Button variant="danger" size="sm" onClick={() => openDeleteConfirm(service)} title="Excluir"><Trash2 className="h-4 w-4" /></Button>
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
            setSelectedService(null);
          }}
          onConfirm={handleDelete}
          title="Excluir Serviço"
          message={`Tem certeza que deseja excluir o serviço "${selectedService?.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          variant="danger"
        />

        {/* Modal de Criar/Editar/Visualizar Serviço */}
        {modalMode && (
          <ServiceModal
            mode={modalMode}
            service={selectedService ?? undefined}
            isOpen={!!modalMode}
            onClose={handleCloseModal}
            onSave={modalMode === 'create' ? handleCreate : modalMode === 'edit' ? handleEdit : undefined}
          />
        )}
      </div>
    
  );
}
