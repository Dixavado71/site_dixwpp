import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingState({ 
  message = 'Carregando...', 
  size = 'md',
  className 
}: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-t-2 border-b-2 border-accent-primary',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-text-muted mt-4">{message}</p>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-panel rounded-xl border border-white/10 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-white/10 rounded w-24"></div>
          <div className="h-8 bg-white/10 rounded w-32"></div>
        </div>
        <div className="h-12 w-12 bg-white/10 rounded-xl"></div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="w-full animate-pulse">
      <div className="h-12 bg-white/5 rounded-t-lg mb-2"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-white/5 mb-2 last:rounded-b-lg">
          <div className="flex h-full items-center px-6 gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="h-4 bg-white/10 rounded flex-1"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
