import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginPage from './pages/auth/LoginPage'

// Admin Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminTenants from './pages/admin/Tenants'
import AdminUsers from './pages/admin/Users'
import CategoriesPage from './pages/admin/categories/Categories'
import AdminSettings from './pages/admin/settings/Settings'
import SalesHistory from './pages/admin/history/SalesHistory'
import FinancialHistory from './pages/admin/history/FinancialHistory'

// Tenant Pages
import TenantLayout from './components/layout/TenantLayout'
import TenantDashboard from './pages/tenant/Dashboard'
import TenantClients from './pages/tenant/Clients'
import TenantProducts from './pages/tenant/Products'
import TenantServices from './pages/tenant/Services'
import TenantPromotion from './pages/tenant/Promotions'
import TenantSettings from './pages/tenant/Settings'
import TenantNewSale from './pages/tenant/sales/NewSale'
import TenantSalesHistory from './pages/tenant/history/SalesHistory'
import TenantFinancialHistory from './pages/tenant/history/FinancialHistory'
import TenantReports from './pages/tenant/reports/Reports'

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
  )
}

export default App
