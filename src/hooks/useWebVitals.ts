import { useEffect } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Hook para monitoramento de Web Vitals
 * 
 * @param onReport - Callback opcional para reportar métricas
 * @returns Objeto com as últimas métricas coletadas
 */
export function useWebVitals(onReport?: (metric: Metric) => void) {
  useEffect(() => {
    // Core Web Vitals - Métricas essenciais do Google
    onCLS((metric) => {
      console.log('[Web Vitals] CLS:', metric.value);
      onReport?.(metric);
    });

    onFID((metric) => {
      console.log('[Web Vitals] FID:', metric.value);
      onReport?.(metric);
    });

    onFCP((metric) => {
      console.log('[Web Vitals] FCP:', metric.value);
      onReport?.(metric);
    });

    onLCP((metric) => {
      console.log('[Web Vitals] LCP:', metric.value);
      onReport?.(metric);
    });

    onTTFB((metric) => {
      console.log('[Web Vitals] TTFB:', metric.value);
      onReport?.(metric);
    });
  }, [onReport]);

  return null;
}

/**
 * Função utilitária para enviar métricas para serviço de analytics
 */
export function sendToAnalytics(metric: Metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: Date.now(),
  };

  // Enviar para endpoint de analytics (substitua pela sua URL)
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(body),
  // });

  // Log para desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', body);
  }
}

// Tipos exportados
export type { Metric as WebVitalMetric };
