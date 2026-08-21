import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

const mockClients = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 98765-4321', lastVisit: '2024-01-15', totalSpent: 450.00, status: 'active' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', phone: '(11) 97654-3210', lastVisit: '2024-01-14', totalSpent: 320.00, status: 'active' },
  { id: '3', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 96543-2109', lastVisit: '2024-01-10', totalSpent: 180.00, status: 'active' },
  { id: '4', name: 'Pedro Oliveira', email: 'pedro@email.com', phone: '(11) 95432-1098', lastVisit: '2023-12-20', totalSpent: 95.00, status: 'inactive' },
  { id: '5', name: 'Lucia Ferreira', email: 'lucia@email.com', phone: '(11) 94321-0987', lastVisit: '2024-01-12', totalSpent: 275.00, status: 'active' },
];

export default function TenantClients() {
  const [clients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredClients = clients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Clientes</h1>
            <p className="text-text-muted mt-1">Gerencie sua base de clientes</p>
          </div>
          <Button variant="primary">
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
                  <p className="text-2xl font-bold text-text-primary mt-1">{clients.length}</p>
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
                  <p className="text-2xl font-bold text-text-primary mt-1">{clients.filter(c => c.status === 'active').length}</p>
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
                  <p className="text-2xl font-bold text-text-primary mt-1">R$ {(clients.reduce((acc, c) => acc + c.totalSpent, 0) / clients.length).toFixed(2)}</p>
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
                  <p className="text-2xl font-bold text-text-primary mt-1">R$ {clients.reduce((acc, c) => acc + c.totalSpent, 0).toFixed(2)}</p>
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
                      <td className="py-3 px-4 text-sm text-text-muted">{client.email}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">{client.phone}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">{new Date(client.lastVisit).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 px-4 text-sm text-text-primary">R$ {client.totalSpent.toFixed(2).replace('.', ',')}</td>
                      <td className="py-3 px-4 text-sm">
                        <StatusBadge status={client.status === 'active' ? 'active' : 'inactive'} />
                      </td>
                      <td className="py-3 px-4 text-sm text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Editar ${client.name}`)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="danger" size="sm" onClick={() => toast.success(`${client.name} removido`)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
