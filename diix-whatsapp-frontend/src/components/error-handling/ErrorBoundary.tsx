import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error tracking service (Sentry, etc.)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // You can also log to an error reporting service
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
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
            
            <h2 className="text-xl font-bold mb-2">
              Oops! Algo deu errado
            </h2>
            
            <p className="text-sm text-gray-400 mb-4">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            
            {/* Development mode error details */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-4 p-3 bg-gray-900 rounded text-xs overflow-auto max-h-40">
                <summary className="cursor-pointer text-red-400 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <p className="text-red-300">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-gray-400 mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
            
            <Button onClick={this.handleReset} variant="primary">
              Tentar Novamente
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
