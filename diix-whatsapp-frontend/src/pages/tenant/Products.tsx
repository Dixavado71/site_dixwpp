import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus, Search, Edit2, Trash2, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image?: string
}

// Mock data
const mockProducts: Product[] = [
  { id: '1', name: 'Consultoria Premium', price: 299.90, description: 'Sessão de consultoria de 1 hora' },
  { id: '2', name: 'Pacote Mensal', price: 999.90, description: 'Acesso completo por 30 dias' },
  { id: '3', name: 'Treinamento', price: 499.90, description: 'Treinamento completo da equipe' },
]

export default function TenantProducts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [products] = useState<Product[]>(mockProducts)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestão de Produtos</h1>
          <p className="text-text-muted">Gerencie seus produtos e catálogo</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
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
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center neon-glow-green">
                <Package className="w-8 h-8 text-black" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => toast.info(`Editar ${product.name}`)}
                  className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toast.error(`Excluir ${product.name}`)}
                  className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-text-primary mb-2">{product.name}</h3>
            <p className="text-text-secondary text-sm mb-4">{product.description}</p>
            
            <div className="flex items-center gap-2 text-accent-primary font-bold text-2xl">
              <DollarSign className="w-6 h-6" />
              {product.price.toFixed(2).replace('.', ',')}
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
            <h2 className="text-2xl font-bold text-text-primary mb-6">Novo Produto</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome do Produto</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Descrição</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 resize-none"
                  placeholder="Descrição do produto"
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
                    toast.success('Produto criado com sucesso!')
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
