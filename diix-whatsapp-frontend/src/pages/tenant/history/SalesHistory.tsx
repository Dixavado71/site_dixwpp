import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Calendar, DollarSign, CreditCard, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useSalesStore } from '@/stores/salesStore';
import type { Sale } from '@/types';

export default function TenantSalesHistory() {
  const { sales, isLoading, fetchSales, filters, setFilters } = useSalesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const tenantId = 'current-tenant-id'; // TODO: Obter do contexto de autenticação

  useEffect(() => {
    setFilters({ tenantId });
    fetchSales({ limit: 50 });
  }, []);

  const filteredSales = sales.filter(sale => 
    sale.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredSales
    .filter(s => s.status === 'completed')
    .reduce((sum, sale) => sum + sale.total, 0);

  const pendingSales = filteredSales.filter(s => s.status === 'pending').length;
  const completedSales = filteredSales.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Histórico de Vendas</h1>
          <p className="text-text-muted mt-1">Consulte todas as vendas realizadas</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total de Vendas</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{filteredSales.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Vendas Completas</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{completedSales}</p>
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
                <p className="text-sm text-text-muted">Vendas Pendentes</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{pendingSales}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Receita Total</p>
                <p className="text-2xl font-bold text-text-primary mt-1">R$ {totalRevenue.toFixed(2)}</p>
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
            <CardTitle>Lista de Vendas</CardTitle>
            <div className="relative w-64">
              <Input 
                placeholder="Buscar venda..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="w-12 h-12 text-text-muted mb-4" />
              <p className="text-text-secondary">Nenhuma venda encontrada</p>
              <p className="text-sm text-text-muted mt-1">
                {searchTerm ? 'Tente buscar por outro termo' : 'Realize vendas para começar'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Pagamento</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-border hover:bg-accent-primary/5">
                      <td className="py-3 px-4 text-sm text-text-primary font-mono">{sale.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-sm text-text-primary">{sale.client?.name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">
                          {sale.paymentMethod === 'cash' ? 'Dinheiro' : 
                           sale.paymentMethod === 'credit' || sale.paymentMethod === 'debit' ? 'Cartão' : 
                           sale.paymentMethod === 'pix' ? 'PIX' : 'Outro'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary font-semibold">
                        R$ {sale.total.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <StatusBadge status={sale.status} />
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
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
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
