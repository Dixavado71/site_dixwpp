import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { History, FileText, TrendingUp, DollarSign, ShoppingCart, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useSalesStore } from '@/stores/salesStore'
import { useFinancialStore } from '@/stores/financialStore'
import { useEffect } from 'react'

export default function TenantHistory() {
  const { sales, fetchSales } = useSalesStore()
  const { transactions, fetchTransactions } = useFinancialStore()

  useEffect(() => {
    fetchSales({ limit: 10 })
    fetchTransactions()
  }, [])

  const recentSales = sales.slice(0, 5)
  const recentTransactions = transactions.slice(0, 5)
  
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalRevenue - totalExpenses

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-text-primary">Históricos</h1>
        <p className="text-text-muted mt-1">Acompanhe o histórico de vendas e financeiro da sua loja</p>
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.div variants={cardVariants}>
          <Link to="/tenant/history/sales">
            <Card className="glass-card border-white/10 hover:border-accent-primary/30 transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <History className="h-6 w-6" />
                  </div>
                  <ShoppingCart className="h-5 w-5 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Histórico de Vendas</h3>
                <p className="text-sm text-text-muted">Consulte todas as vendas realizadas com detalhes</p>
                <div className="mt-4 flex items-center gap-2 text-accent-primary text-sm font-medium">
                  <span>Acessar →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Link to="/tenant/history/financial">
            <Card className="glass-card border-white/10 hover:border-accent-primary/30 transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <FileText className="h-5 w-5 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Controle Financeiro</h3>
                <p className="text-sm text-text-muted">Receitas, despesas e saldo da sua loja</p>
                <div className="mt-4 flex items-center gap-2 text-accent-primary text-sm font-medium">
                  <span>Acessar →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* Financial Summary Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Receita Total</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  R$ {totalRevenue.toFixed(2).replace('.', ',')}
                </p>
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
                <p className="text-2xl font-bold text-red-400 mt-1">
                  R$ {totalExpenses.toFixed(2).replace('.', ',')}
                </p>
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
                  R$ {balance.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Vendas Recentes
                </CardTitle>
                <Link to="/tenant/history/sales">
                  <Button variant="ghost" size="sm">Ver Todas</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="w-10 h-10 text-text-muted mb-3" />
                  <p className="text-text-secondary">Nenhuma venda registrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{sale.client?.name || 'Cliente'}</p>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-text-primary">
                          R$ {sale.total.toFixed(2).replace('.', ',')}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          sale.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : sale.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {sale.status === 'completed' ? 'Concluída' : 
                           sale.status === 'pending' ? 'Pendente' : 'Cancelada'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Transações Recentes
                </CardTitle>
                <Link to="/tenant/history/financial">
                  <Button variant="ghost" size="sm">Ver Todas</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="w-10 h-10 text-text-muted mb-3" />
                  <p className="text-text-secondary">Nenhuma transação registrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{transaction.description}</p>
                        <p className="text-xs text-text-muted mt-1">{transaction.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(transaction.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function TrendingDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
}
