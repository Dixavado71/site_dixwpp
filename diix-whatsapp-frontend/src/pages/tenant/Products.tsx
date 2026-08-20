import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus, Search, Edit2, Trash2, DollarSign, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantService } from '@/services'
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  slug: z.string().optional(),
  stock: z.number().min(0).optional(),
  active: z.boolean(),
})

type ProductForm = z.infer<typeof productSchema>

export default function TenantProducts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  })

  // Fetch products from API
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await tenantService.getProducts()
      return response
    },
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateProductDTO) => {
      const response = await tenantService.createProduct(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produto criado com sucesso!')
      setShowModal(false)
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar produto')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductDTO }) => {
      const response = await tenantService.updateProduct(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produto atualizado com sucesso!')
      setShowModal(false)
      setEditingId(null)
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar produto')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await tenantService.deleteProduct(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produto excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir produto')
    },
  })

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setValue('name', product.name)
    setValue('description', product.description || '')
    setValue('price', product.price)
    setValue('slug', product.slug || '')
    setValue('stock', product.stock || 0)
    setValue('active', product.active ?? true)
    setShowModal(true)
  }

  const onSubmit = (data: ProductForm) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
    }
  }

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
          onClick={() => {
            setEditingId(null)
            reset()
            setShowModal(true)
          }}
          disabled={createMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-glow-green disabled:opacity-50"
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
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-muted">
            Nenhum produto encontrado
          </div>
        ) : (
          filteredProducts?.map((product) => (
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
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(product.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-text-primary mb-2">{product.name}</h3>
              <p className="text-text-secondary text-sm mb-4">{product.description || 'Sem descrição'}</p>
              
              <div className="flex items-center gap-2 text-accent-primary font-bold text-2xl">
                <DollarSign className="w-6 h-6" />
                {product.price.toFixed(2).replace('.', ',')}
              </div>
              
              {product.stock !== undefined && (
                <p className="text-sm text-text-muted mt-2">Estoque: {product.stock}</p>
              )}
            </motion.div>
          ))
        )}
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
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Nome do Produto</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="Nome do produto"
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Descrição</label>
                <textarea
                  rows={3}
                  {...register('description')}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 resize-none"
                  placeholder="Descrição do produto"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-error text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Slug (opcional)</label>
                  <input
                    type="text"
                    {...register('slug')}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                    placeholder="produto-slug"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Estoque</label>
                  <input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
                    placeholder="0"
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
