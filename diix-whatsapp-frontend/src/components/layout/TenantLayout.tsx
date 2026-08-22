import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  Briefcase,
  Percent,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  ShoppingCart,
  FileText,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import Header from './Header'
import { Footer } from './Footer'
import { UserMenu } from './UserMenu'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Backdrop } from '@/components/ui/Backdrop'
import { useResponsiveSidebar } from '@/hooks/useResponsive'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar/Avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
  const { isOpen: sidebarOpen, toggle: toggleSidebar, close: closeSidebar, isDesktop } = useResponsiveSidebar()
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
    <LayoutGroup>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Aurora Background Animation */}
        <div className="fixed inset-0 bg-aurora-gradient -z-20" />
        <div className="fixed inset-0 bg-noise-overlay opacity-[0.03] -z-10 pointer-events-none" />
        
        {/* Glow Effects */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent-primary/20 rounded-full blur-[128px] -z-10" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-[128px] -z-10" />

        {/* Backdrop para mobile */}
        {!isDesktop && sidebarOpen && (
          <Backdrop isOpen={sidebarOpen} onClose={closeSidebar} zIndex={39} />
        )}

        {/* Sidebar Premium */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 0.8 }}
          className={cn(
            "fixed left-0 top-0 z-40 h-screen w-72",
            "glass-panel-premium border-r border-white/[0.08]",
            "backdrop-blur-[24px] saturate-[180%]",
            isDesktop ? "block" : "shadow-2xl shadow-black/40"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-6 border-b border-white/[0.06] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/[0.08] to-transparent" />
              <Link to="/tenant" className="flex items-center gap-3 relative z-10">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary via-accent-primary to-accent-cyan flex items-center justify-center relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <MessageSquare className="w-6 h-6 text-black relative z-10" />
                  <div className="absolute inset-0 neon-glow-green opacity-50" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-text-primary tracking-tight">DiixWhatsApp</h1>
                    <Sparkles className="w-3.5 h-3.5 text-accent-primary opacity-60" />
                  </div>
                  <p className="text-xs text-text-muted font-medium mt-0.5">Painel do Cliente</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.children && item.children.some(child => location.pathname === child.href))
                
                if (item.children) {
                  return (
                    <Accordion 
                      key={item.name} 
                      type="single" 
                      collapsible
                      value={expandedMenus.includes(item.name) ? item.name : undefined}
                      onValueChange={(value) => toggleMenu(item.name)}
                      className="group"
                    >
                      <AccordionItem 
                        value={item.name} 
                        className={cn(
                          "border-0 mb-1 rounded-lg transition-all duration-200",
                          isActive && "bg-accent-primary/[0.08]"
                        )}
                      >
                        <AccordionTrigger
                          className={cn(
                            "px-4 py-3 hover:no-underline",
                            "data-[state=open]:rounded-b-none",
                            isActive 
                              ? "text-accent-primary" 
                              : "text-text-secondary hover:text-text-primary"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={cn(
                              "w-5 h-5 transition-colors duration-200",
                              isActive ? "text-accent-primary" : "text-text-muted group-hover:text-text-secondary"
                            )} />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-2 pt-1">
                          <div className="ml-8 space-y-0.5 border-l border-white/[0.06] pl-3">
                            {item.children.map((child) => {
                              const isChildActive = location.pathname === child.href
                              return (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className={cn(
                                    "block px-3 py-2 rounded-md text-sm transition-all duration-200",
                                    "relative overflow-hidden group",
                                    isChildActive
                                      ? "text-accent-primary bg-accent-primary/[0.08]"
                                      : "text-text-muted hover:text-text-primary hover:bg-white/[0.04]"
                                  )}
                                >
                                  {isChildActive && (
                                    <motion.div
                                      layoutId="activeNav"
                                      className="absolute inset-0 bg-accent-primary/[0.08] rounded-md -z-10"
                                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    />
                                  )}
                                  <span className="relative z-10">{child.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                }
                
                // Item normal sem submenu
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden group",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent-primary/[0.08] before:to-transparent before:opacity-0 before:transition-opacity",
                      isActive
                        ? "bg-accent-primary/[0.08] text-accent-primary before:opacity-100"
                        : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive ? "text-accent-primary" : "text-text-muted group-hover:text-text-secondary"
                    )} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-accent-primary to-accent-cyan rounded-r-full shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-white/[0.06]">
              <motion.div 
                className="glass-card-premium rounded-xl p-4 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/[0.05] to-transparent" />
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <Avatar
                    src={undefined}
                    alt={user?.email || 'User'}
                    fallback={user?.email?.charAt(0).toUpperCase() || 'U'}
                    size="md"
                    className="ring-2 ring-white/[0.1]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-text-muted capitalize font-medium">{user?.role}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center gap-2 relative overflow-hidden group"
                >
                  <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Sair</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            sidebarOpen ? "ml-72" : "ml-0"
          )}
        >
          {/* Topbar */}
          <Header 
            onMenuClick={toggleSidebar}
            isSidebarOpen={sidebarOpen}
            title="Painel do Cliente"
            user={user}
            onLogout={handleLogout}
          />

          {/* Page Content */}
          <main className="flex flex-col min-h-screen p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
            <Footer className="mt-auto" />
          </main>
        </div>
      </div>
    </LayoutGroup>
  )
}
