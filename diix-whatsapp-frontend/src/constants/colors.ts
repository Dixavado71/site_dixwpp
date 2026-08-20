// Cores para status
export const STATUS_COLORS = {
  // Status de vendas
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  
  // Status financeiro
  paid: 'bg-green-500/20 text-green-400 border-green-500/30',
  overdue: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  
  // Status de tenant/categoria
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
  suspended: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
} as const;

// Cores para planos
export const PLAN_COLORS = {
  basic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  standard: 'bg-green-500/20 text-green-400 border-green-500/30',
  premium: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  enterprise: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
} as const;

// Cores para métodos de pagamento
export const PAYMENT_METHOD_COLORS = {
  cash: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  credit: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  debit: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  pix: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
} as const;

// Cores para tipos de transação
export const TRANSACTION_COLORS = {
  income: 'bg-green-500/20 text-green-400 border-green-500/30',
  expense: 'bg-red-500/20 text-red-400 border-red-500/30',
} as const;

// Cores para roles
export const ROLE_COLORS = {
  'admin-global': 'bg-red-500/20 text-red-400 border-red-500/30',
  'admin-tenant': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  tenant: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  user: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
} as const;
