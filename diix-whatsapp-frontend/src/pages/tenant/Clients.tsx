import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { CustomerModal } from '@/components/modals/CustomerModal';
import { useTenantCustomerStore } from '@/stores/tenantCustomerStore';
import { useModal } from '@/hooks/useModal';
import type { Client } from '@/types';

export default function TenantClients() {
  const { customers, isLoading, fetch, create, update, delete: deleteClient } = useTenantCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais
  const createModal = useModal();
  const editModal = useModal();
  const viewModal = useModal();
  const deleteConfirmModal = useModal();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const filteredClients = customers.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document?.includes(searchTerm)
  );

  const handleCreate = async (data: any) => {
    try {
      await create(data);
      setModalMode(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedClient) return;
    try {
      await update(selectedClient.id, data);
      setModalMode(null);
      setSelectedClient(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient.id);
      deleteConfirmModal.close();
      setSelectedClient(null);
    } catch (error) {
      // Erro já tratado no store
    }
  };

  const openCreateModal = () => {
    setSelectedClient(null);
    setModalMode('create');
  };

  const openViewModal = (client: Client) => {
    setSelectedClient(client);
    setModalMode('view');
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setModalMode('edit');
  };

  const openDeleteConfirm = (client: Client) => {
    setSelectedClient(client);
    deleteConfirmModal.open();
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedClient(null);
  };

  const activeClients = customers.length;
  const totalSpent = 0;
  const avgTicket = 0;

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Clientes</h1>
            <p className="text-text-muted mt-1">Gerencie sua base de clientes</p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total de Clientes</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{customers.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{activeClients}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Ticket Médio</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">R$ {avgTicket.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Faturamento Total</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">R$ {totalSpent.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Clientes</CardTitle>
              <div className="relative w-64">
                <Input placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-text-muted mb-4" />
                <p className="text-text-secondary">Nenhum cliente encontrado</p>
                <p className="text-sm text-text-muted mt-1">
                  {searchTerm ? 'Tente buscar por outro termo' : 'Crie o primeiro cliente para começar'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Nome</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Telefone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Última Visita</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Total Gasto</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary">{client.name}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{client.email || '-'}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{client.phone}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">-</td>
                        <td className="py-3 px-4 text-sm text-text-primary">-</td>
                        <td className="py-3 px-4 text-sm">
                          <StatusBadge status="active" />
                        </td>
                        <td className="py-3 px-4 text-sm text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(client)} title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => openDeleteConfirm(client)} title="Excluir">
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
            setSelectedClient(null);
          }}
          onConfirm={handleDelete}
          title="Excluir Cliente"
          message={`Tem certeza que deseja excluir o cliente "${selectedClient?.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          variant="danger"
        />

        {/* Modal de Criar/Editar/Visualizar Cliente */}
        {modalMode && (
          <CustomerModal
            mode={modalMode}
            client={selectedClient ?? undefined}
            isOpen={!!modalMode}
            onClose={handleCloseModal}
          />
        )}
      </div>
    
  );
}
