import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  FolderTree,
  History,
  DollarSign,
  Package,
  Briefcase,
  Percent,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tenant';
  isActive: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string }[];
}

const adminNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Tenants', href: '/admin/tenants', icon: Building2 },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Categorias', href: '/admin/categories', icon: FolderTree },
  { 
    name: 'Histórico', 
    href: '#', 
    icon: History,
    children: [
      { name: 'Vendas', href: '/admin/history/sales' },
      { name: 'Financeiro', href: '/admin/history/financial' },
    ]
  },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
]

const tenantNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/tenant', icon: LayoutDashboard },
  { name: 'Clientes', href: '/tenant/clients', icon: Users },
  { name: 'Produtos', href: '/tenant/products', icon: Package },
  { name: 'Serviços', href: '/tenant/services', icon: Briefcase },
  { name: 'Promoções', href: '/tenant/promotions', icon: Percent },
  { name: 'Configurações', href: '/tenant/settings', icon: Settings },
]

interface SidebarProps {
  variant: 'admin' | 'tenant';
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export default function Sidebar({ variant, isOpen, onClose, isMobile }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = variant === 'admin' ? adminNavigation : tenantNavigation

  useEffect(() => {
    const mockUserStr = localStorage.getItem('mock_user');
    if (mockUserStr) {
      setUser(JSON.parse(mockUserStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_remembered_identifier');
    localStorage.removeItem('mock_remembered_password');
    toast.success('Logout realizado com sucesso!')
    navigate('/login')
  }

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const handleNavClick = (item: NavigationItem) => {
    if (item.children) {
      toggleExpand(item.name)
    } else {
      if (isMobile) onClose()
    }
  }

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-72 glass-panel border-r border-white/10",
        "flex flex-col",
        // Mobile: drawer behavior
        isMobile && "shadow-2xl"
      )}
      aria-label="Sidebar de navegação"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <Link 
            to={variant === 'admin' ? '/admin' : '/tenant'} 
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center neon-glow-green flex-shrink-0">
              {variant === 'admin' ? (
                <Shield className="w-6 h-6 text-black" />
              ) : (
                <MessageSquare className="w-6 h-6 text-black" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-text-primary truncate">
                DiixWhatsApp
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">
                {variant === 'admin' ? 'Admin Panel' : 'Painel do Cliente'}
              </p>
            </div>
          </Link>
          
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
            const isExpanded = expandedItems.includes(item.name)
            
            // Item com submenus
            if (item.children) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200",
                      "text-left min-h-[44px]", // Touch target minimum
                      isActive
                        ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 sm:ml-8 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.href
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              onClick={() => isMobile && onClose()}
                              className={cn(
                                "block px-3 sm:px-4 py-2 rounded-lg text-sm transition-all duration-200",
                                "min-h-[44px] flex items-center", // Touch target
                                isChildActive
                                  ? 'bg-accent-primary/10 text-accent-primary'
                                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                              )}
                            >
                              {child.name}
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }
            
            // Item normal sem submenu
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => isMobile && onClose()}
                className={cn(
                  "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200",
                  "min-h-[44px]", // Touch target minimum for accessibility
                  isActive
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.name}</span>
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
        <div className="p-3 sm:p-4 border-t border-white/10">
          <div className="glass-card rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center flex-shrink-0">
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
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center gap-2 min-h-[44px]" // Touch target
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
