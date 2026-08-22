import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, Package, Users, DollarSign, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TenantReports() {
  const [selectedReport, setSelectedReport] = useState<'sales' | 'financial' | 'customers' | 'products'>('sales');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0] || '',
    end: new Date().toISOString().split('T')[0] || '',
  });

  const reports = [
    {
      id: 'sales',
      title: 'Relatório de Vendas',
      description: 'Análise completa das vendas realizadas',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'blue',
    },
    {
      id: 'financial',
      title: 'Relatório Financeiro',
      description: 'Receitas, despesas e fluxo de caixa',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green',
    },
    {
      id: 'customers',
      title: 'Relatório de Clientes',
      description: 'Base de clientes e comportamento de compra',
      icon: <Users className="w-6 h-6" />,
      color: 'purple',
    },
    {
      id: 'products',
      title: 'Relatório de Produtos',
      description: 'Estoque e produtos mais vendidos',
      icon: <Package className="w-6 h-6" />,
      color: 'orange',
    },
  ];

  const handleExport = (format: 'pdf' | 'csv' | 'xlsx') => {
    // Implementar exportação
    console.log(`Exportando relatório ${selectedReport} em formato ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Relatórios</h1>
          <p className="text-text-muted mt-1">Gere e exporte relatórios do seu negócio</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-muted" />
            <Input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-auto"
            />
            <span className="text-text-muted">até</span>
            <Input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-auto"
            />
          </div>
        </div>
      </motion.div>

      {/* Report Selection Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <Card 
            key={report.id}
            className={`glass-card border-white/10 cursor-pointer transition-all hover:scale-105 ${
              selectedReport === report.id ? 'ring-2 ring-accent-primary' : ''
            }`}
            onClick={() => setSelectedReport(report.id as any)}
          >
            <CardContent className="pt-6">
              <div className={`p-3 rounded-xl bg-${report.color}-500/10 text-${report.color}-400 mb-4`}>
                {report.icon}
              </div>
              <h3 className="font-semibold text-text-primary">{report.title}</h3>
              <p className="text-sm text-text-muted mt-1">{report.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pré-visualização do Relatório</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="primary" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-16 h-16 text-text-muted mb-4" />
            <p className="text-text-secondary font-medium">
              Relatório de {reports.find(r => r.id === selectedReport)?.title}
            </p>
            <p className="text-sm text-text-muted mt-1">
              Período: {new Date(dateRange.start).toLocaleDateString('pt-BR')} até {new Date(dateRange.end).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-xs text-text-muted mt-4">
              Selecione um formato de exportação ou imprima o relatório
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`px-3 py-2 rounded-lg bg-white/5 border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary ${className}`}
      {...props}
    />
  );
}
