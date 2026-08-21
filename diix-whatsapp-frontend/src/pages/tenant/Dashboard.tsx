import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Scissors, Calendar, TrendingUp, MessageSquare, DollarSign, ShoppingCart, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Percent } from 'lucide-react';


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
  const [stats] = useState(mockStats);
  const [recentSales] = useState(mockRecentSales);
  const [topProducts] = useState(mockTopProducts);

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-muted mt-1">Visão geral do seu negócio</p>
          </div>
          <Button variant="primary">Nova Venda</Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Clientes Totais"
            value={stats.totalClients}
            icon={<Users className="h-5 w-5" />}
            trend="+12"
            color="blue"
          />
          <StatCard
            title="Produtos"
            value={stats.totalProducts}
            icon={<Package className="h-5 w-5" />}
            trend="+5"
            color="green"
          />
          <StatCard
            title="Serviços"
            value={stats.totalServices}
            icon={<Scissors className="h-5 w-5" />}
            trend="Estável"
            color="purple"
          />
          <StatCard
            title="Agendamentos Hoje"
            value={stats.appointmentsToday}
            icon={<Calendar className="h-5 w-5" />}
            trend="+2"
            color="orange"
          />
          <StatCard
            title="Mensagens Hoje"
            value={stats.messagesToday}
            icon={<MessageSquare className="h-5 w-5" />}
            trend="+18"
            color="cyan"
          />
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
            title="Promoções Ativas"
            value={stats.activePromotions}
            icon={<Star className="h-5 w-5" />}
            trend="Estável"
            color="yellow"
          />
        </div>

        {/* Recent Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendas Recentes</CardTitle>
                <Button variant="ghost" size="sm">Ver todas</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Serviço</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Valor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary">{sale.customer}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{sale.service}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">R$ {sale.value.toFixed(2).replace('.', ',')}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
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

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-500/20 text-gray-400' :
                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-accent-primary/10 text-accent-primary'
                      }`}>
                        {index + 1}º
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{product.name}</p>
                        <p className="text-xs text-text-muted">{product.stock} em estoque</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">{product.sales} vendas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <QuickAction icon={<Users />} label="Novo Cliente" href="/tenant/clients" />
                <QuickAction icon={<Package />} label="Novo Produto" href="/tenant/products" />
                <QuickAction icon={<Scissors />} label="Novo Serviço" href="/tenant/services" />
                <QuickAction icon={<Percent />} label="Nova Promoção" href="/tenant/promotions" />
                <QuickAction icon={<Calendar />} label="Agendamento" href="/tenant/sales/new" />
                <QuickAction icon={<DollarSign />} label="Relatório" href="/tenant/settings" />
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

function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs text-text-secondary text-center">{label}</span>
    </a>
  );
}
