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
