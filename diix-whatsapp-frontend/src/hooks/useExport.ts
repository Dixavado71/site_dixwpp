import { useCallback } from 'react';
import { toast } from 'sonner';

interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
}

interface UseExportReturn {
  exportToCSV: <T extends Record<string, any>>(data: T[], options?: ExportOptions) => void;
  exportToJSON: <T extends Record<string, any>>(data: T[], options?: ExportOptions) => void;
  printData: <T extends Record<string, any>>(data: T[], columns: { key: keyof T; label: string }[]) => void;
}

export function useExport(): UseExportReturn {
  const exportToCSV = useCallback(<T extends Record<string, any>>(
    data: T[], 
    options: ExportOptions = {}
  ) => {
    const { filename = 'export', includeHeaders = true } = options;
    
    if (data.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      ...(includeHeaders ? [headers.join(',')] : []),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar vírgulas e aspas
          const escaped = String(value ?? '').replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    
    toast.success('Arquivo CSV exportado com sucesso!');
  }, []);

  const exportToJSON = useCallback(<T extends Record<string, any>>(
    data: T[], 
    options: ExportOptions = {}
  ) => {
    const { filename = 'export' } = options;
    
    if (data.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    link.click();
    
    toast.success('Arquivo JSON exportado com sucesso!');
  }, []);

  const printData = useCallback(<T extends Record<string, any>>(
    data: T[], 
    columns: { key: keyof T; label: string }[]
  ) => {
    if (data.length === 0) {
      toast.error('Nenhum dado para imprimir');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Relatório</h1>
          <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${columns.map(col => `<td>${row[col.key] ?? ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <br/>
          <button onclick="window.print()">Imprimir</button>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast.success('Janela de impressão aberta!');
  }, []);

  return {
    exportToCSV,
    exportToJSON,
    printData,
  };
}
