import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageSquare, Package, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tenantService } from '@/services';
import type { DashboardStats, Product, Client } from '@/types';
import { toast } from 'sonner';

export default function TenantDashboard() {
  const queryClient = useQueryClient();

  // Fetch dashboard stats from API
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['tenantDashboardStats'],
    queryFn: async () => {
      const response = await tenantService.getDashboardStats();
      return response;
    },
  });

  // Fetch products for top products list
  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await tenantService.getProducts();
      return response.slice(0, 5);
    },
  });

  // Fetch clients count
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await tenantService.getClients();
      return response;
    },
  });

  // Mock messages data - will be replaced with real API data
  const messagesData = [
    { day: 'Seg', mensagens: stats?.messagesSentToday || 120 },
    { day: 'Ter', mensagens: 180 },
    { day: 'Qua', mensagens: 150 },
    { day: 'Qui', mensagens: 220 },
    { day: 'Sex', mensagens: 190 },
    { day: 'Sab', mensagens: 80 },
    { day: 'Dom', mensagens: 50 },
  ];

  const kpiCards = [
    {
      title: 'Total de Clientes',
      value: clients?.length.toString() || stats?.totalClients?.toString() || '0',
      icon: Users,
      color: 'from-accent-primary to-accent-cyan',
      glow: 'neon-glow-green',
    },
    {
      title: 'Mensagens Hoje',
      value: stats?.messagesSentToday?.toString() || '0',
      icon: MessageSquare,
      color: 'from-accent-secondary to-accent-cyan',
      glow: 'neon-glow-purple',
    },
    {
      title: 'Campanhas Ativas',
      value: stats?.activeCampaigns?.toString() || '0',
      icon: TrendingUp,
      color: 'from-accent-cyan to-accent-primary',
      glow: 'neon-glow-cyan',
    },
    {
      title: 'Produtos Cadastrados',
      value: stats?.totalProducts?.toString() || products?.length.toString() || '0',
      icon: Package,
      color: 'from-accent-primary to-accent-secondary',
      glow: 'neon-glow-green',
    },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-muted">Visão geral da sua conta DiixWhatsApp</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center ${card.glow}`}>
                <card.icon className="w-6 h-6 text-black" />
              </div>
            </div>
            <p className="text-text-muted text-sm mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-text-primary">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-6">Desempenho de Mensagens</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messagesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="#a0a0a0"
                  tick={{ fill: '#a0a0a0' }}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  tick={{ fill: '#a0a0a0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 18, 18, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
                <Bar
                  dataKey="mensagens"
                  fill="#00ff9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-6">Top Produtos/Serviços</h2>
          <div className="space-y-4">
            {[
              { name: 'Consultoria Premium', sales: 156, revenue: 'R$ 15.600' },
              { name: 'Pacote Mensal', sales: 124, revenue: 'R$ 12.400' },
              { name: 'Treinamento', sales: 98, revenue: 'R$ 9.800' },
              { name: 'Suporte Técnico', sales: 87, revenue: 'R$ 8.700' },
              { name: 'Implementação', sales: 65, revenue: 'R$ 6.500' },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center text-black font-bold">
                    {index + 1}
                  </div>
                  <span className="text-text-primary font-medium">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-semibold">{product.sales} vendas</p>
                  <p className="text-xs text-text-muted">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
