import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal/Modal'
import { Form, FormInput, FormSelect } from '@/components/ui/form/Form'
import { Button } from '@/components/ui/Button'
import { promotionCreateSchema, type PromotionCreateFormData } from '@/schemas/promotionSchema'
import { useTenantPromotionStore } from '@/stores/tenantPromotionStore'
import { useTenantProductStore } from '@/stores/tenantProductStore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Promotion, Product } from '@/types'

interface PromotionModalProps {
  mode: 'create' | 'edit' | 'view'
  promotion?: Promotion
  isOpen: boolean
  onClose: () => void
}

export function PromotionModal({ mode, promotion, isOpen, onClose }: PromotionModalProps) {
  const { create, update } = useTenantPromotionStore()
  const { products } = useTenantProductStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PromotionCreateFormData>({
    resolver: zodResolver(promotionCreateSchema),
    defaultValues: {
      name: '',
      type: 'percentage',
      value: 0,
      productIds: [],
      startDate: '',
      endDate: '',
      status: 'active',
    },
  })

  const watchType = form.watch('type')

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'view') {
        form.reset({
          name: promotion?.title || '',
          type: 'percentage',
          value: promotion?.discount || 0,
          productIds: [],
          startDate: promotion?.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
          endDate: promotion?.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
          status: promotion?.active ? 'active' : 'inactive',
        })
      } else {
        form.reset({
          name: '',
          type: 'percentage',
          value: 0,
          productIds: [],
          startDate: '',
          endDate: '',
          status: 'active',
        })
      }
    }
  }, [isOpen, mode, promotion])

  const productOptions = products.map((prod: Product) => ({
    value: prod.id,
    label: prod.name,
  }))

  const typeOptions = [
    { value: 'percentage', label: 'Percentual (%)' },
    { value: 'fixed', label: 'Valor Fixo (R$)' },
  ]

  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
  ]

  const onSubmit = async (data: PromotionCreateFormData) => {
    setIsSubmitting(true)
    try {
      const createData = {
        title: data.name,
        discount: data.value,
        startDate: data.startDate,
        endDate: data.endDate || '',
        active: data.status === 'active',
        description: data.description,
      }
      
      if (mode === 'create') {
        await create(createData)
        toast.success('Promoção criada com sucesso!')
      } else if (mode === 'edit') {
        if (!promotion?.id) throw new Error('Promoção não encontrada')
        await update(promotion.id, createData)
        toast.success('Promoção atualizada com sucesso!')
      }
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar promoção')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isView = mode === 'view'
  const isLoading = mode === 'edit' && !promotion

  return (
    <Modal
      title={mode === 'create' ? 'Nova Promoção' : mode === 'edit' ? 'Editar Promoção' : 'Visualizar Promoção'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form form={form} onSubmit={onSubmit}>
        <div className="grid gap-4">
          <FormInput
            form={form}
            name="name"
            label="Nome"
            placeholder="Nome da promoção"
            disabled={isView || isLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              form={form}
              name="type"
              label="Tipo"
              options={typeOptions}
              placeholder="Selecione o tipo"
              disabled={isView || isLoading}
            />

            <FormInput
              form={form}
              name="value"
              label={watchType === 'percentage' ? 'Porcentagem (%)' : 'Valor (R$)'}
              type="number"
              placeholder="0.00"
              disabled={isView || isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Produtos Aplicáveis
            </label>
            <Controller
              name="productIds"
              control={form.control}
              render={({ field }) => (
                <select
                  {...field}
                  multiple
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  disabled={isView || isLoading}
                >
                  {productOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              form={form}
              name="startDate"
              label="Data de Início"
              type="date"
              disabled={isView || isLoading}
            />

            <FormInput
              form={form}
              name="endDate"
              label="Data de Fim"
              type="date"
              disabled={isView || isLoading}
            />
          </div>

          <FormSelect
            form={form}
            name="status"
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
