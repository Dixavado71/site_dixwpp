import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, DollarSign, Loader2, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminService } from '@/services';
import type { DashboardStats, Tenant } from '@/types';

interface AdminDashboardData {
  data: {
    stats: {
      totalTenants: number;
      activeTenants: number;
      totalUsers: number;
      totalProducts: number;
      totalClients: number;
    };
    tenants: Tenant[];
    recentTenants: Tenant[];
  };
}

export default function AdminDashboard() {
  // Fetch dashboard stats from API - GET /api/v1/admin/dashboard
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const response = await adminService.getDashboardStats();
      return response as AdminDashboardData;
    },
  });

  const stats = dashboardData?.data.stats;
  const tenants = dashboardData?.data.tenants || [];
  const recentTenants = dashboardData?.data.recentTenants || [];

  // Generate chart data from recent tenants
  const chartData = recentTenants.map((tenant, index) => ({
    date: new Date(tenant.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    tenants: index + 1,
  }));

  const kpiCards = [
    {
      title: 'Total de Tenants',
      value: stats?.totalTenants?.toString() || '0',
      icon: Building2,
      color: 'from-accent-primary to-accent-cyan',
      glow: 'neon-glow-green',
    },
    {
      title: 'Tenants Ativos',
      value: stats?.activeTenants?.toString() || '0',
      icon: Users,
      color: 'from-accent-secondary to-accent-cyan',
      glow: 'neon-glow-purple',
    },
    {
      title: 'Usuários Totais',
      value: stats?.totalUsers?.toString() || '0',
      icon: TrendingUp,
      color: 'from-accent-cyan to-accent-primary',
      glow: 'neon-glow-cyan',
    },
    {
      title: 'Total de Produtos',
      value: stats?.totalProducts?.toString() || '0',
      icon: DollarSign,
      color: 'from-accent-primary to-accent-secondary',
      glow: 'neon-glow-green',
    },
  ];

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-text-primary text-lg font-bold">Erro ao carregar dashboard</p>
          <p className="text-text-muted">Tente recarregar a página</p>
        </div>
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
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard Admin</h1>
        <p className="text-text-muted">Visão geral do sistema DiixWhatsApp</p>
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

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-text-primary mb-6">Crescimento de Tenants (30 dias)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="date" 
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
              <Line
                type="monotone"
                dataKey="tenants"
                stroke="#00ff9d"
                strokeWidth={2}
                dot={{ fill: '#00ff9d', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#00ff9d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Tenants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-text-primary mb-6">Últimos Tenants Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Empresa</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Email</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length > 0 ? (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-text-primary">{tenant.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{tenant.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tenant.active ? 'bg-accent-primary/10 text-accent-primary' : 'bg-error/10 text-error'
                      }`}>
                        {tenant.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted">
                    Nenhum tenant cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
