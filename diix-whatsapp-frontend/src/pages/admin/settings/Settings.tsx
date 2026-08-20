import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Shield, Bell, Link as LinkIcon, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

type SettingsTab = 'general' | 'security' | 'notifications' | 'integrations' | 'appearance';

const tabs: { id: SettingsTab; name: string; icon: any }[] = [
  { id: 'general', name: 'Geral', icon: SettingsIcon },
  { id: 'security', name: 'Segurança', icon: Shield },
  { id: 'notifications', name: 'Notificações', icon: Bell },
  { id: 'integrations', name: 'Integrações', icon: LinkIcon },
  { id: 'appearance', name: 'Aparência', icon: Palette },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-primary">Configurações</h1>
        <p className="text-text-muted mt-1">Gerencie as configurações do sistema</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'text-text-secondary hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo das Tabs */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nome da Aplicação</label>
                <Input defaultValue="DiixWhatsApp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email de Suporte</label>
                <Input type="email" defaultValue="suporte@diix.com.br" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="maintenance" className="rounded" />
                <label htmlFor="maintenance" className="text-text-secondary">Modo de Manutenção</label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Timeout da Sessão (minutos)</label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="twofactor" className="rounded" />
                <label htmlFor="twofactor" className="text-text-secondary">Exigir Autenticação em Dois Fatores</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Tamanho Mínimo da Senha</label>
                <Input type="number" defaultValue="8" />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Notificações por Email</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Notificações por SMS</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Push Notifications</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Gateway de Pagamento</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary">
                  <option>Stripe</option>
                  <option>Pagar.me</option>
                  <option>Mercado Pago</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">CRM Integration</label>
                <Input placeholder="URL do CRM" />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Tema</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary">
                  <option value="dark">Escuro</option>
                  <option value="light">Claro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Cor Primária</label>
                <Input type="color" defaultValue="#00ff9d" className="w-20" />
              </div>
            </div>
          )}

          <Button onClick={handleSave} variant="primary" className="w-full">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
