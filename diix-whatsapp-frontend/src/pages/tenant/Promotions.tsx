import { useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, Plus, Calendar, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  startDate: string
  endDate: string
  active: boolean
}

// Mock data
const mockPromotions: Promotion[] = [
  { 
    id: '1', 
    title: 'Black Friday', 
    description: 'Desconto especial de Black Friday', 
    discount: 50,
    startDate: '2024-11-25',
    endDate: '2024-11-30',
    active: true
  },
  { 
    id: '2', 
    title: 'Promoção Verão', 
    description: 'Ofertas especiais de verão', 
    discount: 30,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    active: false
  },
]

export default function TenantPromotions() {
  const [showModal, setShowModal] = useState(false)
  const [promotions] = useState<Promotion[]>(mockPromotions)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Promoções</h1>
          <p className="text-text-muted">Crie e gerencie campanhas promocionais</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
        >
          <Plus className="w-5 h-5" />
          Nova Promoção
        </button>
      </motion.div>

      {/* Promotions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {promotions.map((promo) => (
          <motion.div
            key={promo.id}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl p-6 relative overflow-hidden"
          >
            {/* Discount Badge */}
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center neon-glow-purple">
              <span className="text-black font-bold text-lg">-{promo.discount}%</span>
            </div>

            <div className="mb-4 pr-20">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-accent-primary" />
                <span className={`px-2 py-1 rounded-full text-xs ${
                  promo.active
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'bg-error/10 text-error'
                }`}>
                  {promo.active ? 'Ativa' : 'Expirada'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{promo.title}</h3>
              <p className="text-text-secondary text-sm">{promo.description}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(promo.startDate).toLocaleDateString('pt-BR')} até {new Date(promo.endDate).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => toast.info(`Editar ${promo.title}`)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => toast.error(`Excluir ${promo.title}`)}
                className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
            <h2 className="text-2xl font-bold text-text-primary mb-6">Nova Promoção</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Título</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Ex: Black Friday"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Descrição</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 resize-none"
                  placeholder="Descrição da promoção"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Desconto (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Data Início</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Data Fim</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
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
                    toast.success('Promoção criada com sucesso!')
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
