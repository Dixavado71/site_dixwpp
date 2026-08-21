import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Sale } from '@/types';

export interface ExportOptions {
  filename?: string;
  title?: string;
  includeDetails?: boolean;
}

export function exportSalesToPDF(
  sales: Sale[],
  options: ExportOptions = {}
): void {
  const {
    filename = 'relatorio-vendas.pdf',
    title = 'Relatório de Vendas',
    includeDetails = true,
  } = options;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Configurar cores do tema cyberpunk
  const accentColor: [number, number, number] = [0, 255, 157]; // #00ff9d
  const textColor: [number, number, number] = [224, 224, 224]; // #e0e0e0
  const mutedColor: [number, number, number] = [160, 160, 160]; // #a0a0a0

  // Header
  doc.setFillColor(5, 5, 5); // bg-primary
  doc.rect(0, 0, 297, 210, 'F');

  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(accentColor[0]!, accentColor[1]!, accentColor[2]!);
  doc.text(title, 14, 20);

  // Data do relatório
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mutedColor[0]!, mutedColor[1]!, mutedColor[2]!);
  const dataRelatorio = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerado em: ${dataRelatorio}`, 14, 28);

  // Resumo
  const totalVendas = sales.length;
  const vendasCompletas = sales.filter(s => s.status === 'completed').length;
  const receitaTotal = sales
    .filter(s => s.status === 'completed')
    .reduce((sum, sale) => sum + sale.total, 0);

  doc.setFontSize(11);
  doc.setTextColor(textColor[0]!, textColor[1]!, textColor[2]!);
  doc.text(`Total de Vendas: ${totalVendas}`, 14, 40);
  doc.text(`Vendas Completas: ${vendasCompletas}`, 70, 40);
  doc.text(`Receita Total: R$ ${receitaTotal.toFixed(2)}`, 140, 40);

  // Tabela de vendas
  const tableData = sales.map(sale => [
    sale.id.slice(0, 8),
    sale.client?.name || '-',
    new Date(sale.createdAt).toLocaleDateString('pt-BR'),
    sale.paymentMethod === 'cash' ? 'Dinheiro' :
    sale.paymentMethod === 'pix' ? 'PIX' :
    sale.paymentMethod === 'credit' ? 'Cartão Crédito' :
    sale.paymentMethod === 'debit' ? 'Cartão Débito' : 'Outro',
    `R$ ${sale.total.toFixed(2)}`,
    sale.status === 'completed' ? 'Concluída' :
    sale.status === 'pending' ? 'Pendente' : 'Cancelada',
  ]);

  autoTable(doc, {
    startY: 48,
    head: [['ID', 'Cliente', 'Data', 'Pagamento', 'Valor', 'Status']],
    body: tableData,
    theme: 'striped' as any,
    headStyles: {
      fillColor: accentColor as [number, number, number],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: textColor,
      fillColor: [10, 10, 10],
    },
    alternateRowStyles: {
      fillColor: [15, 15, 15],
    },
    margin: { top: 48, left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        const status = data.cell.raw as string;
        if (status === 'Concluída') {
          data.cell.styles.textColor = [0, 255, 157];
        } else if (status === 'Pendente') {
          data.cell.styles.textColor = [255, 255, 0];
        } else {
          data.cell.styles.textColor = [255, 102, 102];
        }
      }
    },
  });

  // Rodapé
  const pageCount = doc.internal.pageSize.height ? Math.ceil(doc.internal.pageSize.getHeight() / 297) : 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(mutedColor[0]!, mutedColor[1]!, mutedColor[2]!);
    doc.text(
      `Página ${i} de ${pageCount}`,
      283,
      205,
      { align: 'right' }
    );
  }

  doc.save(filename);
}

export function exportSalesToCSV(sales: Sale[], filename = 'relatorio-vendas.csv'): void {
  const headers = ['ID', 'Cliente', 'Data', 'Pagamento', 'Valor', 'Status', 'Itens'];
  
  const rows = sales.map(sale => [
    sale.id,
    sale.client?.name || '',
    new Date(sale.createdAt).toISOString(),
    sale.paymentMethod,
    sale.total.toFixed(2),
    sale.status,
    sale.items?.map(item => `${item.name} (${item.quantity})`).join('; ') || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Escapar vírgulas e aspas
        const escaped = String(cell).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function getFormattedPaymentMethod(method: string): string {
  const methods: Record<string, string> = {
    cash: 'Dinheiro',
    pix: 'PIX',
    credit: 'Cartão Crédito',
    debit: 'Cartão Débito',
    other: 'Outro',
  };
  return methods[method] || method;
}

export function getFormattedStatus(status: string): string {
  const statuses: Record<string, string> = {
    completed: 'Concluída',
    pending: 'Pendente',
    cancelled: 'Cancelada',
  };
  return statuses[status] || status;
}
