import { Component, type ErrorInfo, type ReactNode, Suspense } from 'react';
import { LoadingState } from '../ui/LoadingState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * AsyncErrorBoundary - Para capturar erros em componentes lazy-loaded
 * Deve ser usado junto com React.Suspense
 */
export class AsyncErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Async error caught:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-400 mb-2">Erro ao carregar componente</p>
          <button
            onClick={this.handleRetry}
            className="text-sm text-accent-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    return (
      <Suspense fallback={this.props.fallback || <LoadingState />}>
        {this.props.children}
      </Suspense>
    );
  }
}
