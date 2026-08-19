import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import { authService, initializeCsrfToken } from './services'
import LoginPage from './pages/auth/LoginPage'

// Admin Pages (will be created)
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminTenants from './pages/admin/Tenants'
import AdminUsers from './pages/admin/Users'

// Tenant Pages (will be created)
import TenantLayout from './components/layout/TenantLayout'
import TenantDashboard from './pages/tenant/Dashboard'
import TenantClients from './pages/tenant/Clients'
import TenantProducts from './pages/tenant/Products'
import TenantServices from './pages/tenant/Services'
import TenantPromotion from './pages/tenant/Promotions'
import TenantSettings from './pages/tenant/Settings'

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('MASTER' | 'TENANT_ADMIN' | 'TENANT_USER')[]
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
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
  const { setUser, setLoading } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize CSRF token (optional - won't block if fails)
        try {
          await initializeCsrfToken()
        } catch (csrfError) {
          console.warn('CSRF token initialization failed (backend may not be available):', csrfError)
        }

        // Try to get current user
        try {
          const user = await authService.getCurrentUser()
          if (user) {
            setUser(user)
          }
        } catch {
          // Not authenticated - this is normal on first load
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
        setUser(null)
      } finally {
        setLoading(false)
        setIsInitialized(true)
      }
    }

    initApp()
  }, [setUser, setLoading])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin Routes - MASTER role only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['MASTER']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="tenants" element={<AdminTenants />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* Tenant Routes - TENANT_ADMIN and TENANT_USER roles */}
      <Route
        path="/tenant"
        element={
          <ProtectedRoute allowedRoles={['TENANT_ADMIN', 'TENANT_USER']}>
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
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
