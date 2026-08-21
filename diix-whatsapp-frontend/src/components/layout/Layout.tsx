import { ErrorBoundary, AsyncErrorBoundary, FallbackUI } from '../error-handling';
import { SkipLink } from './SkipLink';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ErrorBoundary fallback={<FallbackUI />}>
      <AsyncErrorBoundary>
        <SkipLink />
        <div className="min-h-screen bg-bg-primary">
          {/* Main Content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>
          
          {/* Live Region for Screen Readers */}
          <div 
            role="status" 
            aria-live="polite" 
            aria-atomic="true"
            className="live-region"
          />
        </div>
      </AsyncErrorBoundary>
    </ErrorBoundary>
  );
}
