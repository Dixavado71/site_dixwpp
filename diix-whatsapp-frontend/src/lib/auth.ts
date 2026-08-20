// Mock de autenticação para demonstração
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'tenant';
  name: string;
}

export const mockAuth = {
  login: async (identifier: string, password: string): Promise<User> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Aceita qualquer login para demonstração
    return {
      id: 'mock-user-1',
      username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      email: identifier.includes('@') ? identifier : `${identifier}@demo.com`,
      role: identifier.toLowerCase() === 'admin' ? 'admin' : 'tenant',
      name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
    };
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('mock_user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('mock_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('mock_user') !== null;
  },
};
