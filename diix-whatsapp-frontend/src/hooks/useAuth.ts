import { useState, useEffect, useCallback } from 'react';
import { mockAuth, type User } from '@/lib/auth';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tenantId: string | null;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = mockAuth.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (identifier: string, password: string): Promise<User> => {
    const loggedInUser = await mockAuth.login(identifier, password);
    localStorage.setItem('mock_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await mockAuth.logout();
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    tenantId: user?.role === 'tenant' ? user.id : null,
    login,
    logout,
  };
}
