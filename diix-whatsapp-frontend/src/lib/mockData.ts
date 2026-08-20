// Dados Mock para Dashboard Admin
export const mockAdminStats = {
  totalTenants: 24,
  activeTenants: 18,
  totalClients: 156,
  totalRevenue: 45780.90,
  monthlyGrowth: 12.5,
};

export const mockTenantsList = [
  {
    id: '1',
    businessName: 'Restaurante Sabor & Arte',
    email: 'contato@saborarte.com',
    phone: '(11) 98765-4321',
    status: 'active',
    createdAt: '2024-01-15',
    plan: 'premium',
  },
  {
    id: '2',
    businessName: 'Clínica Saúde Total',
    email: 'admin@saudetotal.com.br',
    phone: '(21) 97654-3210',
    status: 'active',
    createdAt: '2024-02-20',
    plan: 'basic',
  },
  {
    id: '3',
    businessName: 'Academia Corpo em Forma',
    email: 'contato@corpoemforma.com',
    phone: '(31) 96543-2109',
    status: 'inactive',
    createdAt: '2024-03-10',
    plan: 'premium',
  },
  {
    id: '4',
    businessName: 'Salão Beleza Natural',
    email: 'agenda@belezanatural.com',
    phone: '(41) 95432-1098',
    status: 'active',
    createdAt: '2024-04-05',
    plan: 'standard',
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
