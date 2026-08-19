import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Plus, Clock, DollarSign, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  duration: number // in minutes
  price: number
  description: string
}

// Mock data
const mockServices: Service[] = [
  { id: '1', name: 'Consultoria Técnica', duration: 60, price: 150.00, description: 'Consultoria especializada' },
  { id: '2', name: 'Implementação', duration: 120, price: 300.00, description: 'Implementação completa do sistema' },
  { id: '3', name: 'Suporte Premium', duration: 30, price: 80.00, description: 'Suporte técnico prioritário' },
]

export default function TenantServices() {
  const [showModal, setShowModal] = useState(false)
  const [services] = useState<Service[]>(mockServices)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Serviços</h1>
          <p className="text-text-muted">Gerencie seus serviços prestados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </motion.div>

      {/* Services List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center neon-glow-purple">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-1">{service.name}</h3>
                  <p className="text-text-secondary text-sm mb-2">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration} minutos
                    </div>
                    <div className="flex items-center gap-1 text-accent-primary font-bold">
                      <DollarSign className="w-4 h-4" />
                      {service.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.info(`Editar ${service.name}`)}
                  className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toast.error(`Excluir ${service.name}`)}
                  className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Modal */}
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
            <h2 className="text-2xl font-bold text-text-primary mb-6">Novo Serviço</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome do Serviço</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome do serviço"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Descrição</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 resize-none"
                  placeholder="Descrição do serviço"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Duração (minutos)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                    placeholder="0.00"
                  />
                </div>
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
                    toast.success('Serviço criado com sucesso!')
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
