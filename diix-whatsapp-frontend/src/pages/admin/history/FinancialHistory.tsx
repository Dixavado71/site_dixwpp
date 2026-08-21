import { useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFinancialStore } from '@/stores/financialStore';
import { useDataTable } from '@/hooks/useDataTable';
import type { FinancialTransaction } from '@/types';
import type { ColumnDef as CustomColumnDef } from '@/components/ui/table/DataTable';
import { DataTable } from '@/components/ui/table/DataTable';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card, CardContent } from '@/components/ui/Card';
import { TRANSACTION_TYPES, STATUS_CONFIG, FINANCIAL_STATUS_LABELS } from '@/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#00ff9d', '#ff6b6b'];

export default function FinancialHistory() {
  const { 
    transactions, 
    stats, 
    filters, 
    isLoading, 
    fetchTransactions, 
    fetchStats, 
    setFilters, 
    exportCSV 
  } = useFinancialStore();

  useEffect(() => {
    fetchTransactions({ limit: 10 });
    fetchStats();
  }, []);

  const { 
    data, 
    searchTerm, 
    setSearchTerm, 
    page,
    totalPages,
    nextPage,
    previousPage
  } = useDataTable({
    data: transactions,
    searchKeys: ['description', 'category'],
    initialPage: 1,
    pageSize: 10,
  });

  const handleExport = () => {
    exportCSV();
  };

  const chartData = [
    { name: 'Receita', value: stats?.totalIncome || 0 },
    { name: 'Despesa', value: stats?.totalExpenses || 0 },
  ];

  const columns: CustomColumnDef<FinancialTransaction>[] = [
    { 
      key: 'description', 
      header: 'Descrição', 
      cell: (item) => item.description 
    },
    { 
      key: 'category', 
      header: 'Categoria', 
      cell: (item) => <span className="text-text-muted">{item.category || '-'}</span> 
    },
    { 
      key: 'type', 
      header: 'Tipo', 
      cell: (item) => (
        <StatusBadge status={item.type} size="sm" />
      ) 
    },
    { 
      key: 'dueDate', 
      header: 'Vencimento', 
      cell: (item) => formatDate(item.dueDate) 
    },
    { 
      key: 'amount', 
      header: 'Valor', 
      cell: (item) => (
        <span className={`font-medium ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
          {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
        </span>
      ) 
    },
    { 
      key: 'status', 
      header: 'Status', 
      cell: (item) => <StatusBadge status={item.status} size="sm" /> 
    },
  ];

  if (isLoading && !transactions.length) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-text-primary">Controle Financeiro</h1>
          <p className="text-text-muted mt-1">Acompanhe entradas, saídas e conciliação</p>
        </motion.div>
        <LoadingState message="Carregando transações..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-primary">Controle Financeiro</h1>
        <p className="text-text-muted mt-1">Acompanhe entradas, saídas e conciliação</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <KPICard
          title="Receitas"
          value={formatCurrency(stats?.totalIncome || 0)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <KPICard
          title="Despesas"
          value={formatCurrency(stats?.totalExpenses || 0)}
          icon={<TrendingDown className="h-6 w-6" />}
          color="red"
        />
        <KPICard
          title="Saldo"
          value={formatCurrency(stats?.balance || 0)}
          icon={<DollarSign className="h-6 w-6" />}
          color={((stats?.balance || 0) >= 0 ? 'primary' : 'red') as any}
        />
        <KPICard
          title="Pendentes"
          value={stats?.pendingTransactions || 0}
          icon={<Wallet className="h-6 w-6" />}
          color="yellow"
        />
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
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
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
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
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
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ status: e.target.value as any || undefined })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary"
            >
              <option value="">Todos os Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={filters.type || ''}
              onChange={(e) => setFilters({ type: e.target.value as any || undefined })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary"
            >
              <option value="">Todos os Tipos</option>
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
            <ActionButton
              icon={<Filter className="w-4 h-4" />}
              label="Filtrar"
              variant="outline"
              onClick={() => {}}
            >
              Filtrar
            </ActionButton>
            <ActionButton
              icon={<Download className="w-4 h-4" />}
              label="Exportar"
              variant="primary"
              onClick={handleExport}
            >
              Exportar
            </ActionButton>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <EmptyState
              icon={<DollarSign className="h-8 w-8" />}
              title="Nenhuma transação encontrada"
              description="Comece registrando novas transações para ver os dados aqui."
            />
          ) : (
            <>
              <DataTable columns={columns} data={data} />
              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <p className="text-sm text-text-muted">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <ActionButton
                      label="Anterior"
                      variant="outline"
                      onClick={previousPage}
                      disabled={page <= 1}
                    >
                      Anterior
                    </ActionButton>
                    <ActionButton
                      label="Próxima"
                      variant="outline"
                      onClick={nextPage}
                      disabled={page >= totalPages}
                    >
                      Próxima
                    </ActionButton>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
