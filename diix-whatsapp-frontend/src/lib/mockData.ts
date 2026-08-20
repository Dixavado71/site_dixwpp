// Dados Mock para Dashboard Admin
export const mockAdminStats = {
  totalTenants: 156,
  activeTenants: 142,
  totalClients: 2847,
  totalRevenue: 45230.50,
  monthlyGrowth: 12.5,
  messagesToday: 12543,
};

export const mockTenantsList = [
  {
    id: '1',
    name: 'Barbearia Style',
    businessName: 'Style Barbearia Ltda',
    email: 'contato@style.com.br',
    phone: '(11) 98765-4321',
    document: '12.345.678/0001-90',
    status: 'active',
    plan: 'pro',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Clínica Saúde+',
    businessName: 'Saúde+ Clínica Médica',
    email: 'admin@saudeplus.com',
    phone: '(21) 97654-3210',
    document: '23.456.789/0001-81',
    status: 'active',
    plan: 'enterprise',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Restaurante Sabor',
    businessName: 'Sabor Restaurante e Lanchonete',
    email: 'contato@sabor.com.br',
    phone: '(31) 96543-2109',
    document: '34.567.890/0001-72',
    status: 'pending',
    plan: 'basic',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    name: 'Academia Fit',
    businessName: 'Fit Academia e Treinamentos',
    email: 'contato@fit.com.br',
    phone: '(41) 95432-1098',
    document: '45.678.901/0001-63',
    status: 'active',
    plan: 'pro',
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'Salão Beauty',
    businessName: 'Beauty Salão de Beleza',
    email: 'contato@beauty.com.br',
    phone: '(51) 94321-0987',
    document: '56.789.012/0001-54',
    status: 'inactive',
    plan: 'basic',
    createdAt: '2024-01-11',
  },
];

export const mockUsersList = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@admin.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-12-10 14:30',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@tenant.com',
    role: 'tenant',
    status: 'active',
    lastLogin: '2024-12-10 09:15',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@tenant.com',
    role: 'tenant',
    status: 'inactive',
    lastLogin: '2024-12-08 16:45',
  },
];

// Dados Mock para Categorias
export const mockCategories = [
  { id: '1', name: 'Cortes Masculinos', icon: 'scissors', color: '#3B82F6', parentId: null, order: 1, active: true, createdAt: '2024-01-10' },
  { id: '2', name: 'Barba', icon: 'user', color: '#10B981', parentId: null, order: 2, active: true, createdAt: '2024-01-10' },
  { id: '3', name: 'Infantil', icon: 'smile', color: '#F59E0B', parentId: null, order: 3, active: true, createdAt: '2024-01-10' },
  { id: '4', name: 'Degradê', icon: 'zap', color: '#8B5CF6', parentId: '1', order: 1, active: true, createdAt: '2024-01-11' },
  { id: '5', name: 'Social', icon: 'briefcase', color: '#EC4899', parentId: '1', order: 2, active: true, createdAt: '2024-01-11' },
];

// Dados Mock para Clientes
export const mockClientsList = [
  { id: '1', name: 'Carlos Mendes', phone: '(11) 99999-1111', email: 'carlos@email.com', document: '123.456.789-00', createdAt: '2024-01-15' },
  { id: '2', name: 'Ana Paula', phone: '(11) 99999-2222', email: 'ana@email.com', document: '234.567.890-11', createdAt: '2024-01-16' },
  { id: '3', name: 'Roberto Lima', phone: '(11) 99999-3333', email: 'roberto@email.com', document: '345.678.901-22', createdAt: '2024-01-17' },
  { id: '4', name: 'Fernanda Costa', phone: '(11) 99999-4444', email: 'fernanda@email.com', document: '456.789.012-33', createdAt: '2024-01-18' },
  { id: '5', name: 'Lucas Ferreira', phone: '(11) 99999-5555', email: 'lucas@email.com', document: '567.890.123-44', createdAt: '2024-01-19' },
];

// Dados Mock para Produtos
export const mockProductsList = [
  { id: '1', name: 'Pomada Modeladora', description: 'Pomada de alta fixação', price: 35.90, stock: 50, active: true, categoryId: '1', createdAt: '2024-01-10' },
  { id: '2', name: 'Óleo para Barba', description: 'Hidratação e brilho', price: 29.90, stock: 30, active: true, categoryId: '2', createdAt: '2024-01-11' },
  { id: '3', name: 'Shampoo Especial', description: 'Para todos os tipos de cabelo', price: 45.00, stock: 25, active: true, categoryId: '1', createdAt: '2024-01-12' },
  { id: '4', name: 'Condicionador', description: 'Maciez e hidratação', price: 42.50, stock: 20, active: true, categoryId: '1', createdAt: '2024-01-13' },
  { id: '5', name: 'Gel Fixador', description: 'Fixação extrema', price: 25.00, stock: 40, active: false, categoryId: '1', createdAt: '2024-01-14' },
];

// Dados Mock para Serviços
export const mockServicesList = [
  { id: '1', name: 'Corte Social', description: 'Corte tradicional', price: 50.00, duration: 30, active: true, createdAt: '2024-01-10' },
  { id: '2', name: 'Corte Degradê', description: 'Estilo moderno', price: 60.00, duration: 40, active: true, createdAt: '2024-01-10' },
  { id: '3', name: 'Barba Completa', description: 'Barba desenhada', price: 40.00, duration: 25, active: true, createdAt: '2024-01-10' },
  { id: '4', name: 'Corte Infantil', description: 'Para crianças até 12 anos', price: 45.00, duration: 30, active: true, createdAt: '2024-01-10' },
  { id: '5', name: 'Combo Corte + Barba', description: 'Economize no combo', price: 80.00, duration: 60, active: true, createdAt: '2024-01-10' },
];

// Dados Mock para Promoções
export const mockPromotionsList = [
  { id: '1', title: 'Desconto Primeira Visita', description: '20% off para novos clientes', discount: 20, startDate: '2024-01-01', endDate: '2024-12-31', active: true, createdAt: '2024-01-01' },
  { id: '2', title: 'Happy Hour', description: '15% off das 14h às 17h', discount: 15, startDate: '2024-01-01', endDate: '2024-06-30', active: true, createdAt: '2024-01-01' },
  { id: '3', title: 'Dia dos Pais', description: '30% off no combo', discount: 30, startDate: '2024-08-01', endDate: '2024-08-15', active: false, createdAt: '2024-07-15' },
];

// Dados Mock para Vendas
export const mockSalesList = [
  { id: '1', clientId: '1', clientName: 'Carlos Mendes', items: [{ id: '1', serviceName: 'Corte Social', quantity: 1, price: 50.00, subtotal: 50.00 }], total: 50.00, status: 'completed', paymentMethod: 'pix', createdAt: '2024-12-10 10:30' },
  { id: '2', clientId: '2', clientName: 'Ana Paula', items: [{ id: '2', serviceName: 'Corte Degradê', quantity: 1, price: 60.00, subtotal: 60.00 }, { id: '3', productName: 'Pomada Modeladora', quantity: 1, price: 35.90, subtotal: 35.90 }], total: 95.90, status: 'completed', paymentMethod: 'credit_card', createdAt: '2024-12-10 11:15' },
  { id: '3', clientId: '3', clientName: 'Roberto Lima', items: [{ id: '4', serviceName: 'Barba Completa', quantity: 1, price: 40.00, subtotal: 40.00 }], total: 40.00, status: 'pending', paymentMethod: 'cash', createdAt: '2024-12-10 14:00' },
  { id: '4', clientId: '4', clientName: 'Fernanda Costa', items: [{ id: '5', serviceName: 'Combo Corte + Barba', quantity: 1, price: 80.00, subtotal: 80.00 }], total: 80.00, status: 'completed', paymentMethod: 'debit_card', createdAt: '2024-12-10 15:30' },
  { id: '5', clientId: '5', clientName: 'Lucas Ferreira', items: [{ id: '6', serviceName: 'Corte Infantil', quantity: 2, price: 45.00, subtotal: 90.00 }], total: 90.00, status: 'cancelled', paymentMethod: 'pix', createdAt: '2024-12-10 16:45' },
];

// Dados Mock para Transações Financeiras
export const mockFinancialTransactions = [
  { id: '1', type: 'income', category: 'Vendas', description: 'Recebimento de serviços', amount: 2500.00, status: 'paid', dueDate: '2024-12-10', paidDate: '2024-12-10', paymentMethod: 'pix', createdAt: '2024-12-10' },
  { id: '2', type: 'income', category: 'Vendas', description: 'Recebimento de produtos', amount: 890.50, status: 'paid', dueDate: '2024-12-10', paidDate: '2024-12-10', paymentMethod: 'credit_card', createdAt: '2024-12-10' },
  { id: '3', type: 'expense', category: 'Aluguel', description: 'Aluguel do espaço', amount: 1500.00, status: 'paid', dueDate: '2024-12-05', paidDate: '2024-12-05', paymentMethod: 'bank_transfer', createdAt: '2024-12-01' },
  { id: '4', type: 'expense', category: 'Produtos', description: 'Compra de insumos', amount: 450.00, status: 'pending', dueDate: '2024-12-15', paymentMethod: 'credit_card', createdAt: '2024-12-10' },
  { id: '5', type: 'expense', category: 'Energia', description: 'Conta de luz', amount: 280.00, status: 'pending', dueDate: '2024-12-20', paymentMethod: 'pix', createdAt: '2024-12-10' },
  { id: '6', type: 'income', category: 'Serviços', description: 'Pacote mensal', amount: 1200.00, status: 'paid', dueDate: '2024-12-01', paidDate: '2024-12-01', paymentMethod: 'pix', createdAt: '2024-12-01' },
];

// Dados Mock para Configurações Admin
export const mockAdminSettings = {
  general: {
    siteName: 'DiixWhatsApp',
    supportEmail: 'suporte@diixsolutions.com',
    maxTenants: 500,
  },
  security: {
    requireTwoFactor: false,
    sessionTimeout: 60,
    passwordMinLength: 8,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
  },
  integrations: {
    stripeEnabled: true,
    paypalEnabled: false,
    whatsappEnabled: true,
  },
  appearance: {
    theme: 'dark' as const,
    primaryColor: '#8B5CF6',
    logoUrl: '/logo.png',
  },
};

// Dados Mock para Configurações Tenant
export const mockTenantSettings = {
  businessName: 'Barbearia Style',
  whatsappNumber: '+5511987654321',
  timezone: 'America/Sao_Paulo',
  notificationPreferences: {
    newAppointment: true,
    appointmentReminder: true,
    promotionExpiring: true,
    marketingMessages: false,
  },
};

// Dados Mock para Estatísticas de Vendas
export const mockSalesStats = {
  totalSales: 1250,
  totalRevenue: 45230.50,
  averageTicket: 36.18,
  conversionRate: 12.5,
  salesToday: 45,
  revenueToday: 1850.00,
};

// Dados Mock para Estatísticas Financeiras
export const mockFinancialStats = {
  totalIncome: 52340.00,
  totalExpenses: 18450.00,
  netProfit: 33890.00,
  pendingReceivables: 2500.00,
  pendingPayables: 1200.00,
  cashFlow: 31390.00,
};
