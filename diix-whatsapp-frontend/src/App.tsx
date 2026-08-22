import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, Suspense, lazy } from 'react'
import LoginPage from './pages/auth/LoginPage'

// Admin Pages - Lazy Loaded
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminTenants = lazy(() => import('./pages/admin/Tenants'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const CategoriesPage = lazy(() => import('./pages/admin/categories/Categories'))
const AdminSettings = lazy(() => import('./pages/admin/settings/Settings'))
const SalesHistory = lazy(() => import('./pages/admin/history/SalesHistory'))
const FinancialHistory = lazy(() => import('./pages/admin/history/FinancialHistory'))

// Tenant Pages - Lazy Loaded
const TenantLayout = lazy(() => import('./components/layout/TenantLayout'))
const TenantDashboard = lazy(() => import('./pages/tenant/Dashboard'))
const TenantClients = lazy(() => import('./pages/tenant/Clients'))
const TenantProducts = lazy(() => import('./pages/tenant/Products'))
const TenantServices = lazy(() => import('./pages/tenant/Services'))
const TenantPromotion = lazy(() => import('./pages/tenant/Promotions'))
const TenantSettings = lazy(() => import('./pages/tenant/Settings'))
const TenantNewSale = lazy(() => import('./pages/tenant/sales/NewSale'))
const TenantSalesHistory = lazy(() => import('./pages/tenant/history/SalesHistory'))
const TenantFinancialHistory = lazy(() => import('./pages/tenant/history/FinancialHistory'))
const TenantReports = lazy(() => import('./pages/tenant/reports/Reports'))
const TenantMessages = lazy(() => import('./pages/tenant/messages/Messages'))

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary mx-auto mb-4"></div>
        <p className="text-text-muted">Carregando página...</p>
      </div>
    </div>
  )
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tenant';
  isActive: boolean;
}

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'tenant')[]
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const mockUserStr = localStorage.getItem('mock_user');
    if (mockUserStr) {
      setUser(JSON.parse(mockUserStr));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

// Unauthorized Page
function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Acesso Negado</h1>
        <p className="text-text-muted mb-6">Você não tem permissão para acessar esta página.</p>
        <a href="/" className="text-accent-primary hover:underline">Voltar ao início</a>
      </div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Routes - admin role only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tenants" element={<AdminTenants />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="history/sales" element={<SalesHistory />} />
          <Route path="history/financial" element={<FinancialHistory />} />
        </Route>

        {/* Tenant Routes - tenant role */}
        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantDashboard />} />
          <Route path="clients" element={<TenantClients />} />
          <Route path="products" element={<TenantProducts />} />
          <Route path="services" element={<TenantServices />} />
          <Route path="promotions" element={<TenantPromotion />} />
          <Route path="messages" element={<TenantMessages />} />
          <Route path="settings" element={<TenantSettings />} />
          <Route path="sales" element={<TenantNewSale />} />
          <Route path="sales/new" element={<TenantNewSale />} />
          <Route path="history/sales" element={<TenantSalesHistory />} />
          <Route path="history/financial" element={<TenantFinancialHistory />} />
          <Route path="reports" element={<TenantReports />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
