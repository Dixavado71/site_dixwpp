import { Button } from '@/components/ui/Button';

interface FallbackUIProps {
  error?: Error;
  onRetry?: () => void;
}

export function FallbackUI({ error, onRetry }: FallbackUIProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Algo deu errado</h3>
      
      <p className="text-sm text-gray-400 mb-4">
        {error?.message || 'Ocorreu um erro inesperado'}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="sm">
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}
