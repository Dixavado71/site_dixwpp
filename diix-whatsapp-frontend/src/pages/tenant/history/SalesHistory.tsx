import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Calendar, DollarSign, CreditCard, Eye, TrendingUp, PieChart, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useSalesStore } from '@/stores/salesStore';
import { useCategoryStore } from '@/stores/categoryStore';
import type { Sale } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const COLORS = ['#00ff9d', '#00d4ff', '#ff00ff', '#ffff00', '#ff6600', '#9933ff'];

export default function TenantSalesHistory() {
  const { sales, isLoading, fetchSales, filters, setFilters } = useSalesStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0] || '',
    end: new Date().toISOString().split('T')[0] || '',
  });
  const tenantId = 'current-tenant-id';

  useEffect(() => {
    setFilters({ tenantId });
    fetchSales({ limit: 100 });
    fetchCategories();
  }, []);

  // Filtrar vendas por termo de busca, categoria e data
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      sale.items?.some(item => item.categoryId === selectedCategory);
    const saleDate = new Date(sale.createdAt);
    const matchesDate = saleDate >= new Date(dateRange.start) && saleDate <= new Date(dateRange.end + 'T23:59:59');
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalRevenue = filteredSales
    .filter(s => s.status === 'completed')
    .reduce((sum, sale) => sum + sale.total, 0);

  const pendingSales = filteredSales.filter(s => s.status === 'pending').length;
  const completedSales = filteredSales.filter(s => s.status === 'completed').length;
  const cancelledSales = filteredSales.filter(s => s.status === 'cancelled').length;

  // Vendas por categoria
  const salesByCategory = categories.map(cat => {
    const categorySales = filteredSales.filter(sale => 
      sale.items?.some(item => item.categoryId === cat.id) && sale.status === 'completed'
    );
    const totalRevenue = categorySales.reduce((sum, sale) => sum + sale.total, 0);
    return {
      name: cat.name,
      value: totalRevenue,
      color: cat.color || '#00ff9d',
    };
  }).filter(cat => cat.value > 0);

  // Histórico de vendas por dia
  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const daySales = filteredSales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === date.toDateString() && sale.status === 'completed';
    });
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
      count: daySales.length,
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Histórico de Vendas</h1>
          <p className="text-text-muted mt-1">Consulte e analise todas as vendas realizadas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* Filtros */}
      <Card className="glass-card border-white/10">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  placeholder="Buscar por cliente ou ID..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="all">Todas Categorias</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1"
              />
              <Input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <p className="text-2xl font-bold text-green-400 mt-1">{completedSales}</p>
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
                <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingSales}</p>
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
                <p className="text-2xl font-bold text-green-400 mt-1">R$ {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evolução Diária */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-primary" />
              <CardTitle>Evolução Diária (7 dias)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {salesByDay.length === 0 || salesByDay.every(d => d.revenue === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingUp className="w-10 h-10 text-text-muted mb-3" />
                <p className="text-text-secondary">Nenhum dado disponível</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
                  <Tooltip 
                    formatter={(value: any) => `R$ ${String(value)}`}
                    contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.95)', border: '1px solid rgba(0, 255, 157, 0.2)', borderRadius: '8px', color: '#e0e0e0' }}
                  />
                  <Bar dataKey="revenue" fill="#00ff9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Vendas por Categoria */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-accent-primary" />
              <CardTitle>Vendas por Categoria</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {salesByCategory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <PieChart className="w-10 h-10 text-text-muted mb-3" />
                <p className="text-text-secondary">Nenhum dado por categoria</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `R$ ${String(value)}`}
                      contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.95)', border: '1px solid rgba(0, 255, 157, 0.2)', borderRadius: '8px', color: '#e0e0e0' }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2">
                  {salesByCategory.slice(0, 6).map((cat, index) => (
                    <div key={cat.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || COLORS[index % COLORS.length] }} />
                      <span className="text-text-muted truncate">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Vendas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-accent-primary" />
              Lista de Vendas
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Filter className="w-4 h-4" />
              {filteredSales.length} venda(s) encontrada(s)
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
                {searchTerm || selectedCategory !== 'all' ? 'Tente ajustar os filtros' : 'Realize vendas para começar'}
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
