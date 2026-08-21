import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Package,
  Briefcase,
  Percent,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  ShoppingCart,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tenant';
  isActive: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/tenant', icon: LayoutDashboard },
  { name: 'Clientes', href: '/tenant/clients', icon: Users },
  { name: 'Produtos', href: '/tenant/products', icon: Package },
  { name: 'Serviços', href: '/tenant/services', icon: Briefcase },
  { name: 'Promoções', href: '/tenant/promotions', icon: Percent },
  { 
    name: 'Vendas', 
    href: '/tenant/sales', 
    icon: ShoppingCart,
    children: [
      { name: 'Nova Venda', href: '/tenant/sales/new' },
      { name: 'Histórico de Vendas', href: '/tenant/history/sales' },
    ]
  },
  { 
    name: 'Históricos', 
    href: '/tenant/history', 
    icon: FileText,
    children: [
      { name: 'Vendas', href: '/tenant/history/sales' },
      { name: 'Financeiro', href: '/tenant/history/financial' },
      { name: 'Relatórios', href: '/tenant/reports' },
    ]
  },
  { name: 'Mensagens', href: '/tenant/messages', icon: MessageSquare },
  { name: 'Configurações', href: '/tenant/settings', icon: Settings },
]

export default function TenantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const mockUserStr = localStorage.getItem('mock_user');
    if (mockUserStr) {
      setUser(JSON.parse(mockUserStr));
    }
  }, []);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_remembered_identifier');
    localStorage.removeItem('mock_remembered_password');
    toast.success('Logout realizado com sucesso!')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-animated-gradient -z-10" />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 z-40 h-screen w-72 glass-panel border-r border-white/10"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/tenant" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center neon-glow-green">
                <MessageSquare className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">DiixWhatsApp</h1>
                <p className="text-xs text-text-muted">Painel do Cliente</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.children && item.children.some(child => location.pathname === child.href))
              const isExpanded = expandedMenus.includes(item.name)
              
              if (item.children) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 pl-4 border-l border-white/10 space-y-1"
                      >
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.href
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isChildActive
                                  ? 'text-accent-primary bg-accent-primary/5'
                                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                              }`}
                            >
                              {child.name}
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-8 bg-accent-primary rounded-r-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="glass-card rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-text-muted capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-error/10 text-text-secondary hover:text-error transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass-panel border-b border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
