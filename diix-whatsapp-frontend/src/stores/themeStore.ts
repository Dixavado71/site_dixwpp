import { create } from 'zustand';

type Theme = 'cyberpunk' | 'light' | 'corporate' | 'minimal' | 'neon';
type Mode = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'cyberpunk',
  mode: 'dark',

  initializeTheme: () => {
    // Load from localStorage or default
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedMode = localStorage.getItem('mode') as Mode | null;
    
    if (savedTheme) {
      get().setTheme(savedTheme);
    }
    
    if (savedMode) {
      get().setMode(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!savedMode && !prefersDark) {
        get().setMode('light');
      }
    }
  },

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  setMode: (mode) => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
    set({ mode });
  },

  toggleMode: () => {
    const newMode = get().mode === 'dark' ? 'light' : 'dark';
    get().setMode(newMode);
  },
}));

// Initialize theme on load
if (typeof window !== 'undefined') {
  useThemeStore.getState().initializeTheme();
}
