// Constants unificados - Status e Opções
// Este arquivo consolida todas as constantes do projeto

// ============================================
// STATUS
// ============================================

// Status de vendas
export const SALE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const SALE_STATUS_LABELS = {
  [SALE_STATUS.PENDING]: 'Pendente',
  [SALE_STATUS.COMPLETED]: 'Concluído',
  [SALE_STATUS.CANCELLED]: 'Cancelado',
  [SALE_STATUS.REFUNDED]: 'Reembolsado',
} as const;

// Status financeiro
export const FINANCIAL_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
} as const;

export const FINANCIAL_STATUS_LABELS = {
  [FINANCIAL_STATUS.PENDING]: 'Pendente',
  [FINANCIAL_STATUS.PAID]: 'Pago',
  [FINANCIAL_STATUS.CANCELLED]: 'Cancelado',
  [FINANCIAL_STATUS.OVERDUE]: 'Atrasado',
} as const;

// Status de tenant
export const TENANT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
} as const;

export const TENANT_STATUS_LABELS = {
  [TENANT_STATUS.ACTIVE]: 'Ativo',
  [TENANT_STATUS.SUSPENDED]: 'Suspenso',
  [TENANT_STATUS.INACTIVE]: 'Inativo',
} as const;

// Status de categoria
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const CATEGORY_STATUS_LABELS = {
  [CATEGORY_STATUS.ACTIVE]: 'Ativo',
  [CATEGORY_STATUS.INACTIVE]: 'Inativo',
} as const;

// ============================================
// OPÇÕES
// ============================================

// Métodos de pagamento
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT: 'credit',
  DEBIT: 'debit',
  PIX: 'pix',
  OTHER: 'other',
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Dinheiro',
  [PAYMENT_METHODS.CREDIT]: 'Cartão de Crédito',
  [PAYMENT_METHODS.DEBIT]: 'Cartão de Débito',
  [PAYMENT_METHODS.PIX]: 'PIX',
  [PAYMENT_METHODS.OTHER]: 'Outro',
} as const;

// Tipos de plano
export const PLAN_TYPES = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const PLAN_TYPE_LABELS = {
  [PLAN_TYPES.BASIC]: 'Básico',
  [PLAN_TYPES.STANDARD]: 'Standard',
  [PLAN_TYPES.PREMIUM]: 'Premium',
  [PLAN_TYPES.ENTERPRISE]: 'Enterprise',
} as const;

// Configuração detalhada dos planos
export const PLANS = {
  basic: { name: 'Básico', maxUsers: 5, maxClients: 100, maxProducts: 50 },
  standard: { name: 'Standard', maxUsers: 15, maxClients: 500, maxProducts: 200 },
  premium: { name: 'Premium', maxUsers: 50, maxClients: 2000, maxProducts: 1000 },
  enterprise: { name: 'Enterprise', maxUsers: -1, maxClients: -1, maxProducts: -1 },
} as const;

// Canais de notificação
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  WHATSAPP: 'whatsapp',
} as const;

export const NOTIFICATION_CHANNEL_LABELS = {
  [NOTIFICATION_CHANNELS.EMAIL]: 'Email',
  [NOTIFICATION_CHANNELS.SMS]: 'SMS',
  [NOTIFICATION_CHANNELS.PUSH]: 'Push Notification',
  [NOTIFICATION_CHANNELS.WHATSAPP]: 'WhatsApp',
} as const;

// Tipos de transação
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: 'Entrada',
  [TRANSACTION_TYPES.EXPENSE]: 'Saída',
} as const;

// Ciclo de faturamento
export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const BILLING_CYCLE_LABELS = {
  [BILLING_CYCLES.MONTHLY]: 'Mensal',
  [BILLING_CYCLES.YEARLY]: 'Anual',
} as const;

// Roles
export const ROLES = {
  'admin-global': 'Administrador Global',
  'admin-tenant': 'Administrador do Tenant',
  admin: 'Administrador',
  tenant: 'Tenant',
  user: 'Usuário',
} as const;

// Temas
export const THEMES = {
  dark: 'Escuro',
  light: 'Claro',
} as const;

// Configuração de status para badges (substitui legacy STATUS_OPTIONS)
export const STATUS_OPTIONS = {
  pending: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Pago', color: 'bg-green-500/20 text-green-400' },
  completed: { label: 'Concluído', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
  active: { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
  inactive: { label: 'Inativo', color: 'bg-red-500/20 text-red-400' },
} as const;
