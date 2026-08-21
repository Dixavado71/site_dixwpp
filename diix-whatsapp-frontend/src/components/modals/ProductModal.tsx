import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal/Modal'
import { Form, FormInput, FormSelect } from '@/components/ui/form/Form'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { productCreateSchema, type ProductCreateFormData } from '@/schemas/productSchema'
import { useTenantProductStore } from '@/stores/tenantProductStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Product } from '@/types'

interface ProductModalProps {
  mode: 'create' | 'edit' | 'view'
  product?: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ mode, product, isOpen, onClose }: ProductModalProps) {
  const { create, update } = useTenantProductStore()
  const { categories, fetchCategories } = useCategoryStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductCreateFormData>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      active: true,
    },
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      if (mode === 'edit' || mode === 'view') {
        form.reset({
          name: product?.name || '',
          description: product?.description || '',
          price: product?.price || 0,
          stock: product?.stock || 0,
          categoryId: product?.categoryId || '',
          active: product?.active ?? true,
        })
      } else {
        form.reset({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          categoryId: '',
          active: true,
        })
      }
    }
  }, [isOpen, mode, product, fetchCategories])

  const categoryOptions = categories.map((cat: Category) => ({
    value: cat.id,
    label: cat.name,
  }))

  const statusOptions = [
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' },
  ]

  const onSubmit = async (data: ProductCreateFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await create(data)
        toast.success('Produto criado com sucesso!')
      } else if (mode === 'edit') {
        if (!product?.id) throw new Error('Produto não encontrado')
        await update(product.id, data)
        toast.success('Produto atualizado com sucesso!')
      }
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar produto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isView = mode === 'view'
  const isLoading = mode === 'edit' && !product

  return (
    <Modal
      title={mode === 'create' ? 'Novo Produto' : mode === 'edit' ? 'Editar Produto' : 'Visualizar Produto'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form form={form} onSubmit={onSubmit}>
        <div className="grid gap-4">
          <FormInput
            name="name"
            label="Nome"
            placeholder="Nome do produto"
            disabled={isView || isLoading}
          />

          <Textarea
            name="description"
            label="Descrição"
            placeholder="Descrição do produto"
            disabled={isView || isLoading}
            className="w-full"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="price"
              label="Preço"
              type="number"
              step="0.01"
              placeholder="0.00"
              disabled={isView || isLoading}
            />

            <FormInput
              name="stock"
              label="Estoque"
              type="number"
              placeholder="0"
              disabled={isView || isLoading}
            />
          </div>

          <FormSelect
            name="categoryId"
            label="Categoria"
            options={categoryOptions}
            placeholder="Selecione uma categoria"
            disabled={isView || isLoading}
          />

          <FormSelect
            name="active"
            label="Status"
            options={statusOptions}
            placeholder="Selecione o status"
            disabled={isView || isLoading}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting || isLoading}>
            Cancelar
          </Button>
          {!isView && (
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  )
}
