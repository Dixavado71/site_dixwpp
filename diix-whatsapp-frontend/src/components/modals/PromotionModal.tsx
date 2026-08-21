import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal/Modal'
import { Form, FormInput, FormSelect } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { promotionCreateSchema, PromotionCreateFormData } from '@/schemas/promotionSchema'
import { useTenantPromotionStore } from '@/stores/tenantPromotionStore'
import { useTenantProductStore } from '@/stores/tenantProductStore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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
          name: promotion?.name || '',
          type: promotion?.type || 'percentage',
          value: promotion?.value || 0,
          productIds: promotion?.productIds || [],
          startDate: promotion?.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
          endDate: promotion?.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
          status: promotion?.status || 'active',
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

  const productOptions = products.map((prod) => ({
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
      if (mode === 'create') {
        await create(data)
        toast.success('Promoção criada com sucesso!')
      } else if (mode === 'edit') {
        if (!promotion?.id) throw new Error('Promoção não encontrada')
        await update(promotion.id, data)
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
            name="name"
            label="Nome"
            placeholder="Nome da promoção"
            disabled={isView || isLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="type"
              label="Tipo"
              options={typeOptions}
              placeholder="Selecione o tipo"
              disabled={isView || isLoading}
            />

            <FormInput
              name="value"
              label={watchType === 'percentage' ? 'Porcentagem (%)' : 'Valor (R$)'}
              type="number"
              step="0.01"
              placeholder="0.00"
              disabled={isView || isLoading}
            />
          </div>

          <FormSelect
            name="productIds"
            label="Produtos Aplicáveis"
            options={productOptions}
            placeholder="Selecione os produtos"
            disabled={isView || isLoading}
            multiple
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="startDate"
              label="Data de Início"
              type="date"
              disabled={isView || isLoading}
            />

            <FormInput
              name="endDate"
              label="Data de Fim"
              type="date"
              disabled={isView || isLoading}
            />
          </div>

          <FormSelect
            name="status"
            label="Status"
            options={statusOptions}
            placeholder="Selecione o status"
            disabled={isView || isLoading}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          {!isView && (
            <Button type="submit" loading={isSubmitting}>
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  )
}
