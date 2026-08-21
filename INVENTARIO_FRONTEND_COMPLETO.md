# 📊 INVENTÁRIO COMPLETO DO FRONTEND - DiixWhatsApp

## FASE 1 — MAPEAMENTO DE PÁGINAS/ROTAS

### 1.1 Páginas Admin Master (Super Admin)

| Path | Título/Descrição | Perfil | Componente | Status |
|------|------------------|--------|------------|--------|
| `/admin` | Dashboard - Visão geral do sistema | admin | `AdminDashboard` | ✅ Implementado |
| `/admin/tenants` | Gestão de Tenants (lista) | admin | `AdminTenants` | ⚠️ Parcial (mock data, sem modal CRUD) |
| `/admin/users` | Gestão de Usuários Globais | admin | `AdminUsers` | ⚠️ Parcial (somente lista, sem modal) |
| `/admin/categories` | Gestão de Categorias | admin | `CategoriesPage` | ✅ Implementado (com modal) |
| `/admin/history/sales` | Histórico de Vendas Global | admin | `SalesHistory` | ✅ Implementado |
| `/admin/history/financial` | Controle Financeiro Global | admin | `FinancialHistory` | ✅ Implementado |
| `/admin/settings` | Configurações Globais | admin | `AdminSettings` | ⚠️ Parcial (sem salvar real) |

**Rotas Faltantes Admin:**
- ❌ `/admin/tenants/:id` - Detalhe do tenant
- ❌ `/admin/financial/reports` - Relatórios consolidados
- ❌ `/admin/logs` - Logs de auditoria

---

### 1.2 Páginas Tenant (Admin do Tenant)

| Path | Título/Descrição | Perfil | Componente | Status |
|------|------------------|--------|------------|--------|
| `/tenant` | Dashboard - Visão geral do tenant | tenant | `TenantDashboard` | ✅ Implementado |
| `/tenant/clients` | Gestão de Clientes | tenant | `TenantClients` | ⚠️ Parcial (mock data, sem modal) |
| `/tenant/products` | Gestão de Produtos | tenant | `TenantProducts` | ⚠️ Parcial (mock data, sem modal) |
| `/tenant/services` | Gestão de Serviços | tenant | `TenantServices` | ⚠️ Parcial (mock data, sem modal) |
| `/tenant/promotions` | Gestão de Promoções | tenant | `TenantPromotions` | ⚠️ Parcial (mock data, sem modal) |
| `/tenant/settings` | Configurações do Tenant | tenant | `TenantSettings` | ⚠️ Parcial (mock data) |

**Rotas Faltantes Tenant:**
- ❌ `/tenant/products/:id` - Detalhe do produto
- ❌ `/tenant/sales` - Histórico de vendas próprio
- ❌ `/tenant/sales/new` - Criar nova venda
- ❌ `/tenant/customers/:id` - Histórico do cliente
- ❌ `/tenant/financial` - Financeiro próprio
- ❌ `/tenant/categories` - Categorias do tenant
- ❌ `/tenant/users` - Usuários do tenant

---

## FASE 2 — MAPEAMENTO DE BOTÕES

### 2.1 Admin Master — Botões por Página

#### `/admin/dashboard`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| (nenhum) | Somente visualização | - | - | admin |

#### `/admin/tenants`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| "Novo Item" | Criar tenant | ❌ Faltando | POST /tenants | admin |
| Editar (ícone) | Editar tenant | ❌ Faltando | PUT /tenants/:id | admin |
| Excluir (ícone) | Excluir tenant | ❌ ConfirmModal | DELETE /tenants/:id | admin |

**Modais Faltantes:**
- ❌ `TenantCreateModal`
- ❌ `TenantEditModal`
- ❌ `TenantFiltersModal`
- ❌ `ExportModal`

#### `/admin/users`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| (nenhum) | Somente lista | - | - | admin |
| Ver (ícone) | Ver detalhes | ❌ Faltando | GET /users/:id | admin |
| Editar (ícone) | Editar usuário | ❌ Faltando | PUT /users/:id | admin |
| Excluir (ícone) | Excluir usuário | ❌ ConfirmModal | DELETE /users/:id | admin |

**Modais Faltantes:**
- ❌ `UserCreateModal`
- ❌ `UserEditModal`
- ❌ `UserDetailModal`

#### `/admin/categories`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| "Nova Categoria" | Criar categoria | ✅ CategoryModal | POST /categories | admin |
| Editar (ícone) | Editar categoria | ✅ CategoryModal | PUT /categories/:id | admin |
| Excluir (confirm) | Excluir categoria | window.confirm | DELETE /categories/:id | admin |
| Toggle Status | Ativar/Desativar | - | PATCH /categories/:id/status | admin |

**Status:** ✅ Completo

#### `/admin/history/sales`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Filtrar | Aplicar filtros | ❌ Faltando | GET /sales | admin |
| Exportar | Exportar CSV | ✅ exportCSV() | GET /sales/export | admin |

**Modais Faltantes:**
- ❌ `SalesFiltersModal`
- ❌ `SaleDetailModal`

#### `/admin/history/financial`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Filtrar | Aplicar filtros | ❌ Faltando | GET /transactions | admin |
| Exportar | Exportar CSV | ✅ exportCSV() | GET /transactions/export | admin |

**Modais Faltantes:**
- ❌ `FinancialFiltersModal`
- ❌ `FinancialTransactionModal` (criar transação)
- ❌ `ReconcileModal` (conciliar)
- ❌ `FinancialDetailModal`

#### `/admin/settings`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| Salvar Configurações | Salvar | - | PUT /settings | admin |

---

### 2.2 Tenant — Botões por Página

#### `/tenant/dashboard`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| (nenhum) | Somente visualização | - | - | tenant |

#### `/tenant/clients`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| "Novo Item" | Criar cliente | ❌ Faltando | POST /clients | tenant |
| Editar (ícone) | Editar cliente | ❌ Faltando | PUT /clients/:id | tenant |
| Excluir (ícone) | Excluir cliente | ❌ ConfirmModal | DELETE /clients/:id | tenant |

**Modais Faltantes:**
- ❌ `CustomerCreateModal`
- ❌ `CustomerEditModal`
- ❌ `CustomerFiltersModal`

#### `/tenant/products`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| "Novo Produto" | Criar produto | ❌ Faltando | POST /products | tenant |
| Editar (ícone) | Editar produto | ❌ Faltando | PUT /products/:id | tenant |
| Excluir (ícone) | Excluir produto | ❌ ConfirmModal | DELETE /products/:id | tenant |

**Modais Faltantes:**
- ❌ `ProductCreateModal`
- ❌ `ProductEditModal`
- ❌ `ProductFiltersModal`
- ❌ `ProductDetailModal`

#### `/tenant/services`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| "Novo Item" | Criar serviço | ❌ Faltando | POST /services | tenant |
| Editar (ícone) | Editar serviço | ❌ Faltando | PUT /services/:id | tenant |
| Excluir (ícone) | Excluir serviço | ❌ ConfirmModal | DELETE /services/:id | tenant |

**Modais Faltantes:**
- ❌ `ServiceCreateModal`
- ❌ `ServiceEditModal`

#### `/tenant/promotions`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| "Nova Promoção" | Criar promoção | ❌ Faltando | POST /promotions | tenant |
| Editar (ícone) | Editar promoção | ❌ Faltando | PUT /promotions/:id | tenant |
| Excluir (ícone) | Excluir promoção | ❌ ConfirmModal | DELETE /promotions/:id | tenant |

**Modais Faltantes:**
- ❌ `PromotionCreateModal`
- ❌ `PromotionEditModal`

#### `/tenant/settings`
| Botão | Ação | Modal | Endpoint | Permissão |
|-------|------|-------|----------|-----------|
| "Novo Item" | (genérico) | ❌ Faltando | - | tenant |

---

## FASE 3 — MAPEAMENTO DE MODAIS

### 3.1 Modais Existentes

| Modal | Trigger | Campos | Schema Zod | Ação Submit |
|-------|---------|--------|------------|-------------|
| `CategoryModal` | "Nova Categoria" | name, icon, color, parentId, status | ✅ categorySchema | create/update |

### 3.2 Modais Faltantes - Admin Master

| Modal | Trigger | Campos Esperados | Schema Necessário |
|-------|---------|------------------|-------------------|
| `TenantCreateModal` | "+ Novo Tenant" | nome, email, telefone, plano, limites | ✅ tenantSchema (existe) |
| `TenantEditModal` | "Editar" | mesmos campos + id | ✅ tenantSchema |
| `UserCreateModal` | "+ Novo Usuário" | nome, email, senha, role, tenantId | ✅ userSchema (existe) |
| `UserEditModal` | "Editar" | mesmos campos + id | ✅ userSchema |
| `ConfirmModal` | Vários botões | title, message, onConfirm | - |
| `ExportModal` | "Exportar" | formats, filters, onExport | - |
| `FiltersModal` | "Filtrar" | dynamic fields, onApply | - |
| `DetailModal` | "Ver Detalhe" | data, fields | - |
| `FinancialTransactionModal` | "Nova Transação" | type, description, amount, dueDate, status | ✅ financialTransactionSchema (existe) |
| `ReconcileModal` | "Conciliar" | transactionId, reconciliationData | - |

### 3.3 Modais Faltantes - Tenant

| Modal | Trigger | Campos Esperados | Schema Necessário |
|-------|---------|------------------|-------------------|
| `CustomerCreateModal` | "+ Novo Cliente" | nome, email, telefone, CPF/CNPJ, endereço | ❌ customerSchema (faltando) |
| `CustomerEditModal` | "Editar" | mesmos campos + id | ❌ customerSchema |
| `ProductCreateModal` | "+ Novo Produto" | nome, descrição, preço, custo, estoque, categoria | ✅ productSchema (existe) |
| `ProductEditModal` | "Editar" | mesmos campos + id | ✅ productSchema |
| `ServiceCreateModal` | "+ Novo Serviço" | nome, descrição, preço, duração | ❌ serviceSchema (faltando) |
| `ServiceEditModal` | "Editar" | mesmos campos + id | ❌ serviceSchema |
| `PromotionCreateModal` | "+ Nova Promoção" | nome, tipo, valor, produtos, data início/fim | ❌ promotionSchema (faltando) |
| `PromotionEditModal` | "Editar" | mesmos campos + id | ❌ promotionSchema |
| `SaleCreateModal` | "+ Nova Venda" | cliente, produtos[], desconto, pagamento | ✅ saleSchema (existe) |

---

## FASE 4 — SCHEMAS ZOD

### 4.1 Schemas Existentes (`/schemas/index.ts`)

| Schema | Status | Uso |
|--------|--------|-----|
| `categorySchema` | ✅ Completo | CategoryModal |
| `tenantSchema` | ✅ Completo | Faltando modais |
| `userSchema` | ✅ Completo | Faltando modais |
| `productSchema` | ✅ Completo | Faltando modais |
| `saleSchema` | ✅ Completo | Faltando modal SaleCreate |
| `financialTransactionSchema` | ✅ Completo | Faltando modal |
| `adminSettingsSchema` | ✅ Completo | Settings page |

### 4.2 Schemas Faltantes

| Schema | Campos Necessários | Prioridade |
|--------|-------------------|------------|
| `customerSchema` | name, email, phone, document, address, notes | 🔴 Alta |
| `promotionSchema` | name, type, value, products, startDate, endDate, status | 🔴 Alta |
| `serviceSchema` | name, description, price, duration, categoryId | 🟡 Média |

---

## FASE 5 — STORES

### 5.1 Stores Existentes

| Store | Estado | Ações | Status |
|-------|--------|-------|--------|
| `tenantsStore` | tenants[], isLoading, error | fetch, create, update, delete | ⚠️ Sem integração UI |
| `categoryStore` | categories[], isLoading | fetch, create, update, delete, toggle | ✅ Integrado |
| `financialStore` | transactions[], stats, filters | fetch, exportCSV, setFilters | ✅ Integrado |
| `salesStore` | sales[], stats, filters | fetch, exportCSV, setFilters | ✅ Integrado |
| `settingsStore` | settings | fetch, update | ⚠️ Parcial |

### 5.2 Stores Faltantes

| Store | Domínio | Perfil |
|-------|---------|--------|
| `productsStore` | CRUD produtos | tenant |
| `customersStore` | CRUD clientes | tenant |
| `servicesStore` | CRUD serviços | tenant |
| `promotionsStore` | CRUD promoções | tenant |
| `usersStore` | CRUD usuários | admin |

---

## FASE 6 — REORGANIZAÇÃO PROPOSTA

### 6.1 Estrutura de Pastas Reorganizada

```
/src
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── Tenants.tsx
│   │   ├── Users.tsx
│   │   ├── categories/
│   │   ├── history/
│   │   └── settings/
│   └── tenant/
│       ├── Dashboard.tsx
│       ├── Products.tsx
│       ├── Services.tsx
│       ├── Customers.tsx
│       ├── Sales/
│       ├── Promotions.tsx
│       ├── Financial.tsx (novo)
│       └── Settings.tsx
│
├── stores/
│   ├── admin/
│   │   ├── adminTenantStore.ts
│   │   ├── adminUserStore.ts
│   │   ├── adminFinancialStore.ts
│   │   ├── adminSalesStore.ts
│   │   └── adminSettingsStore.ts
│   ├── tenant/
│   │   ├── tenantProductStore.ts
│   │   ├── tenantServiceStore.ts
│   │   ├── tenantCustomerStore.ts
│   │   ├── tenantSaleStore.ts
│   │   ├── tenantPromotionStore.ts
│   │   └── tenantFinancialStore.ts
│   └── shared/
│       ├── authStore.ts
│       ├── uiStore.ts
│       └── notificationStore.ts
│
├── components/
│   └── modals/
│       ├── ConfirmModal.tsx (novo - genérico)
│       ├── ExportModal.tsx (novo - genérico)
│       ├── FiltersModal.tsx (novo - genérico)
│       ├── DetailModal.tsx (novo - genérico)
│       ├── TenantModal.tsx (novo)
│       ├── UserModal.tsx (novo)
│       ├── CustomerModal.tsx (novo)
│       ├── ProductModal.tsx (novo)
│       ├── ServiceModal.tsx (novo)
│       ├── PromotionModal.tsx (novo)
│       ├── SaleModal.tsx (novo)
│       └── CategoryModal.tsx (existente)
│
└── schemas/
    ├── index.ts (atual)
    ├── customerSchema.ts (novo)
    ├── promotionSchema.ts (novo)
    └── serviceSchema.ts (novo)
```

### 6.2 Rotas Reorganizadas por Perfil

#### Admin Master (`/admin/*`)
```typescript
{
  path: '/admin',
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: 'tenants', element: <AdminTenants /> },
    { path: 'tenants/:id', element: <TenantDetail /> }, // NOVO
    { path: 'users', element: <AdminUsers /> },
    { path: 'categories', element: <CategoriesPage /> },
    { path: 'history/sales', element: <SalesHistory /> },
    { path: 'history/financial', element: <FinancialHistory /> },
    { path: 'financial/reports', element: <FinancialReports /> }, // NOVO
    { path: 'settings', element: <AdminSettings /> },
    { path: 'logs', element: <AuditLogs /> }, // NOVO
  ]
}
```

#### Tenant (`/tenant/*`)
```typescript
{
  path: '/tenant',
  children: [
    { index: true, element: <TenantDashboard /> },
    { path: 'products', element: <TenantProducts /> },
    { path: 'products/:id', element: <ProductDetail /> }, // NOVO
    { path: 'services', element: <TenantServices /> },
    { path: 'customers', element: <TenantCustomers /> },
    { path: 'customers/:id', element: <CustomerDetail /> }, // NOVO
    { path: 'sales', element: <SalesHistory /> }, // NOVO
    { path: 'sales/new', element: <NewSale /> }, // NOVO
    { path: 'promotions', element: <TenantPromotions /> },
    { path: 'financial', element: <TenantFinancial /> }, // NOVO
    { path: 'settings', element: <TenantSettings /> },
    { path: 'users', element: <TenantUsers /> }, // NOVO
  ]
}
```

---

## FASE 7 — CHECKLIST DE VALIDAÇÃO

### Checklist Geral

- [ ] Zero botões sem ação definida
- [ ] Zero modais sem schema de validação
- [ ] Separação clara entre Admin Master e Tenant
- [ ] Modais genéricos reutilizáveis criados
- [ ] Stores separados por domínio e perfil
- [ ] Rotas protegidas por middleware de role
- [ ] Toast em todas as ações
- [ ] Loading/empty/error states tratados

### Validação de Fluxos (por botão)

| Botão | onClick | Modal | Validação Zod | Service | Store | Toast | Update UI |
|-------|---------|-------|---------------|---------|-------|-------|-----------|
| Novo Tenant | ❌ | ❌ | ✅ | ❌ | ⚠️ | ❌ | ❌ |
| Editar Tenant | ❌ | ❌ | ✅ | ❌ | ⚠️ | ❌ | ❌ |
| Novo Cliente | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Novo Produto | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Nova Promoção | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Nova Venda | ❌ | ❌ | ✅ | ❌ | ⚠️ | ❌ | ❌ |

---

## RESUMO EXECUTIVO

### Implementado (✅)
- 2 Dashboards (Admin + Tenant)
- 1 Sistema completo de categorias com modal
- 2 Históricos (Vendas + Financeiro) com tabelas e KPIs
- 6 Schemas Zod completos
- 5 Stores (parcialmente integrados)

### Parcial (⚠️)
- 7 Páginas com mock data (sem funcionalidade real)
- 2 Settings pages (sem persistência)
- Stores existentes sem integração completa na UI

### Faltando (❌)
- **10 Modais específicos** (Tenant, User, Customer, Product, Service, Promotion, Sale, Transaction, etc.)
- **4 Modais genéricos** (Confirm, Export, Filters, Detail)
- **3 Schemas** (customer, promotion, service)
- **5 Stores novos** (products, customers, services, promotions, users)
- **8 Rotas novas** (detalhes, financeiro tenant, vendas tenant, logs, reports)

### Prioridade de Implementação

**🔴 Alta Prioridade:**
1. Modais genéricos (ConfirmModal, ExportModal)
2. Schemas faltantes (customer, promotion)
3. Customer CRUD completo (modal + store)
4. Product CRUD completo (modal + store)

**🟡 Média Prioridade:**
5. Promotion CRUD completo
6. Service CRUD completo
7. Tenant CRUD completo (admin)
8. User CRUD completo (admin)

**🟢 Baixa Prioridade:**
9. Rotas de detalhe (:id)
10. Logs de auditoria
11. Relatórios financeiros consolidados

---

*Documento gerado em: $(date)*
*Frontend: DiixWhatsApp*
*Local: /workspace/diix-whatsapp-frontend/src*
