import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'cyan' | 'green' | 'red' | 'yellow';
  className?: string;
  onClick?: () => void;
}

const colorClasses = {
  primary: 'bg-accent-primary/10 text-accent-primary',
  secondary: 'bg-accent-secondary/10 text-accent-secondary',
  cyan: 'bg-accent-cyan/10 text-accent-cyan',
  green: 'bg-green-500/10 text-green-400',
  red: 'bg-red-500/10 text-red-400',
  yellow: 'bg-yellow-500/10 text-yellow-400',
};

export function KPICard({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'primary', 
  className,
  onClick 
}: KPICardProps) {
  return (
    <div 
      className={cn(
        'glass-panel rounded-xl border border-white/10 p-4 sm:p-6 transition-all',
        onClick && 'cursor-pointer hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-text-muted">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1 truncate">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl flex-shrink-0', colorClasses[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
