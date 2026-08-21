import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFinancialStore } from '@/stores/financialStore';

export default function TenantFinancialHistory() {
  const { transactions, isLoading, fetchTransactions } = useFinancialStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const tenantId = 'current-tenant-id'; // TODO: Obter do contexto de autenticação

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((balance / totalRevenue) * 100) : 0;

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Histórico Financeiro</h1>
          <p className="text-text-muted mt-1">Acompanhe suas receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'day' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('day')}
          >
            Dia
          </Button>
          <Button 
            variant={selectedPeriod === 'week' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Semana
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Mês
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('year')}
          >
            Ano
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Receita Total</p>
                <p className="text-2xl font-bold text-green-400 mt-1">R$ {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Despesas Totais</p>
                <p className="text-2xl font-bold text-red-400 mt-1">R$ {totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Saldo</p>
                <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {balance.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Margem de Lucro</p>
                <p className={`text-2xl font-bold mt-1 ${profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transações Recentes</CardTitle>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-12 h-12 text-text-muted mb-4" />
              <p className="text-text-secondary">Nenhuma transação encontrada</p>
              <p className="text-sm text-text-muted mt-1">
                Registre receitas e despesas para começar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Descrição</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Categoria</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Tipo</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-accent-primary/5">
                      <td className="py-3 px-4 text-sm text-text-primary">{transaction.description}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">
                        {new Date(transaction.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'income' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-semibold ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2).replace('.', ',')}
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
