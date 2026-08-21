import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  id: string;
  message: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onDismiss: (id: string) => void;
}

const Toast = ({ 
  id, 
  message, 
  description,
  type = 'info', 
  duration = 5000, 
  onDismiss 
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(id), 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const types = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success',
      text: 'text-success',
      icon: CheckCircle,
      glow: 'shadow-neon-green-soft',
    },
    error: {
      bg: 'bg-error/10',
      border: 'border-error',
      text: 'text-error',
      icon: AlertCircle,
      glow: 'shadow-neon-purple-soft',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning',
      text: 'text-warning',
      icon: AlertTriangle,
      glow: 'shadow-neon-cyan-soft',
    },
    info: {
      bg: 'bg-info/10',
      border: 'border-info',
      text: 'text-info',
      icon: Info,
      glow: 'shadow-neon-blue-soft',
    },
  };

  const currentType = types[type];
  const Icon = currentType.icon;

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border shadow-lg min-w-[320px] max-w-[480px]',
        'glass-premium animate-slide-in-right',
        currentType.bg,
        isExiting && 'toast-exit'
      )}
      style={{
        borderLeft: `4px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'})`,
      }}
    >
      {/* Icon Container */}
      <div className={cn(
        'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
        currentType.bg
      )}>
        <Icon className={cn('w-4 h-4', currentType.text)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold mb-0.5', currentType.text)}>
          {message}
        </p>
        {description && (
          <p className="text-xs text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(id), 300);
        }}
        className="flex-shrink-0 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/10 transition-all"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-0.5 rounded-b-xl overflow-hidden"
        style={{
          background: `linear-gradient(90deg, var(--accent-primary), var(--accent-cyan))`,
          width: '100%',
          animation: `toastProgress ${duration}ms linear forwards`,
        }}
      />

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export { Toast };
