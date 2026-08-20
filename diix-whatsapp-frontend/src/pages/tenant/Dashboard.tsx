import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Scissors, Calendar, TrendingUp, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import TenantLayout from '@/components/layout/TenantLayout';

const mockStats = {
  totalClients: 234,
  totalProducts: 45,
  totalServices: 12,
  appointmentsToday: 8,
  messagesToday: 156,
  revenue: 3250.00,
};

export default function TenantDashboard() {
  const [stats] = useState(mockStats);

  return (
    <TenantLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-muted mt-1">Visão geral do seu negócio</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Clientes" value={stats.totalClients} icon={<Users />} trend="+12" />
          <StatCard title="Produtos" value={stats.totalProducts} icon={<Package />} trend="+5" />
          <StatCard title="Serviços" value={stats.totalServices} icon={<Scissors />} trend="Estável" />
          <StatCard title="Agendamentos Hoje" value={stats.appointmentsToday} icon={<Calendar />} trend="+2" />
          <StatCard title="Mensagens Hoje" value={stats.messagesToday} icon={<MessageSquare />} trend="+18" />
          <StatCard title="Receita Mensal" value={`R$ ${stats.revenue}`} icon={<TrendingUp />} trend="+8%" />
        </div>
      </div>
    </TenantLayout>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="glass-card border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">{title}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
              <p className="text-xs text-accent-primary mt-2">{trend}</p>
            </div>
            <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
