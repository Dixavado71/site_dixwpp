import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantSchema, type TenantFormData } from '@/schemas/tenantSchema';
import { Form, FormInput, FormSelect, FormNumber } from '@/components/ui/form/Form';
import { Modal } from '@/components/ui/Modal';
import { useTenantsStore } from '@/stores/tenantsStore';
import { toast } from 'sonner';

interface TenantModalProps {
  mode: 'create' | 'edit' | 'view';
  tenant?: any;
  open: boolean;
  onClose: () => void;
}

const planOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
];

export function TenantModal({ mode, tenant, open, onClose }: TenantModalProps) {
  const { createTenant, updateTenant, isLoading } = useTenantsStore();
  
  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: tenant?.name || '',
      email: tenant?.email || '',
      phone: tenant?.phone || '',
      plan: (tenant?.plan as any) || 'basic',
      limits: {
        users: tenant?.limits?.maxUsers || 5,
        products: tenant?.limits?.maxProducts || 100,
        salesPerMonth: tenant?.limits?.maxMessages || 1000,
      },
    },
  });

  const handleSubmit = async (data: TenantFormData) => {
    try {
      if (mode === 'create') {
        await createTenant({
          name: data.name,
          email: data.email,
          phone: data.phone,
          plan: data.plan,
          limits: {
            maxUsers: data.limits.users,
            maxProducts: data.limits.products,
            maxMessages: data.limits.salesPerMonth,
          },
        });
        toast.success('Tenant criado com sucesso!');
      } else {
        await updateTenant(tenant!.id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          plan: data.plan,
          limits: {
            maxUsers: data.limits.users,
            maxProducts: data.limits.products,
            maxMessages: data.limits.salesPerMonth,
          },
        });
        toast.success('Tenant atualizado com sucesso!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar tenant');
    }
  };

  const isView = mode === 'view';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Tenant' : mode === 'edit' ? 'Editar Tenant' : 'Detalhes do Tenant'}
    >
      <Form form={form} onSubmit={handleSubmit} submitButton={null}>
        <div className="space-y-4">
          <FormInput
            form={form}
            name="name"
            label="Nome do Tenant"
            placeholder="Ex: Minha Empresa"
            required
            disabled={isView}
          />
          
          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="contato@empresa.com"
            required
            disabled={isView}
          />
          
          <FormInput
            form={form}
            name="phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            disabled={isView}
          />
          
          <FormSelect
            form={form}
            name="plan"
            label="Plano"
            options={planOptions}
            placeholder="Selecione um plano"
            required
            disabled={isView}
          />
          
          <div className="grid grid-cols-3 gap-4">
            <FormNumber
              form={form}
              name="limits.users"
              label="Limite de Usuários"
              min={1}
              disabled={isView}
            />
            <FormNumber
              form={form}
              name="limits.products"
              label="Limite de Produtos"
              min={1}
              disabled={isView}
            />
            <FormNumber
              form={form}
              name="limits.salesPerMonth"
              label="Vendas/Mês"
              min={1}
              disabled={isView}
            />
          </div>
        </div>
        
        <div className="pt-4 flex gap-3 justify-end">
          {!isView && (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 bg-white/5 text-text-secondary rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isLoading}
                className="px-4 py-2 bg-accent-primary text-text-primary rounded-lg font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
              </button>
            </>
          )}
          {isView && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-accent-primary text-text-primary rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
            >
              Fechar
            </button>
          )}
        </div>
      </Form>
    </Modal>
  );
}
