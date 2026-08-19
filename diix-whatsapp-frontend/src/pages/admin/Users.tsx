import { motion } from 'framer-motion'
import { Users, Search, Edit2, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  role: 'admin' | 'tenant'
  tenantName?: string
  createdAt: string
}

// Mock data
const mockUsers: User[] = [
  { id: '1', email: 'admin@diix.com', role: 'admin', createdAt: '2024-01-01' },
  { id: '2', email: 'tenant1@empresa.com', role: 'tenant', tenantName: 'Tech Solutions', createdAt: '2024-01-15' },
  { id: '3', email: 'tenant2@loja.com', role: 'tenant', tenantName: 'Store Max', createdAt: '2024-01-10' },
]

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Usuários</h1>
        <p className="text-text-muted">Gerencie todos os usuários do sistema</p>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-6 text-text-muted font-medium">Usuário</th>
                <th className="text-left py-4 px-6 text-text-muted font-medium">Role</th>
                <th className="text-left py-4 px-6 text-text-muted font-medium">Tenant</th>
                <th className="text-left py-4 px-6 text-text-muted font-medium">Data Criação</th>
                <th className="text-right py-4 px-6 text-text-muted font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-text-primary font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === 'admin'
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'bg-accent-secondary/10 text-accent-secondary'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Tenant'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-text-secondary">
                    {user.tenantName || '-'}
                  </td>
                  <td className="py-4 px-6 text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toast.info(`Ver detalhes de ${user.email}`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.info(`Editar ${user.email}`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.error(`Excluir ${user.email}`)}
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
    </div>
  )
}
