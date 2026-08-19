import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Search, MoreVertical, Edit2, Trash2, Lock, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Tenant {
  id: string
  name: string
  company: string
  plan: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Mock data - will be replaced with API data
const mockTenants: Tenant[] = [
  { id: '1', name: 'Tech Solutions', company: 'Tech Solutions LTDA', plan: 'Profissional', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Store Max', company: 'Store Max Comercio', plan: 'Empresarial', status: 'active', createdAt: '2024-01-10' },
  { id: '3', name: 'Health Care', company: 'Health Care Clinica', plan: 'Basico', status: 'inactive', createdAt: '2024-01-05' },
]

export default function AdminTenants() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [tenants] = useState<Tenant[]>(mockTenants)

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Tenants</h1>
          <p className="text-text-muted">Gerencie todos os tenants do sistema</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
        >
          <Plus className="w-5 h-5" />
          Novo Tenant
        </button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por nome ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Tenants Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-6 text-text-muted font-medium">Nome</th>
                <th className="text-left py-4 px-6 text-text-muted font-medium">Empresa</th>
                <th className="text-left py-4 px-6 text-text-muted font-medium">Plano</th>
                <th className="text-left py-4 px-6 text-text-muted font-medium">Status</th>
                <th className="text-left py-4 px-6 text-text-muted font-medium">Data Criação</th>
                <th className="text-right py-4 px-6 text-text-muted font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-black" />
                      </div>
                      <span className="text-text-primary font-medium">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-secondary">{tenant.company}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs bg-accent-secondary/10 text-accent-secondary">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                      tenant.status === 'active'
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'bg-error/10 text-error'
                    }`}>
                      {tenant.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {tenant.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-text-muted">
                    {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toast.info(`Editar ${tenant.name}`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.info(`Resetar senha de ${tenant.name}`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-accent-primary transition-colors"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.info(`${tenant.status === 'active' ? 'Bloquear' : 'Desbloquear'} ${tenant.name}`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-accent-secondary transition-colors"
                      >
                        {tenant.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toast.error(`Excluir ${tenant.name}`)}
                        className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">Novo Tenant</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome do tenant"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Empresa</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">E-mail</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="email@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Plano</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50">
                  <option value="basic">Básico</option>
                  <option value="professional">Profissional</option>
                  <option value="enterprise">Empresarial</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    toast.success('Tenant criado com sucesso!')
                    setShowCreateModal(false)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  Criar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
