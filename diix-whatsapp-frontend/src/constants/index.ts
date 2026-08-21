// Constants exports - Unificados e organizados
export * from './status';
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

// Configuração de status com cores (substitui STATUS_OPTIONS legacy)
export const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Pago', color: 'bg-green-500/20 text-green-400' },
  completed: { label: 'Concluído', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
  active: { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
  inactive: { label: 'Inativo', color: 'bg-red-500/20 text-red-400' },
  overdue: { label: 'Atrasado', color: 'bg-red-500/20 text-red-400' },
  refunded: { label: 'Reembolsado', color: 'bg-orange-500/20 text-orange-400' },
  suspended: { label: 'Suspenso', color: 'bg-gray-500/20 text-gray-400' },
} as const;

// Planos com configurações completas
export const PLANS_CONFIG = {
  basic: { name: 'Básico', maxUsers: 5, maxClients: 100, maxProducts: 50 },
  standard: { name: 'Standard', maxUsers: 15, maxClients: 500, maxProducts: 200 },
  premium: { name: 'Premium', maxUsers: 50, maxClients: 2000, maxProducts: 1000 },
  enterprise: { name: 'Enterprise', maxUsers: -1, maxClients: -1, maxProducts: -1 },
} as const;

// Roles do sistema
export const ROLES_CONFIG = {
  'admin-global': 'Administrador Global',
  'admin-tenant': 'Administrador do Tenant',
  admin: 'Administrador',
  tenant: 'Tenant',
  user: 'Usuário',
} as const;

// Temas disponíveis
export const THEMES_CONFIG = {
  cyberpunk: 'Cyberpunk',
  light: 'Claro',
  dark: 'Escuro',
  corporate: 'Corporativo',
  minimal: 'Minimalista',
} as const;
