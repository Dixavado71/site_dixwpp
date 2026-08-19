import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Edit2, Trash2, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface Client {
  id: string
  name: string
  phone: string
  email?: string
  tags: string[]
}

// Mock data
const mockClients: Client[] = [
  { id: '1', name: 'João Silva', phone: '(11) 99999-1111', email: 'joao@email.com', tags: ['VIP', 'Compra Recente'] },
  { id: '2', name: 'Maria Santos', phone: '(11) 99999-2222', email: 'maria@email.com', tags: ['Novo'] },
  { id: '3', name: 'Pedro Oliveira', phone: '(11) 99999-3333', tags: ['Inativo'] },
]

export default function TenantClients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [clients] = useState<Client[]>(mockClients)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Clientes</h1>
          <p className="text-text-muted">Gerencie sua base de clientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
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
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{client.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-text-muted">
                    <Phone className="w-3 h-3" />
                    {client.phone}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => toast.info(`Editar ${client.name}`)}
                  className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toast.error(`Excluir ${client.name}`)}
                  className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {client.email && (
              <div className="flex items-center gap-1 text-sm text-text-muted mb-3">
                <Mail className="w-3 h-3" />
                {client.email}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {client.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Create/Edit Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">Novo Cliente</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome Completo</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Telefone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">E-mail</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="email@cliente.com"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="VIP, Novo, etc."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    toast.success('Cliente criado com sucesso!')
                    setShowModal(false)
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
