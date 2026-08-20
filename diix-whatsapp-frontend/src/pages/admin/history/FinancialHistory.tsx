import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { FinancialTransaction } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockTransactions: FinancialTransaction[] = [
  { id: '1', tenantId: '1', type: 'income', description: 'Venda #001', amount: 150.00, status: 'paid', dueDate: '2024-12-10', paidDate: '2024-12-10', category: 'Vendas', createdAt: '2024-12-10T10:00:00Z', updatedAt: '2024-12-10T10:00:00Z' },
  { id: '2', tenantId: '1', type: 'expense', description: 'Fornecedor XYZ', amount: 80.00, status: 'pending', dueDate: '2024-12-15', category: 'Suprimentos', createdAt: '2024-12-10T11:00:00Z', updatedAt: '2024-12-10T11:00:00Z' },
  { id: '3', tenantId: '2', type: 'income', description: 'Serviço Premium', amount: 250.00, status: 'paid', dueDate: '2024-12-09', paidDate: '2024-12-09', category: 'Serviços', createdAt: '2024-12-09T14:00:00Z', updatedAt: '2024-12-09T14:00:00Z' },
  { id: '4', tenantId: '2', type: 'expense', description: 'Aluguel', amount: 500.00, status: 'paid', dueDate: '2024-12-05', paidDate: '2024-12-05', category: 'Infraestrutura', createdAt: '2024-12-05T09:00:00Z', updatedAt: '2024-12-05T09:00:00Z' },
];

const COLORS = ['#00ff9d', '#bd00ff', '#00f3ff', '#ff6b6b', '#ffd93d'];

export default function FinancialHistory() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'cancelled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const stats = {
    totalIncome: mockTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
    totalExpenses: mockTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    balance: 0,
    pendingTransactions: mockTransactions.filter(t => t.status === 'pending').length,
  };
  stats.balance = stats.totalIncome - stats.totalExpenses;

  const chartData = [
    { name: 'Receita', value: stats.totalIncome },
    { name: 'Despesa', value: stats.totalExpenses },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-primary">Controle Financeiro</h1>
        <p className="text-text-muted mt-1">Acompanhe entradas, saídas e conciliação</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Receitas</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  R$ {stats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Despesas</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  R$ {stats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Saldo</p>
                <p className={`text-2xl font-bold mt-1 ${stats.balance >= 0 ? 'text-accent-primary' : 'text-error'}`}>
                  R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm text-text-muted">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pendingTransactions}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Receita x Despesa</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                />
                <Bar dataKey="value" fill="#00ff9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Fluxo de Caixa</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary"
            >
              <option value="all">Todos os Status</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary"
            >
              <option value="all">Todos os Tipos</option>
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
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
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Descrição</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Categoria</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Tipo</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Vencimento</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Valor</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border hover:bg-white/5">
                    <td className="py-4 px-6 text-sm text-text-primary">{t.description}</td>
                    <td className="py-4 px-6 text-sm text-text-muted">{t.category}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        t.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {t.type === 'income' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-text-muted">
                      {new Date(t.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className={`py-4 px-6 text-sm font-medium ${
                      t.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        t.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {t.status === 'paid' ? 'Pago' : t.status === 'pending' ? 'Pendente' : 'Cancelado'}
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
