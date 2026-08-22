import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ChevronDown, Shield, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  align?: 'left' | 'right';
  user?: UserType | null;
  onLogout?: () => void;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tenant';
  avatar?: string;
}

export function UserMenu({ align = 'right', user, onLogout }: UserMenuProps) {
  const { user: authUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Usa o user passado como prop ou o do auth
    const effectiveUser = user || (authUser as UserType);
    if (effectiveUser) {
      setCurrentUser(effectiveUser);
    }
  }, [user, authUser]);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
    }
    setIsOpen(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'tenant':
        return 'Tenant';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'tenant':
        return <Building className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  if (!currentUser) {
    return (
      <Button variant="ghost" size="sm" className="min-h-[44px] px-3">
        <User className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "min-h-[44px] px-2 sm:px-3 gap-2",
          isOpen && "bg-white/10"
        )}
        aria-label="Menu do usuário"
        aria-expanded={isOpen}
      >
        <Avatar
          src={currentUser.avatar}
          alt={currentUser.name}
          fallback={currentUser.name.charAt(0).toUpperCase()}
          size="sm"
        />
        <span className="hidden md:inline text-sm font-medium text-text-primary">
          {currentUser.name}
        </span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-text-muted transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute z-50 mt-2 w-64 glass-panel rounded-xl border border-white/10 p-3 shadow-2xl",
                align === 'right' ? "right-0" : "left-0"
              )}
            >
              {/* User Info Header */}
              <div className="pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    fallback={currentUser.name.charAt(0).toUpperCase()}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                
                {/* Role Badge */}
                <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-medium w-fit">
                  {getRoleIcon(currentUser.role)}
                  <span>{getRoleLabel(currentUser.role)}</span>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    // Navigate to profile
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>Meu Perfil</span>
                </button>

                <button
                  onClick={() => {
                    // Navigate to settings based on role
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      // Navigate to admin panel
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors duration-200"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Painel Admin</span>
                  </button>
                )}
              </nav>

              {/* Divider */}
              <div className="my-3 border-t border-white/10" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>

              {/* Keyboard Shortcut Hint */}
              <div className="mt-3 pt-3 border-t border-white/10 text-center">
                <p className="text-xs text-text-muted">
                  Atalho: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-text-secondary">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-text-secondary">L</kbd>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;
