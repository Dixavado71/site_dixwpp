import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Scissors, Calendar, TrendingUp, MessageSquare, DollarSign, ShoppingCart, Star, Clock, Plus, PieChart, History, FileText, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSalesStore } from '@/stores/salesStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';


const mockStats = {
  totalClients: 234,
  totalProducts: 45,
  totalServices: 12,
  appointmentsToday: 8,
  messagesToday: 156,
  revenue: 3250.00,
  growth: 12.5,
  activePromotions: 5,
};

const COLORS = ['#00ff9d', '#00d4ff', '#ff00ff', '#ffff00', '#ff6600', '#9933ff', '#00ff66', '#ff3366'];

const mockRecentSales = [
  { id: '1', customer: 'Maria Silva', service: 'Corte + Barba', value: 85.00, status: 'completed', date: '2024-01-15' },
  { id: '2', customer: 'João Santos', service: 'Hidratação Capilar', value: 120.00, status: 'completed', date: '2024-01-15' },
  { id: '3', customer: 'Ana Costa', service: 'Manicure', value: 45.00, status: 'pending', date: '2024-01-14' },
  { id: '4', customer: 'Pedro Oliveira', service: 'Corte de Cabelo', value: 60.00, status: 'completed', date: '2024-01-14' },
  { id: '5', customer: 'Lucia Ferreira', service: 'Pedicure + Manicure', value: 90.00, status: 'cancelled', date: '2024-01-13' },
];

const mockTopProducts = [
  { id: '1', name: 'Shampoo Premium', sales: 45, stock: 25 },
  { id: '2', name: 'Condicionador Hidratante', sales: 38, stock: 18 },
  { id: '3', name: 'Máscara Capilar', sales: 32, stock: 12 },
  { id: '4', name: 'Óleo Finalizador', sales: 28, stock: 8 },
  { id: '5', name: 'Spray Fixador', sales: 25, stock: 30 },
];

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { sales, fetchSales } = useSalesStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [stats] = useState(mockStats);
  const [recentSales] = useState(mockRecentSales);
  const [topProducts] = useState(mockTopProducts);

  useEffect(() => {
    fetchSales({ limit: 50 });
    fetchCategories();
  }, []);

  // Calcular vendas por categoria
  const salesByCategory = categories.map(cat => {
    const categorySales = sales.filter(sale => 
      sale.items?.some(item => item.categoryId === cat.id)
    );
    const totalRevenue = categorySales.reduce((sum, sale) => sum + sale.total, 0);
    return {
      name: cat.name,
      value: totalRevenue,
      color: cat.color || '#00ff9d',
    };
  }).filter(cat => cat.value > 0);

  // Histórico de vendas dos últimos 7 dias
  const salesHistory = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const daySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === date.toDateString() && sale.status === 'completed';
    });
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
      count: daySales.length,
    };
  }).reverse();

  // Calcular totais para resumo
  const totalRevenue7Days = salesHistory.reduce((sum, d) => sum + d.revenue, 0);
  const avgDailyRevenue = totalRevenue7Days / 7;
  const totalSalesCount = salesHistory.reduce((sum, d) => sum + d.count, 0);

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">Visão geral do seu negócio</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => navigate('/tenant/history/sales')} className="flex-1 sm:flex-none">
              <History className="w-4 h-4 mr-2" />
              Vendas
            </Button>
            <Button variant="primary" onClick={() => navigate('/tenant/sales/new')} className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-2" />
              Nova Venda
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards - Principais KPIs */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Receita Mensal"
            value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<DollarSign className="h-5 w-5" />}
            trend="+8%"
            color="green"
          />
          <StatCard
            title="Vendas Hoje"
            value={recentSales.filter(s => s.status === 'completed').length}
            icon={<ShoppingCart className="h-5 w-5" />}
            trend="+3"
            color="blue"
          />
          <StatCard
            title="Clientes Totais"
            value={stats.totalClients}
            icon={<Users className="h-5 w-5" />}
            trend="+12"
            color="cyan"
          />
          <StatCard
            title="Agendamentos Hoje"
            value={stats.appointmentsToday}
            icon={<Calendar className="h-5 w-5" />}
            trend="+2"
            color="orange"
          />
        </div>

        {/* Gráficos Principais */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Histórico de Vendas - Gráfico de Linha */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent-primary" />
                  <CardTitle>Evolução de Vendas (7 dias)</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tenant/reports')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {salesHistory.length === 0 || salesHistory.every(d => d.revenue === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="w-12 h-12 text-text-muted mb-4" />
                  <p className="text-text-secondary">Nenhum dado de vendas</p>
                  <p className="text-sm text-text-muted mt-1">Realize vendas para visualizar o histórico</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={salesHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#a0a0a0" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#a0a0a0" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `R$ ${value}`}
                      />
                      <Tooltip 
                        formatter={(value: any) => `R$ ${String(value)}`}
                        contentStyle={{ 
                          backgroundColor: 'rgba(5, 5, 5, 0.95)', 
                          border: '1px solid rgba(0, 255, 157, 0.2)',
                          borderRadius: '8px',
                          color: '#e0e0e0'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#00ff9d" 
                        strokeWidth={2}
                        dot={{ fill: '#00ff9d', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  {/* Resumo */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-text-muted">Total (7 dias)</p>
                      <p className="text-lg font-bold text-text-primary">
                        R$ {totalRevenue7Days.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Média diária</p>
                      <p className="text-lg font-bold text-text-primary">
                        R$ {avgDailyRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Vendas</p>
                      <p className="text-lg font-bold text-accent-primary">
                        {totalSalesCount}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendas por Categoria - Gráfico de Pizza */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-accent-primary" />
                  <CardTitle>Vendas por Categoria</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tenant/history/sales')}>
                  <History className="h-4 w-4 mr-2" />
                  Ver histórico
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {salesByCategory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <PieChart className="w-12 h-12 text-text-muted mb-4" />
                  <p className="text-text-secondary">Nenhuma venda por categoria</p>
                  <p className="text-sm text-text-muted mt-1">Realize vendas para visualizar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie
                        data={salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => `R$ ${String(value)}`}
                        contentStyle={{ 
                          backgroundColor: 'rgba(5, 5, 5, 0.95)', 
                          border: '1px solid rgba(0, 255, 157, 0.2)',
                          borderRadius: '8px',
                          color: '#e0e0e0'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  {/* Legenda */}
                  <div className="grid grid-cols-2 gap-2">
                    {salesByCategory.slice(0, 6).map((cat, index) => (
                      <div key={cat.name} className="flex items-center gap-2 text-xs">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cat.color || COLORS[index % COLORS.length] }}
                        />
                        <span className="text-text-muted truncate">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas e Stats Secundários */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Ações Rápidas */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <QuickAction icon={<Users />} label="Cliente" onClick={() => navigate('/tenant/clients')} />
                <QuickAction icon={<Package />} label="Produto" onClick={() => navigate('/tenant/products')} />
                <QuickAction icon={<Scissors />} label="Serviço" onClick={() => navigate('/tenant/services')} />
                <QuickAction icon={<Percent />} label="Promoção" onClick={() => navigate('/tenant/promotions')} />
                <QuickAction icon={<Calendar />} label="Agendar" onClick={() => navigate('/tenant/sales/new')} />
                <QuickAction icon={<BarChart3 />} label="Relatórios" onClick={() => navigate('/tenant/reports')} />
                <QuickAction icon={<MessageSquare />} label="Mensagens" onClick={() => navigate('/tenant/messages')} />
                <QuickAction icon={<Star />} label="Config" onClick={() => navigate('/tenant/settings')} />
              </div>
            </CardContent>
          </Card>

          {/* Stats Secundários */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Resumo do Negócio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Produtos</p>
                      <p className="text-lg font-bold text-text-primary">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Scissors className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Serviços</p>
                      <p className="text-lg font-bold text-text-primary">{stats.totalServices}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Mensagens</p>
                      <p className="text-lg font-bold text-text-primary">{stats.messagesToday}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                      <Star className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Promoções</p>
                      <p className="text-lg font-bold text-text-primary">{stats.activePromotions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendas Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-accent-primary" />
                  Vendas Recentes
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tenant/history/sales')}>Ver todas</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Serviço</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Valor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary">{sale.customer}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{sale.service}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">R$ {sale.value.toFixed(2).replace('.', ',')}</td>
                        <td className="py-3 px-4 text-sm">
                          <StatusBadge
                            status={sale.status === 'completed' ? 'completed' : sale.status === 'pending' ? 'pending' : 'cancelled'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    
  );
}

function StatCard({ title, value, icon, trend, color = 'blue' }: { title: string; value: string | number; icon: React.ReactNode; trend: string; color?: string }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    orange: 'bg-orange-500/10 text-orange-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="glass-card border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">{title}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
              <p className="text-xs text-accent-primary mt-2">{trend}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="p-2.5 sm:p-3 rounded-xl bg-accent-primary/10 text-accent-primary mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] sm:text-xs text-text-secondary text-center">{label}</span>
    </button>
  );
}
