import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, History, TrendingUp, PlusCircle, FileText, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useSalesStore } from '@/stores/salesStore'
import { useEffect } from 'react'

export default function TenantSales() {
  const { sales, fetchSales } = useSalesStore()

  useEffect(() => {
    fetchSales({ limit: 10 })
  }, [])

  const recentSales = sales.slice(0, 5)
  const totalRevenue = recentSales
    .filter(s => s.status === 'completed')
    .reduce((sum, sale) => sum + sale.total, 0)

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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Vendas</h1>
          <p className="text-text-muted mt-1">Gerencie suas vendas e acompanhe o desempenho</p>
        </div>
        <Link to="/tenant/sales/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Nova Venda
          </Button>
        </Link>
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div variants={cardVariants}>
          <Link to="/tenant/sales/new">
            <Card className="glass-card border-white/10 hover:border-accent-primary/30 transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary group-hover:bg-accent-primary/20 transition-colors">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Nova Venda</h3>
                <p className="text-sm text-text-muted">Registre uma nova venda rapidamente</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Link to="/tenant/history/sales">
            <Card className="glass-card border-white/10 hover:border-accent-primary/30 transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <History className="h-6 w-6" />
                  </div>
                  <FileText className="h-5 w-5 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Histórico de Vendas</h3>
                <p className="text-sm text-text-muted">Consulte todas as vendas realizadas</p>
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
                  <TrendingUp className="h-5 w-5 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Controle Financeiro</h3>
                <p className="text-sm text-text-muted">Acompanhe receitas e despesas</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Sales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-text-primary">Vendas Recentes</CardTitle>
              <Link to="/tenant/history/sales">
                <Button variant="ghost" size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-text-muted mb-4" />
                <p className="text-text-secondary">Nenhuma venda registrada</p>
                <p className="text-sm text-text-muted mt-1">
                  Comece registrando sua primeira venda
                </p>
                <Link to="/tenant/sales/new" className="mt-4">
                  <Button>Nova Venda</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Valor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="border-b border-border hover:bg-accent-primary/5">
                        <td className="py-3 px-4 text-sm text-text-primary font-mono">{sale.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">{sale.client?.name || '-'}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">
                          {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 text-sm text-text-primary font-semibold">
                          R$ {sale.total.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            sale.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : sale.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {sale.status === 'completed' ? 'Concluída' : 
                             sale.status === 'pending' ? 'Pendente' : 'Cancelada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Receita Recente (últimas 5 vendas)</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  R$ {totalRevenue.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 text-green-400">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total de Vendas</p>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  {sales.length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-accent-primary/10 text-accent-primary">
                <ShoppingCart className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
