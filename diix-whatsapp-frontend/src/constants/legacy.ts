// Legacy constants for backward compatibility

export const STATUS_OPTIONS = {
  pending: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Pago', color: 'bg-green-500/20 text-green-400' },
  completed: { label: 'Concluído', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
  active: { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
  inactive: { label: 'Inativo', color: 'bg-red-500/20 text-red-400' },
} as const;

export const TRANSACTION_TYPES = {
  income: { label: 'Entrada', color: 'bg-green-500/20 text-green-400', icon: '+' },
  expense: { label: 'Saída', color: 'bg-red-500/20 text-red-400', icon: '-' },
} as const;

export const PAYMENT_METHODS = {
  cash: 'Dinheiro',
  credit: 'Cartão de Crédito',
  debit: 'Cartão de Débito',
  pix: 'PIX',
  other: 'Outro',
} as const;

export const PLANS = {
  basic: { name: 'Básico', maxUsers: 5, maxClients: 100, maxProducts: 50 },
  standard: { name: 'Standard', maxUsers: 15, maxClients: 500, maxProducts: 200 },
  premium: { name: 'Premium', maxUsers: 50, maxClients: 2000, maxProducts: 1000 },
  enterprise: { name: 'Enterprise', maxUsers: -1, maxClients: -1, maxProducts: -1 },
} as const;

export const ROLES = {
  'admin-global': 'Administrador Global',
  'admin-tenant': 'Administrador do Tenant',
  admin: 'Administrador',
  tenant: 'Tenant',
  user: 'Usuário',
} as const;

export const THEMES = {
  dark: 'Escuro',
  light: 'Claro',
} as const;
