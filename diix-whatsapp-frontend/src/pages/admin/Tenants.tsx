import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Eye, Building2, Plus, CreditCard, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { TenantModal } from '@/components/modals/TenantModal';
import { useTenantsStore } from '@/stores/tenantsStore';
import { useModal } from '@/hooks/useModal';
import type { Tenant, CreateTenantDTO, UpdateTenantDTO, TenantFormData } from '@/types';

export default function TenantsPage() {
  const { tenants, isLoading, fetchTenants, createTenant, updateTenant, deleteTenant, toggleTenantStatus } = useTenantsStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais
  const createModal = useModal();
  const editModal = useModal();
  const viewModal = useModal();
  const deleteConfirmModal = useModal();
  
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculations
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.active).length;
  const inactiveTenants = tenants.filter(t => !t.active).length;
  const monthlyRevenue = tenants.reduce((acc, tenant) => {
    const planPrices: Record<string, number> = {
      basic: 99,
      standard: 149,
      premium: 299,
      enterprise: 599
    };
    return acc + (planPrices[tenant.plan?.toLowerCase() ?? 'standard'] ?? 149);
  }, 0);

  const handleCreate = async (data: TenantFormData) => {
    try {
      await createTenant(data as CreateTenantDTO);
      setModalMode(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleEdit = async (data: TenantFormData) => {
    if (!selectedTenant) return;
    try {
      await updateTenant(selectedTenant.id, data as UpdateTenantDTO);
      setModalMode(null);
      setSelectedTenant(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleDelete = async () => {
    if (!selectedTenant) return;
    try {
      await deleteTenant(selectedTenant.id);
      deleteConfirmModal.close();
      setSelectedTenant(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleToggleStatus = async (tenant: Tenant) => {
    try {
      await toggleTenantStatus(tenant.id);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const openCreateModal = () => {
    setSelectedTenant(null);
    setModalMode('create');
  };

  const openViewModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setModalMode('view');
  };

  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setModalMode('edit');
  };

  const openDeleteConfirm = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    deleteConfirmModal.open();
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedTenant(null);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tenants</h1>
          <p className="text-text-muted mt-1">Gerencie os tenants do sistema</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Tenant
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Tenants</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{totalTenants}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Tenants Ativos</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{activeTenants}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Tenants Inativos</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{inactiveTenants}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Receita Mensal</p>
                <p className="text-2xl font-bold text-text-primary mt-1">R$ {monthlyRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Tenants</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input 
                placeholder="Buscar tenant..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="w-12 h-12 text-text-muted mb-4" />
              <p className="text-text-secondary">Nenhum tenant encontrado</p>
              <p className="text-sm text-text-muted mt-1">
                {searchTerm ? 'Tente buscar por outro termo' : 'Crie o primeiro tenant para começar'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Plano</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-border hover:bg-accent-primary/5">
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="font-medium">{tenant.name}</div>
                        {tenant.businessName && (
                          <div className="text-xs text-text-muted">{tenant.businessName}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">{tenant.email}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary capitalize">
                          {tenant.plan || 'standard'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <StatusBadge status={tenant.active ? 'active' : 'inactive'} />
                      </td>
                      <td className="py-3 px-4 text-sm text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openViewModal(tenant)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditModal(tenant)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleStatus(tenant)}
                          title={tenant.active ? 'Suspender' : 'Ativar'}
                        >
                          {tenant.active ? (
                            <CreditCard className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => openDeleteConfirm(tenant)}
                          title="Excluir"
                        >
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
          setSelectedTenant(null);
        }}
        onConfirm={handleDelete}
        title="Excluir Tenant"
        message={`Tem certeza que deseja excluir o tenant "${selectedTenant?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
      />

      {/* Modal de Criar/Editar/Visualizar Tenant */}
      {modalMode && (
        <TenantModal
          mode={modalMode}
          tenant={selectedTenant ?? undefined}
          open={!!modalMode}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
