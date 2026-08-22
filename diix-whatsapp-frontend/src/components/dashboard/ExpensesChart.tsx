import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';

interface ChartData {
  category: string;
  value: number;
}

interface ExpensesChartProps {
  data: ChartData[];
  title?: string;
}

const COLORS = ['#00ff9d', '#00b8ff', '#ff00ff', '#ffff00', '#ff6b6b', '#a0a0a0'];

export function ExpensesChart({ data, title = 'Despesas por Categoria' }: ExpensesChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-secondary border border-border p-3 rounded-lg shadow-lg">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-accent-primary font-semibold">
            R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="category" 
            stroke="#a0a0a0"
            tick={{ fontSize: 12 }}
            angle={-10}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#a0a0a0"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value/1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          {data.map((entry, index) => (
            <Bar
              key={entry.category}
              dataKey="value"
              fill={COLORS[index % COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
