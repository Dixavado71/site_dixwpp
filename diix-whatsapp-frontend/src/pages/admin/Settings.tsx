import { useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Plug, Palette, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { mockAdminSettings } from '@/lib/mockData';
import type { AdminSettings } from '@/types';

type TabType = 'general' | 'security' | 'notifications' | 'integrations' | 'appearance';

const tabs: { id: TabType; name: string; icon: React.ElementType }[] = [
  { id: 'general', name: 'Geral', icon: Settings },
  { id: 'security', name: 'Segurança', icon: Shield },
  { id: 'notifications', name: 'Notificações', icon: Bell },
  { id: 'integrations', name: 'Integrações', icon: Plug },
  { id: 'appearance', name: 'Aparência', icon: Palette },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [settings, setSettings] = useState<AdminSettings>(mockAdminSettings);

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Nome do Site</label>
              <Input
                value={settings.general.siteName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email de Suporte</label>
              <Input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Máximo de Tenants</label>
              <Input
                type="number"
                value={settings.general.maxTenants}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, general: { ...settings.general, maxTenants: parseInt(e.target.value) } })}
              />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-text-primary font-medium">Autenticação em Dois Fatores</h4>
                <p className="text-sm text-text-muted">Exigir 2FA para todos os usuários</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.requireTwoFactor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, security: { ...settings.security, requireTwoFactor: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:bg-accent-primary"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Timeout da Sessão (minutos)</label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: parseInt(e.target.value) } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Tamanho Mínimo da Senha</label>
              <Input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, security: { ...settings.security, passwordMinLength: parseInt(e.target.value) } })}
              />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { key: 'emailEnabled' as const, label: 'Emails', desc: 'Enviar notificações por email' },
              { key: 'smsEnabled' as const, label: 'SMS', desc: 'Enviar notificações por SMS' },
              { key: 'pushEnabled' as const, label: 'Push', desc: 'Enviar notificações push' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <h4 className="text-text-primary font-medium">{item.label}</h4>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications[item.key]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ 
                      ...settings, 
                      notifications: { ...settings.notifications, [item.key]: e.target.checked } 
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:bg-accent-primary"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-4">
            {[
              { key: 'stripeEnabled' as const, label: 'Stripe', desc: 'Processamento de pagamentos' },
              { key: 'paypalEnabled' as const, label: 'PayPal', desc: 'Pagamentos via PayPal' },
              { key: 'whatsappEnabled' as const, label: 'WhatsApp API', desc: 'Integração com WhatsApp' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <h4 className="text-text-primary font-medium">{item.label}</h4>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.integrations[item.key]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ 
                      ...settings, 
                      integrations: { ...settings.integrations, [item.key]: e.target.checked } 
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:bg-accent-primary"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Tema</label>
              <select
                value={settings.appearance.theme}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSettings({ ...settings, appearance: { ...settings.appearance, theme: e.target.value as 'light' | 'dark' | 'system' } })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Cor Primária</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, appearance: { ...settings.appearance, primaryColor: e.target.value } })}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <Input
                  value={settings.appearance.primaryColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, appearance: { ...settings.appearance, primaryColor: e.target.value } })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Configurações</h1>
          <p className="text-text-muted mt-1">Gerencie as configurações do sistema</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Navigation */}
        <Card className="lg:col-span-1 h-fit glass-card border-white/10">
          <CardContent className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Tab Content */}
        <Card className="lg:col-span-3 glass-card border-white/10">
          <CardHeader>
            <CardTitle>{tabs.find(t => t.id === activeTab)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderTabContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
