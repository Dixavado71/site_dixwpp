import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal/Modal'
import { Form, FormInput, FormSelect } from '@/components/ui/form/Form'
import { Button } from '@/components/ui/Button'
import { Button as UIButton } from '@/components/ui/Button'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import * as z from 'zod'

const serviceSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  duration: z.number().min(1, 'Duração deve ser pelo menos 1 minuto'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().optional(),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceModalProps {
  mode: 'create' | 'edit' | 'view'
  service?: any
  isOpen: boolean
  onClose: () => void
  onSave?: (data: ServiceFormData) => void
}

const categories = [
  { value: 'Cabelo', label: 'Cabelo' },
  { value: 'Barba', label: 'Barba' },
  { value: 'Combo', label: 'Combo' },
  { value: 'Tratamento', label: 'Tratamento' },
  { value: 'Unhas', label: 'Unhas' },
  { value: 'Maquiagem', label: 'Maquiagem' },
  { value: 'Massagem', label: 'Massagem' },
  { value: 'Outros', label: 'Outros' },
]

export function ServiceModal({ mode, service, isOpen, onClose, onSave }: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      price: 0,
      duration: 30,
      category: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'view') {
        form.reset({
          name: service?.name || '',
          price: service?.price || 0,
          duration: service?.duration || 30,
          category: service?.category || '',
          description: service?.description || '',
        })
      } else {
        form.reset({
          name: '',
          price: 0,
          duration: 30,
          category: '',
          description: '',
        })
      }
    }
  }, [isOpen, mode, service, form])

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true)
    try {
      if (onSave) {
        await onSave(data)
      }
      if (mode === 'create') {
        toast.success('Serviço criado com sucesso!')
      } else if (mode === 'edit') {
        toast.success('Serviço atualizado com sucesso!')
      }
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar serviço')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isView = mode === 'view'

  return (
    <Modal
      title={mode === 'create' ? 'Novo Serviço' : mode === 'edit' ? 'Editar Serviço' : 'Visualizar Serviço'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form form={form} onSubmit={onSubmit}>
        <div className="grid gap-4">
          <FormInput
            form={form}
            name="name"
            label="Nome do Serviço"
            placeholder="Ex: Corte de Cabelo"
            disabled={isView}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              form={form}
              name="price"
              label="Preço (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              disabled={isView}
              onChange={(e) => form.setValue('price', parseFloat(e.target.value) || 0)}
            />

            <FormInput
              form={form}
              name="duration"
              label="Duração (minutos)"
              type="number"
              placeholder="30"
              disabled={isView}
              onChange={(e) => form.setValue('duration', parseInt(e.target.value) || 0)}
            />
          </div>

          <FormSelect
            form={form}
            name="category"
            label="Categoria"
            options={categories}
            placeholder="Selecione uma categoria"
            disabled={isView}
          />

          <FormInput
            form={form}
            name="description"
            label="Descrição (opcional)"
            placeholder="Descreva o serviço..."
            disabled={isView}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          {!isView && (
            <Button type="submit" isLoading={isSubmitting}>
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  )
}
