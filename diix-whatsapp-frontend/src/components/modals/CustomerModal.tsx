import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal/Modal'
import { Form, FormInput } from '@/components/ui/form/Form'
import { Button } from '@/components/ui/Button'
import type { CustomerCreateFormData } from '@/schemas/customerSchema'
import { customerCreateSchema } from '@/schemas/customerSchema'
import { useTenantCustomerStore } from '@/stores/tenantCustomerStore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Client } from '@/types'

interface CustomerModalProps {
  mode: 'create' | 'edit' | 'view'
  client?: Client
  isOpen: boolean
  onClose: () => void
}

export function CustomerModal({ mode, client, isOpen, onClose }: CustomerModalProps) {
  const { create, update } = useTenantCustomerStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CustomerCreateFormData>({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      document: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'view') {
        form.reset({
          name: client?.name || '',
          email: client?.email || '',
          phone: client?.phone || '',
          document: client?.document || '',
        })
      } else {
        form.reset({
          name: '',
          email: '',
          phone: '',
          document: '',
        })
      }
    }
  }, [isOpen, mode, client, form])

  const onSubmit = async (data: CustomerCreateFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await create(data)
        toast.success('Cliente criado com sucesso!')
      } else if (mode === 'edit') {
        if (!client?.id) throw new Error('Cliente não encontrado')
        await update(client.id, data)
        toast.success('Cliente atualizado com sucesso!')
      }
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar cliente')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isView = mode === 'view'
  const isLoading = mode === 'edit' && !client

  return (
    <Modal
      title={mode === 'create' ? 'Novo Cliente' : mode === 'edit' ? 'Editar Cliente' : 'Visualizar Cliente'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form form={form} onSubmit={onSubmit}>
        <div className="grid gap-4">
          <FormInput
            form={form}
            name="name"
            label="Nome"
            placeholder="Nome completo"
            disabled={isView || isLoading}
          />

          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="email@exemplo.com"
            disabled={isView || isLoading}
          />

          <FormInput
            form={form}
            name="phone"
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            disabled={isView || isLoading}
          />

          <FormInput
            form={form}
            name="document"
            label="CPF/CNPJ"
            placeholder="000.000.000-00"
            disabled={isView || isLoading}
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
