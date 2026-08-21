import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Eye, Building2, Plus, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useTenantsStore } from '@/stores/tenantsStore';
import { useModal } from '@/hooks/useModal';
import type { Tenant, CreateTenantDTO, UpdateTenantDTO } from '@/types';

export default function TenantsPage() {
  const { tenants, isLoading, fetchTenants, createTenant, updateTenant, deleteTenant, toggleTenantStatus } = useTenantsStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais
  const createModal = useModal();
  const editModal = useModal();
  const viewModal = useModal();
  const deleteConfirmModal = useModal();
  
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    try {
      await createTenant(data as CreateTenantDTO);
      createModal.close();
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedTenant) return;
    try {
      await updateTenant(selectedTenant.id, data as UpdateTenantDTO);
      editModal.close();
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

  const openViewModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    viewModal.open();
  };

  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    editModal.open();
  };

  const openDeleteConfirm = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    deleteConfirmModal.open();
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
        <Button variant="primary" onClick={createModal.open}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Tenant
        </Button>
      </motion.div>

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
    </div>
  );
}
