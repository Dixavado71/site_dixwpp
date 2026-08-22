// Constants exports - Fonte única da verdade
export * from './options';
export * from './colors';

// Cores predefinidas para categorias
export const CATEGORY_COLORS = [
  '#00ff9d', '#bd00ff', '#00f3ff', '#ff6b6b', '#ffd93d', 
  '#6bcb77', '#4d96ff', '#f06595', '#ff922b', '#9775fa'
] as const;

// Ícones comuns para categorias
export const CATEGORY_ICONS = ['📁', '📦', '🏷️', '⭐', '🔥', '💎', '🎯', '🚀', '💡', '📊'] as const;

// Timezones suportadas
export const TIMEZONES = [
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
] as const;

// Gateways de pagamento suportados
export const PAYMENT_GATEWAYS = [
  'Stripe',
  'Pagar.me',
  'Mercado Pago',
  'PagSeguro',
] as const;

// Status codes HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

// Tamanhos de página padrão
export const PAGE_SIZES = [10, 25, 50, 100] as const;

// Formato de data para exibição
export const DATE_FORMATS = {
  short: 'dd/MM/yyyy',
  long: 'dd/MM/yyyy HH:mm:ss',
  display: 'dd/MM/yyyy',
  input: 'yyyy-MM-dd',
} as const;

// Formato de moeda
export const CURRENCY_FORMAT = {
  locale: 'pt-BR',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;
