import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onDismiss: (id: string) => void;
}

const Toast = ({ id, message, type = 'info', duration = 5000, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const types = {
    success: 'bg-accent-primary/10 border-accent-primary text-accent-primary',
    error: 'bg-error/10 border-error text-error',
    warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-500',
    info: 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-xl border shadow-glass animate-in slide-in-from-right',
        types[type]
      )}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="ml-auto hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

export { Toast };
