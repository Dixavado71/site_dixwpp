import { useEffect, useCallback } from 'react';

interface PrefetchOptions {
  timeout?: number;
  maxPrefetch?: number;
}

/**
 * Hook para prefetching inteligente de rotas baseado em interações do usuário
 */
export function usePrefetchRoutes(
  routes: string[],
  options: PrefetchOptions = {}
) {
  const { timeout = 300, maxPrefetch = 3 } = options;
  
  const prefetchCache = new Map<string, Promise<void>>();
  const interactionCount = new Map<string, number>();

  const prefetchRoute = useCallback(async (route: string) => {
    if (prefetchCache.has(route)) {
      return prefetchCache.get(route);
    }

    const prefetchPromise = import(`@/pages${route}`)
      .catch(() => {
        console.warn(`Failed to prefetch route: ${route}`);
      });

    prefetchCache.set(route, prefetchPromise);
    return prefetchPromise;
  }, []);

  const handleMouseEnter = useCallback((route: string) => {
    const count = interactionCount.get(route) || 0;
    
    if (count < maxPrefetch) {
      interactionCount.set(route, count + 1);
      
      setTimeout(() => {
        prefetchRoute(route);
      }, timeout);
    }
  }, [prefetchRoute, timeout, maxPrefetch]);

  const handleClick = useCallback((route: string) => {
    interactionCount.set(route, maxPrefetch + 1);
  }, [maxPrefetch]);

  return {
    prefetchRoute,
    handleMouseEnter,
    handleClick,
    isPrefetched: (route: string) => prefetchCache.has(route),
  };
}

/**
 * Hook para prefetching baseado em visibilidade (Intersection Observer)
 */
export function usePrefetchOnVisible(routes: string[], threshold = 0.1) {
  const prefetchCache = new Set<string>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const route = entry.target.getAttribute('data-route');
            if (route && !prefetchCache.has(route)) {
              prefetchCache.add(route);
              import(`@/pages${route}`).catch(console.warn);
            }
          }
        });
      },
      { threshold }
    );

    const elements = document.querySelectorAll('[data-prefetch]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return prefetchCache;
}
