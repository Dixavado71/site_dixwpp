# 📊 MAPEAMENTO COMPLETO DO FRONTEND - DiixWhatsApp

## FASE 1 — INVENTÁRIO COMPLETO

### 1.1 Mapeamento de Páginas/Rotas

| Path | Título/Descrição | Perfil | Componente | Status |
|------|------------------|--------|------------|--------|
| `/login` | Login | Público | `LoginPage` | ✅ Implementado |
| `/unauthorized` | Acesso Negado | Público | `UnauthorizedPage` | ✅ Implementado |
| `/admin` | Dashboard Admin | admin_master | `AdminDashboard` | ✅ Implementado |
| `/admin/tenants` | Gestão de Tenants | admin_master | `AdminTenants` | ⚠️ Parcial (sem modal CRUD) |
| `/admin/users` | Gestão de Usuários | admin_master | `AdminUsers` | ⚠️ Parcial (somente lista) |
| `/admin/categories` | Categorias Globais | admin_master | `CategoriesPage` | ✅ Implementado |
| `/admin/settings` | Configurações Globais | admin_master | `AdminSettings` | ✅ Implementado |
| `/admin/history/sales` | Histórico de Vendas Global | admin_master | `SalesHistory` | ✅ Implementado |
| `/admin/history/financial` | Financeiro Global | admin_master | `FinancialHistory` | ✅ Implementado |
| `/tenant` | Dashboard Tenant | tenant | `TenantDashboard` | ✅ Implementado |
| `/tenant/clients` | Clientes | tenant | `TenantClients` | ⚠️ Parcial (somente lista) |
| `/tenant/products` | Produtos | tenant | `TenantProducts` | ⚠️ Parcial (somente lista) |
| `/tenant/services` | Serviços | tenant | `TenantServices` | ⚠️ Parcial (somente lista) |
| `/tenant/promotions` | Promoções | tenant | `TenantPromotions` | ⚠️ Parcial (somente lista) |
| `/tenant/settings` | Configurações Tenant | tenant | `TenantSettings` | ⚠️ Parcial (template genérico) |

**Rotas Faltantes:**
- [ ] `/admin/tenants/:id` - Detalhe do tenant
- [ ] `/admin/financial/reports` - Relatórios consolidados
- [ ] `/admin/logs` - Logs de auditoria
- [ ] `/tenant/products/:id` - Detalhe do produto
- [ ] `/tenant/sales` - Histórico de vendas próprio
- [ ] `/tenant/sales/new` - Criar nova venda
- [ ] `/tenant/customers/:id` - Histórico do cliente
- [ ] `/tenant/categories` - Gestão de categorias do tenant
- [ ] `/tenant/financial` - Financeiro próprio
- [ ] `/tenant/users` - Gestão de usuários do tenant

---

### 1.2 Mapeamento de Botões

#### **Página /admin (Dashboard)**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| (nenhum botão de ação) | Visualização apenas | - | - | admin |

#### **Página /admin/tenants**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Novo Item | Criar tenant | ❌ Faltando TenantCreateModal | POST /tenants | admin |
| Editar (ícone) | Editar tenant | ❌ Faltando TenantEditModal | PUT /tenants/:id | admin |
| Excluir (ícone) | Excluir tenant | ❌ Faltando ConfirmModal | DELETE /tenants/:id | admin |
| Buscar (input) | Filtrar | ❌ Faltando FiltersModal | GET /tenants?search= | admin |

#### **Página /admin/users**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Ver detalhes (olho) | Visualizar | ❌ Faltando DetailModal | GET /users/:id | admin |
| Editar (lápis) | Editar usuário | ❌ Faltando UserEditModal | PUT /users/:id | admin |
| Excluir (lixeira) | Excluir usuário | ❌ Faltando ConfirmModal | DELETE /users/:id | admin |

#### **Página /admin/categories**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Nova Categoria | Criar categoria | ✅ CategoryModal | POST /categories | admin |
| Editar (lápis) | Editar categoria | ✅ CategoryModal (edit) | PUT /categories/:id | admin |
| Excluir | Excluir categoria | ✅ ConfirmModal (window.confirm) | DELETE /categories/:id | admin |
| Toggle Status | Ativar/desativar | ✅ ConfirmModal implícito | PATCH /categories/:id/status | admin |

#### **Página /admin/settings**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Salvar Configurações | Update settings | ❌ Nenhum (toast direto) | PUT /settings | admin |
| Tabs (Geral, Segurança, etc) | Navegar entre seções | - | - | admin |

#### **Página /admin/history/sales**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Filtrar | Aplicar filtros | ❌ Filtros inline | GET /sales?filters= | admin |
| Exportar | Exportar CSV | ❌ Nenhum (download direto) | GET /sales/export | admin |
| Paginação (Anterior/Próxima) | Navegar páginas | - | GET /sales?page= | admin |

#### **Página /admin/history/financial**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Filtrar | Aplicar filtros | ❌ Filtros inline | GET /financial?filters= | admin |
| Exportar | Exportar CSV | ❌ Nenhum (download direto) | GET /financial/export | admin |
| Paginação (Anterior/Próxima) | Navegar páginas | - | GET /financial?page= | admin |

#### **Página /tenant (Dashboard)**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| (nenhum botão de ação) | Visualização apenas | - | - | tenant |

#### **Página /tenant/clients**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Novo Item | Criar cliente | ❌ Faltando CustomerCreateModal | POST /customers | tenant |
| Editar (ícone) | Editar cliente | ❌ Faltando CustomerEditModal | PUT /customers/:id | tenant |
| Excluir (ícone) | Excluir cliente | ❌ Faltando ConfirmModal | DELETE /customers/:id | tenant |

#### **Página /tenant/products**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Novo Produto | Criar produto | ❌ Faltando ProductCreateModal | POST /products | tenant |
| Editar (ícone) | Editar produto | ❌ Faltando ProductEditModal | PUT /products/:id | tenant |
| Excluir (ícone) | Excluir produto | ❌ Faltando ConfirmModal | DELETE /products/:id | tenant |

#### **Página /tenant/services**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Novo Item | Criar serviço | ❌ Faltando ServiceCreateModal | POST /services | tenant |
| Editar (ícone) | Editar serviço | ❌ Faltando ServiceEditModal | PUT /services/:id | tenant |
| Excluir (ícone) | Excluir serviço | ❌ Faltando ConfirmModal | DELETE /services/:id | tenant |

#### **Página /tenant/promotions**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Nova Promoção | Criar promoção | ❌ Faltando PromotionCreateModal | POST /promotions | tenant |
| Editar (ícone) | Editar promoção | ❌ Faltando PromotionEditModal | PUT /promotions/:id | tenant |
| Excluir (ícone) | Excluir promoção | ❌ Faltando ConfirmModal | DELETE /promotions/:id | tenant |

#### **Página /tenant/settings**
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Novo Item | Ação genérica | ❌ Sem funcionalidade | - | tenant |
| Editar/Excluir | Ações genéricas | ❌ Sem funcionalidade | - | tenant |

---

### 1.3 Mapeamento de Modais

#### **Modais Existentes:**

| Modal | Trigger | Campos | Schema Zod | Ação Submit |
|-------|---------|--------|------------|-------------|
| `CategoryModal` | "Nova Categoria" | name, icon, color, parentId, status | ✅ categorySchema | create/update |
| `ConfirmModal` | Vários botões | title, message, variant | N/A | confirm |
| `DetailModal` | Botão "Ver Detalhes" | data, fields, actions | N/A | view only |
| `ExportModal` | Botão "Exportar" | formats, filters | N/A | export |
| `FiltersModal` | Botão "Filtrar" | dynamic fields | N/A | apply filters |

#### **Modais Faltantes:**

**Admin Master:**
- [ ] `TenantCreateModal` - Criar tenant (nome, email, telefone, plano, limites)
- [ ] `TenantEditModal` - Editar tenant (mesmos campos + status)
- [ ] `UserCreateModal` - Criar usuário (nome, email, senha, role, tenantId)
- [ ] `UserEditModal` - Editar usuário
- [ ] `FinancialTransactionModal` - Nova transação financeira
- [ ] `ReconcileModal` - Conciliar transação
- [ ] `FinancialDetailModal` - Ver detalhe financeiro
- [ ] `SaleDetailModal` - Ver detalhe de venda

**Tenant:**
- [ ] `ProductCreateModal` / `ProductEditModal` - CRUD produtos (nome, descrição, preço, custo, estoque, categoria, SKU)
- [ ] `ServiceCreateModal` / `ServiceEditModal` - CRUD serviços
- [ ] `CustomerCreateModal` / `CustomerEditModal` - CRUD clientes (nome, email, telefone, CPF/CNPJ, endereço)
- [ ] `PromotionCreateModal` / `PromotionEditModal` - CRUD promoções (nome, tipo, valor, produtos, datas)
- [ ] `SaleCreateModal` - Nova venda (cliente, produtos[], desconto, pagamento)
- [ ] `SaleEditModal` - Editar venda
- [ ] `CategoryCreateModal` / `CategoryEditModal` - Categorias do tenant
- [ ] `PrintModal` - Imprimir venda/cupom

---

## FASE 2 — REORGANIZAÇÃO POR PERFIL

### 2.1 Estrutura de Rotas Proposta

```typescript
// Admin Master Routes
/admin/dashboard          → Visão geral do sistema
/admin/tenants            → CRUD de tenants
/admin/tenants/:id        → Detalhe do tenant
/admin/financial          → Controle financeiro global
/admin/financial/reports  → Relatórios consolidados
/admin/sales              → Histórico de vendas global
/admin/settings           → Configurações globais
/admin/logs               → Logs de auditoria
/admin/users              → Gestão de admins globais

// Tenant Routes
/tenant/dashboard         → Visão geral do tenant
/tenant/products          → CRUD de produtos
/tenant/products/:id      → Detalhe do produto
/tenant/categories        → Gestão de categorias
/tenant/services          → CRUD de serviços
/tenant/sales             → Histórico de vendas próprio
/tenant/sales/new         → Criar nova venda
/tenant/sales/:id         → Detalhe da venda
/tenant/promotions        → Gestão de promoções
/tenant/customers         → Gestão de clientes
/tenant/customers/:id     → Histórico do cliente
/tenant/financial         → Controle financeiro próprio
/tenant/settings          → Configurações do tenant
/tenant/users             → Gestão de usuários do tenant
```

### 2.2 Separação de Stores Proposta

```
/stores
├── /admin
│   ├── adminTenantStore.ts      (CRUD tenants, suspender/ativar)
│   ├── adminFinancialStore.ts   (Financeiro global, relatórios)
│   ├── adminSalesStore.ts       (Vendas globais, estatísticas)
│   ├── adminSettingsStore.ts    (Configurações globais)
│   ├── adminUsersStore.ts       (Gestão de usuários admin)
│   └── adminLogsStore.ts        (Logs de auditoria)
│
├── /tenant
│   ├── tenantProductStore.ts    (CRUD produtos, estoque)
│   ├── tenantServiceStore.ts    (CRUD serviços)
│   ├── tenantSalesStore.ts      (Vendas próprias, PDV)
│   ├── tenantCustomerStore.ts   (CRUD clientes)
│   ├── tenantPromotionStore.ts  (CRUD promoções)
│   ├── tenantCategoryStore.ts   (Categorias do tenant)
│   ├── tenantFinancialStore.ts  (Financeiro próprio)
│   └── tenantSettingsStore.ts   (Configurações do tenant)
│
└── /shared
    ├── authStore.ts             (Autenticação, sessão)
    ├── uiStore.ts               (Estado da UI, modais)
    └── notificationStore.ts     (Toasts, notificações)
```

---

## FASE 3 — CHECKLIST DE IMPLEMENTAÇÃO

### Prioridade 1: Modais Genéricos (✅ Já existem)
- [x] ConfirmModal
- [x] DetailModal
- [x] ExportModal
- [x] FiltersModal

### Prioridade 2: Schemas Zod (✅ Todos existem)
- [x] categorySchema (em index.ts + CategoryModal)
- [x] tenantSchema (em index.ts + tenantSchema.ts)
- [x] userSchema (em index.ts)
- [x] productSchema (em index.ts - básico, precisa expandir)
- [x] saleSchema (em index.ts - básico, precisa expandir)
- [x] financialTransactionSchema (em index.ts)
- [x] promotionSchema (✅ completo em promotionSchema.ts)
- [x] customerSchema (✅ completo em customerSchema.ts)
- [x] serviceSchema (✅ completo em serviceSchema.ts)
- [x] settingsSchema (em settingsSchema.ts)

### Prioridade 3: Páginas Admin Master para Implementar
- [ ] Completar /admin/tenants com modais CRUD
- [ ] Adicionar rota /admin/tenants/:id
- [ ] Adicionar rota /admin/financial/reports
- [ ] Adicionar rota /admin/logs
- [ ] Completar /admin/users com modal CRUD

### Prioridade 4: Páginas Tenant para Implementar
- [ ] Completar /tenant/products com modal CRUD
- [ ] Completar /tenant/services com modal CRUD
- [ ] Completar /tenant/customers com modal CRUD
- [ ] Completar /tenant/promotions com modal CRUD
- [ ] Criar /tenant/sales (histórico + nova venda)
- [ ] Criar /tenant/categories
- [ ] Criar /tenant/financial
- [ ] Completar /tenant/settings
- [ ] Criar /tenant/users

---

## FASE 4 — MATRIZ DE PERMISSÕES

| Recurso | Admin Master | Tenant | Descrição |
|---------|--------------|--------|-----------|
| Dashboard Admin | ✅ Leitura/Escrita | ❌ | Visão global do sistema |
| Tenants CRUD | ✅ Completo | ❌ | Gestão de todos os tenants |
| Usuários Globais | ✅ Completo | ❌ | Admins do sistema |
| Categorias Globais | ✅ Completo | ❌ | Categorias master |
| Settings Globais | ✅ Completo | ❌ | Configurações do sistema |
| Vendas Globais | ✅ Leitura | ❌ | Todas as vendas |
| Financeiro Global | ✅ Leitura/Escrita | ❌ | Todas as transações |
| Logs de Auditoria | ✅ Leitura | ❌ | Logs do sistema |
| Dashboard Tenant | ❌ | ✅ Leitura | Visão do próprio tenant |
| Produtos | ❌ | ✅ CRUD | Apenas produtos do tenant |
| Serviços | ❌ | ✅ CRUD | Apenas serviços do tenant |
| Clientes | ❌ | ✅ CRUD | Apenas clientes do tenant |
| Promoções | ❌ | ✅ CRUD | Apenas promoções do tenant |
| Vendas Próprias | ❌ | ✅ CRUD | Apenas vendas do tenant |
| Categorias Próprias | ❌ | ✅ CRUD | Categorias do tenant |
| Financeiro Próprio | ❌ | ✅ CRUD | Transações do tenant |
| Settings Tenant | ❌ | ✅ Escrita | Configurações do tenant |
| Usuários do Tenant | ❌ | ✅ CRUD | Equipe do tenant |

---

## FASE 5 — STATUS GERAL

### ✅ Implementado (Funcional)
- Login/Logout
- Dashboard Admin (visualização)
- Dashboard Tenant (visualização)
- Categorias Admin (CRUD completo com modal)
- Histórico de Vendas Admin (lista + filtros + export)
- Histórico Financeiro Admin (lista + gráficos + filtros + export)
- Settings Admin (tabs + forms)
- Modais genéricos (Confirm, Detail, Export, Filters)

### ⚠️ Parcial (Precisa completar)
- Tenants Admin (lista ok, falta CRUD modal)
- Users Admin (lista ok, falta CRUD modal)
- Products Tenant (lista ok, falta CRUD modal)
- Services Tenant (lista ok, falta CRUD modal)
- Customers Tenant (lista ok, falta CRUD modal)
- Promotions Tenant (lista ok, falta CRUD modal)
- Settings Tenant (template genérico)

### ❌ Faltando
- Rotas de detalhe (:id)
- Sales Tenant (PDV)
- Financial Tenant
- Categories Tenant
- Users Tenant
- Logs Admin
- Reports Admin
- Separação de stores por perfil
- Middleware de permissão granular

---

*Documento gerado em: 2024*
*Versão: 1.0*
