import React, { Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui';

interface ChartWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ChartWrapper({ children, fallback }: ChartWrapperProps) {
  return (
    <Suspense fallback={fallback || <Skeleton className="h-[300px] w-full" />}>
      {children}
    </Suspense>
  );
}

export function createLazyChartComponent<T extends Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>
) {
  const LazyComponent = React.lazy(importFunc);
  
  return function LazyChart(props: T) {
    return (
      <ChartWrapper>
        <LazyComponent {...props} />
      </ChartWrapper>
    );
  };
}
