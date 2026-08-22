import { create } from 'zustand';
import type { AdminSettings, UpdateAdminSettingsDTO } from '@/types';
import { settingsService } from '@/services/settingsService';
import { toast } from 'sonner';

interface SettingsState {
  settings: AdminSettings | null;
  isLoading: boolean;
  error: string | null;
  activeTab: 'general' | 'security' | 'notifications' | 'integrations' | 'appearance';
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateGeneral: (data: { appName?: string; supportEmail?: string; maintenanceMode?: boolean }) => Promise<void>;
  updateSecurity: (data: { sessionTimeout?: number; requireTwoFactor?: boolean; passwordMinLength?: number }) => Promise<void>;
  updateNotifications: (data: { emailEnabled?: boolean; smsEnabled?: boolean; pushEnabled?: boolean }) => Promise<void>;
  updateIntegrations: (data: { paymentGateway?: string; crmIntegration?: string; apiKeys?: Record<string, string> }) => Promise<void>;
  updateAppearance: (data: { theme?: 'dark' | 'light'; primaryColor?: string; logoUrl?: string }) => Promise<void>;
  updateAll: (data: UpdateAdminSettingsDTO) => Promise<void>;
  setActiveTab: (tab: 'general' | 'security' | 'notifications' | 'integrations' | 'appearance') => void;
  clearError: () => void;
}

const defaultSettings: AdminSettings = {
  id: '1',
  general: {
    appName: 'DiixWhatsApp',
    supportEmail: 'suporte@diix.com.br',
    maintenanceMode: false,
  },
  security: {
    sessionTimeout: 30,
    requireTwoFactor: false,
    passwordMinLength: 8,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
  },
  integrations: {
    paymentGateway: 'Stripe',
    crmIntegration: '',
    apiKeys: {},
  },
  appearance: {
    theme: 'dark',
    primaryColor: '#00ff9d',
    logoUrl: undefined,
  },
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,
  activeTab: 'general',

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.getSettings();
      set({ settings: response.data, isLoading: false });
    } catch (error: any) {
      // Se não existir configurações, usa as padrão
      set({ settings: defaultSettings, isLoading: false });
    }
  },

  updateGeneral: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.updateGeneral(data);
      set({ settings: response.data, isLoading: false });
      toast.success('Configurações gerais atualizadas!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar configurações',
        isLoading: false 
      });
      toast.error('Erro ao atualizar configurações gerais');
      throw error;
    }
  },

  updateSecurity: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.updateSecurity(data);
      set({ settings: response.data, isLoading: false });
      toast.success('Configurações de segurança atualizadas!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar configurações',
        isLoading: false 
      });
      toast.error('Erro ao atualizar configurações de segurança');
      throw error;
    }
  },

  updateNotifications: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.updateNotifications(data);
      set({ settings: response.data, isLoading: false });
      toast.success('Configurações de notificações atualizadas!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar configurações',
        isLoading: false 
      });
      toast.error('Erro ao atualizar configurações de notificações');
      throw error;
    }
  },

  updateIntegrations: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.updateIntegrations(data);
      set({ settings: response.data, isLoading: false });
      toast.success('Configurações de integrações atualizadas!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar configurações',
        isLoading: false 
      });
      toast.error('Erro ao atualizar configurações de integrações');
      throw error;
    }
  },

  updateAppearance: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.updateAppearance(data);
      set({ settings: response.data, isLoading: false });
      toast.success('Configurações de aparência atualizadas!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar configurações',
        isLoading: false 
      });
      toast.error('Erro ao atualizar configurações de aparência');
      throw error;
    }
  },

  updateAll: async (data: UpdateAdminSettingsDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await settingsService.updateAll(data);
      set({ settings: response.data, isLoading: false });
      toast.success('Todas as configurações atualizadas!');
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erro ao atualizar configurações',
        isLoading: false 
      });
      toast.error('Erro ao atualizar configurações');
      throw error;
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  clearError: () => set({ error: null }),
}));
