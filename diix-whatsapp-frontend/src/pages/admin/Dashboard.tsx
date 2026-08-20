import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, CheckCircle, TrendingUp, DollarSign, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AdminLayout from '@/components/layout/AdminLayout';

// Dados fictícios para demonstração
const mockStats = {
  totalTenants: 156,
  totalClients: 2847,
  activeTenants: 142,
  revenue: 45230.50,
  messagesToday: 12543,
  growth: 12.5,
};

const mockRecentTenants = [
  { id: '1', name: 'Barbearia Style', email: 'contato@style.com.br', status: 'active', plan: 'Pro', createdAt: '2024-01-15' },
  { id: '2', name: 'Clínica Saúde+', email: 'admin@saudeplus.com', status: 'active', plan: 'Enterprise', createdAt: '2024-01-14' },
  { id: '3', name: 'Restaurante Sabor', email: 'contato@sabor.com.br', status: 'pending', plan: 'Basic', createdAt: '2024-01-13' },
  { id: '4', name: 'Academia Fit', email: 'contato@fit.com.br', status: 'active', plan: 'Pro', createdAt: '2024-01-12' },
  { id: '5', name: 'Salão Beauty', email: 'contato@beauty.com.br', status: 'inactive', plan: 'Basic', createdAt: '2024-01-11' },
];

export default function AdminDashboard() {
  const [stats] = useState(mockStats);
  const [recentTenants] = useState(mockRecentTenants);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-muted mt-1">Visão geral do sistema</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total de Tenants"
            value={stats.totalTenants}
            icon={<Building2 className="h-5 w-5" />}
            trend="+12%"
          />
          <StatCard
            title="Clientes Totais"
            value={stats.totalClients}
            icon={<Users className="h-5 w-5" />}
            trend="+8%"
          />
          <StatCard
            title="Tenants Ativos"
            value={stats.activeTenants}
            icon={<CheckCircle className="h-5 w-5" />}
            trend="+5%"
          />
          <StatCard
            title="Receita Mensal"
            value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<DollarSign className="h-5 w-5" />}
            trend="+18%"
          />
          <StatCard
            title="Mensagens Hoje"
            value={stats.messagesToday.toLocaleString('pt-BR')}
            icon={<MessageSquare className="h-5 w-5" />}
            trend="+22%"
          />
          <StatCard
            title="Crescimento"
            value={`${stats.growth}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend="Estável"
          />
        </div>

        {/* Recent Tenants Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tenants Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Nome</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Plano</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary">{tenant.name}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{tenant.email}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tenant.plan === 'Enterprise' ? 'bg-accent-cyan/20 text-accent-cyan' :
                            tenant.plan === 'Pro' ? 'bg-accent-primary/20 text-accent-primary' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {tenant.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tenant.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            tenant.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tenant.status === 'active' ? 'Ativo' : tenant.status === 'pending' ? 'Pendente' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-muted">{new Date(tenant.createdAt).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: string }) {
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
            <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
