import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Plus, Search, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useModal } from '@/hooks/useModal';
import { toast } from 'sonner';

const mockServices = [
  { id: '1', name: 'Corte de Cabelo', price: 60.00, duration: 45, category: 'Cabelo', active: true },
  { id: '2', name: 'Barba Completa', price: 35.00, duration: 30, category: 'Barba', active: true },
  { id: '3', name: 'Corte + Barba', price: 85.00, duration: 75, category: 'Combo', active: true },
  { id: '4', name: 'Hidratação Capilar', price: 120.00, duration: 90, category: 'Tratamento', active: true },
  { id: '5', name: 'Manicure', price: 45.00, duration: 40, category: 'Unhas', active: false },
  { id: '6', name: 'Pedicure', price: 50.00, duration: 45, category: 'Unhas', active: true },
];

export default function TenantServices() {
  const [services] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredServices = services.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const deleteConfirmModal = useModal();
  const [selectedService, setSelectedService] = useState<typeof mockServices[0] | null>(null);

  const openDeleteConfirm = (service: typeof mockServices[0]) => {
    setSelectedService(service);
    deleteConfirmModal.open();
  };

  const handleDelete = () => {
    if (!selectedService) return;
    toast.success(`${selectedService.name} removido com sucesso!`);
    deleteConfirmModal.close();
    setSelectedService(null);
  };

  const handleEdit = (service: typeof mockServices[0]) => {
    toast.info(`Editar ${service.name}`);
  };

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Serviços</h1>
            <p className="text-text-muted mt-1">Gerencie sua grade de serviços</p>
          </div>
          <Button variant="primary" onClick={() => toast.info('Novo Serviço')} >
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
                  <p className="text-2xl font-bold text-text-primary mt-1">{services.filter(s => s.active).length}</p>
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
                  <p className="text-2xl font-bold text-text-primary mt-1">R$ {(services.reduce((acc, s) => acc + s.price, 0) / services.length).toFixed(2)}</p>
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
                      <td className="py-3 px-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">{service.category}</span></td>
                      <td className="py-3 px-4 text-sm text-text-primary">R$ {service.price.toFixed(2).replace('.', ',')}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">{service.duration} min</td>
                      <td className="py-3 px-4 text-sm">
                        <StatusBadge status={service.active ? 'active' : 'inactive'} />
                      </td>
                      <td className="py-3 px-4 text-sm text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(service)} title="Editar"><Edit className="h-4 w-4" /></Button>
                        <Button variant="danger" size="sm" onClick={() => openDeleteConfirm(service)} title="Excluir"><Trash2 className="h-4 w-4" /></Button>
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
            setSelectedService(null);
          }}
          onConfirm={handleDelete}
          title="Excluir Serviço"
          message={`Tem certeza que deseja excluir o serviço "${selectedService?.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          variant="danger"
        />
      </div>
    
  );
}
