import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Building2, Lock, Bell, Upload, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function TenantSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Configurações</h1>
        <p className="text-text-muted">Gerencie as configurações da sua conta</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-2 inline-flex gap-2"
      >
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'profile'
              ? 'bg-accent-primary/10 text-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'password'
              ? 'bg-accent-primary/10 text-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Lock className="w-4 h-4" />
          Senha
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'notifications'
              ? 'bg-accent-primary/10 text-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notificações
        </button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        {activeTab === 'profile' && (
          <form className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center neon-glow-purple">
                <span className="text-3xl font-bold text-white">E</span>
              </div>
              <div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Alterar Logo
                </button>
                <p className="text-xs text-text-muted mt-2">PNG ou JPG, máximo 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  defaultValue="Minha Empresa LTDA"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome Fantasia</label>
                <input
                  type="text"
                  defaultValue="Minha Empresa"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">E-mail</label>
              <input
                type="email"
                defaultValue="contato@minhaempresa.com"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Telefone</label>
              <input
                type="tel"
                defaultValue="(11) 99999-9999"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => toast.success('Perfil atualizado com sucesso!')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm text-text-muted mb-2">Senha Atual</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Nova Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Confirmar Nova Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                placeholder="Repita a nova senha"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => toast.success('Senha alterada com sucesso!')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
              >
                <Lock className="w-5 h-5" />
                Alterar Senha
              </button>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <h3 className="text-text-primary font-medium mb-1">Notificações por E-mail</h3>
                <p className="text-sm text-text-muted">Receba atualizações e alertas por e-mail</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <h3 className="text-text-primary font-medium mb-1">Notificações Push</h3>
                <p className="text-sm text-text-muted">Receba notificações em tempo real</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <h3 className="text-text-primary font-medium mb-1">Relatório Semanal</h3>
                <p className="text-sm text-text-muted">Receba um resumo semanal das suas métricas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
              </label>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => toast.success('Preferências salvas com sucesso!')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
              >
                <Save className="w-5 h-5" />
                Salvar Preferências
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
