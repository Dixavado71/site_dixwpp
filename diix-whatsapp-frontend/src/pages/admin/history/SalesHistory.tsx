import { useEffect } from 'react';
import { Download, TrendingUp, DollarSign, ShoppingCart, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSalesStore } from '@/stores/salesStore';
import { useDataTable } from '@/hooks/useDataTable';
import type { Sale } from '@/types';
import type { ColumnDef as CustomColumnDef } from '@/components/ui/table/DataTable';
import { DataTable } from '@/components/ui/table/DataTable';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ActionButton } from '@/components/ui/ActionButton';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { PAYMENT_METHODS, STATUS_CONFIG } from '@/constants';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SalesHistory() {
  const { 
    sales, 
    stats, 
    filters, 
    isLoading, 
    fetchSales, 
    fetchStats, 
    setFilters, 
    resetFilters,
    exportCSV 
  } = useSalesStore();

  useEffect(() => {
    fetchSales({ limit: 10 });
    fetchStats();
  }, []);

  const { 
    data, 
    searchTerm, 
    setSearchTerm, 
    setFilters: setTableFilters,
    page,
    totalPages,
    nextPage,
    previousPage
  } = useDataTable({
    data: sales,
    searchKeys: ['id', 'client'],
    initialPage: 1,
    pageSize: 10,
  });

  const handleExport = () => {
    exportCSV();
  };

  const columns: CustomColumnDef<Sale>[] = [
    { 
      key: 'id', 
      header: 'ID', 
      cell: (item) => `#${item.id}` 
    },
    { 
      key: 'createdAt', 
      header: 'Data', 
      cell: (item) => formatDate(item.createdAt) 
    },
    { 
      key: 'total', 
      header: 'Valor', 
      cell: (item) => formatCurrency(item.total) 
    },
    { 
      key: 'paymentMethod', 
      header: 'Pagamento', 
      cell: (item) => {
        const method = item.paymentMethod;
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-text-secondary capitalize">
            {method ? PAYMENT_METHODS[method] : 'N/A'}
          </span>
        );
      } 
    },
    { 
      key: 'status', 
      header: 'Status', 
      cell: (item) => <StatusBadge status={item.status} size="sm" /> 
    },
  ];

  if (isLoading && !sales.length) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-text-primary">Histórico de Vendas</h1>
          <p className="text-text-muted mt-1">Acompanhe todas as vendas realizadas</p>
        </motion.div>
        <LoadingState message="Carregando vendas..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-primary">Histórico de Vendas</h1>
        <p className="text-text-muted mt-1">Acompanhe todas as vendas realizadas</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KPICard
          title="Total Vendido"
          value={formatCurrency(stats?.totalSold || 0)}
          icon={<DollarSign className="h-6 w-6" />}
          color="primary"
        />
        <KPICard
          title="Ticket Médio"
          value={formatCurrency(stats?.averageTicket || 0)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="cyan"
        />
        <KPICard
          title="Taxa de Conversão"
          value={`${(stats?.conversionRate || 0).toFixed(1)}%`}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="secondary"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por ID ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
              title="Nenhuma venda encontrada"
              description="Comece registrando novas vendas para ver os dados aqui."
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
