// Status de transações e entidades
export const STATUS_OPTIONS = {
  pending: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Pago', color: 'bg-green-500/20 text-green-400' },
  completed: { label: 'Concluído', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
  active: { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
  inactive: { label: 'Inativo', color: 'bg-red-500/20 text-red-400' },
} as const;

// Tipos de transação financeira
export const TRANSACTION_TYPES = {
  income: { label: 'Entrada', color: 'bg-green-500/20 text-green-400', icon: '+' },
  expense: { label: 'Saída', color: 'bg-red-500/20 text-red-400', icon: '-' },
} as const;

// Métodos de pagamento
export const PAYMENT_METHODS = {
  cash: 'Dinheiro',
  credit: 'Cartão de Crédito',
  debit: 'Cartão de Débito',
  pix: 'PIX',
  other: 'Outro',
} as const;

// Planos disponíveis
export const PLANS = {
  basic: { name: 'Básico', maxUsers: 5, maxClients: 100, maxProducts: 50 },
  standard: { name: 'Standard', maxUsers: 15, maxClients: 500, maxProducts: 200 },
  premium: { name: 'Premium', maxUsers: 50, maxClients: 2000, maxProducts: 1000 },
  enterprise: { name: 'Enterprise', maxUsers: -1, maxClients: -1, maxProducts: -1 },
} as const;

// Roles do sistema
export const ROLES = {
  'admin-global': 'Administrador Global',
  'admin-tenant': 'Administrador do Tenant',
  admin: 'Administrador',
  tenant: 'Tenant',
  user: 'Usuário',
} as const;

// Temas disponíveis
export const THEMES = {
  dark: 'Escuro',
  light: 'Claro',
} as const;

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
