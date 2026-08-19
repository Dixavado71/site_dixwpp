import { motion } from 'framer-motion'
import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data - will be replaced with API data
const chartData = [
  { date: '01/12', tenants: 12 },
  { date: '05/12', tenants: 19 },
  { date: '10/12', tenants: 25 },
  { date: '15/12', tenants: 32 },
  { date: '20/12', tenants: 38 },
  { date: '25/12', tenants: 45 },
  { date: '30/12', tenants: 52 },
]

const kpiCards = [
  {
    title: 'Total de Tenants',
    value: '52',
    icon: Building2,
    color: 'from-accent-primary to-accent-cyan',
    glow: 'neon-glow-green',
  },
  {
    title: 'Tenants Ativos',
    value: '48',
    icon: Users,
    color: 'from-accent-secondary to-accent-cyan',
    glow: 'neon-glow-purple',
  },
  {
    title: 'Usuários Totais',
    value: '1,234',
    icon: TrendingUp,
    color: 'from-accent-cyan to-accent-primary',
    glow: 'neon-glow-cyan',
  },
  {
    title: 'Receita Recorrente',
    value: 'R$ 12.500',
    icon: DollarSign,
    color: 'from-accent-primary to-accent-secondary',
    glow: 'neon-glow-green',
  },
]

export default function AdminDashboard() {
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
                <th className="text-left py-3 px-4 text-text-muted font-medium">Plano</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-text-primary">Empresa {i}</td>
                  <td className="py-3 px-4 text-text-secondary">Profissional</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">
                      Ativo
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {new Date().toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
