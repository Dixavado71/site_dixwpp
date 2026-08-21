import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface ChartData {
  date: string;
  profit: number;
}

interface ProfitChartProps {
  data: ChartData[];
  title?: string;
}

export function ProfitChart({ data, title = 'Lucro Líquido' }: ProfitChartProps) {
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
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="date" 
            stroke="#a0a0a0"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#a0a0a0"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value/1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00ff9d" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="profit" 
            stroke="#00ff9d"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
