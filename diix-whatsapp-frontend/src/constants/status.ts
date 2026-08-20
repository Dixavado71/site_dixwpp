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
