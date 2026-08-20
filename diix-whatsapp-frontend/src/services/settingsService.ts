import axios from 'axios';
import type { 
  AdminSettings, UpdateAdminSettingsDTO,
  ApiResponse
} from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const settingsService = {
  // Obter configurações atuais
  async getSettings() {
    const response = await api.get<ApiResponse<AdminSettings>>('/settings');
    return response.data;
  },

  // Atualizar configurações gerais
  async updateGeneral(data: { appName?: string; supportEmail?: string; maintenanceMode?: boolean }) {
    const response = await api.patch<ApiResponse<AdminSettings>>('/settings/general', data);
    return response.data;
  },

  // Atualizar configurações de segurança
  async updateSecurity(data: { sessionTimeout?: number; requireTwoFactor?: boolean; passwordMinLength?: number }) {
    const response = await api.patch<ApiResponse<AdminSettings>>('/settings/security', data);
    return response.data;
  },

  // Atualizar configurações de notificações
  async updateNotifications(data: { emailEnabled?: boolean; smsEnabled?: boolean; pushEnabled?: boolean }) {
    const response = await api.patch<ApiResponse<AdminSettings>>('/settings/notifications', data);
    return response.data;
  },

  // Atualizar configurações de integrações
  async updateIntegrations(data: { paymentGateway?: string; crmIntegration?: string; apiKeys?: Record<string, string> }) {
    const response = await api.patch<ApiResponse<AdminSettings>>('/settings/integrations', data);
    return response.data;
  },

  // Atualizar configurações de aparência
  async updateAppearance(data: { theme?: 'dark' | 'light'; primaryColor?: string; logoUrl?: string }) {
    const response = await api.patch<ApiResponse<AdminSettings>>('/settings/appearance', data);
    return response.data;
  },

  // Atualizar todas as configurações de uma vez
  async updateAll(data: UpdateAdminSettingsDTO) {
    const response = await api.put<ApiResponse<AdminSettings>>('/settings', data);
    return response.data;
  },
};
