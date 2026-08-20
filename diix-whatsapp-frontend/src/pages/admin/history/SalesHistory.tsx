import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Sale } from '@/types';

const mockSales: Sale[] = [
  { id: '1', tenantId: '1', clientId: '1', items: [], total: 150.00, status: 'completed', paymentMethod: 'credit', createdAt: '2024-12-10T10:00:00Z', updatedAt: '2024-12-10T10:00:00Z' },
  { id: '2', tenantId: '1', clientId: '2', items: [], total: 89.90, status: 'pending', paymentMethod: 'pix', createdAt: '2024-12-10T11:30:00Z', updatedAt: '2024-12-10T11:30:00Z' },
  { id: '3', tenantId: '2', clientId: '3', items: [], total: 250.00, status: 'completed', paymentMethod: 'debit', createdAt: '2024-12-09T14:00:00Z', updatedAt: '2024-12-09T14:00:00Z' },
  { id: '4', tenantId: '2', clientId: '4', items: [], total: 45.50, status: 'cancelled', paymentMethod: 'cash', createdAt: '2024-12-08T09:15:00Z', updatedAt: '2024-12-08T09:15:00Z' },
];

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [dateRange, setDateRange] = useState('');

  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalSold: mockSales.reduce((acc, sale) => acc + sale.total, 0),
    averageTicket: mockSales.reduce((acc, sale) => acc + sale.total, 0) / mockSales.length,
    conversionRate: (mockSales.filter(s => s.status === 'completed').length / mockSales.length) * 100,
  };

  const handleExport = () => {
    // Implementar export CSV/PDF
    console.log('Exporting...');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-primary">Histórico de Vendas</h1>
        <p className="text-text-muted mt-1">Acompanhe todas as vendas realizadas</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Vendido</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  R$ {stats.totalSold.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Ticket Médio</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  R$ {stats.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-secondary/10 text-accent-secondary">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary"
            >
              <option value="all">Todos os Status</option>
              <option value="completed">Concluído</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <Input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-auto"
            />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="primary" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Data</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Valor</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Pagamento</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-white/5">
                    <td className="py-4 px-6 text-sm text-text-primary">#{sale.id}</td>
                    <td className="py-4 px-6 text-sm text-text-muted">
                      {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6 text-sm text-text-primary">
                      R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-text-secondary capitalize">
                        {sale.paymentMethod || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sale.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        sale.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {sale.status === 'completed' ? 'Concluído' : sale.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
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
