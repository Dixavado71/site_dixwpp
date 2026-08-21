import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantCreateSchema, type TenantCreateFormData } from '@/schemas/tenantSchema';
import { Form, FormInput, FormSelect } from '@/components/ui/form/Form';
import { Modal } from '@/components/ui/modal/Modal';
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
  
  const form = useForm<TenantCreateFormData>({
    resolver: zodResolver(tenantCreateSchema),
    defaultValues: {
      name: tenant?.name || '',
      businessName: tenant?.businessName || '',
      document: tenant?.document || '',
      email: tenant?.email || '',
      phone: tenant?.phone || '',
      slug: tenant?.slug || '',
      password: '',
      active: tenant?.active ?? true,
      plan: (tenant?.plan as any) || 'standard',
      limits: tenant?.limits || {
        maxUsers: 15,
        maxClients: 500,
        maxProducts: 1000,
        maxMessages: 10000,
      },
    },
  });

  const handleSubmit = async (data: TenantCreateFormData) => {
    try {
      if (mode === 'create') {
        await createTenant({
          name: data.name,
          businessName: data.businessName,
          document: data.document,
          email: data.email,
          phone: data.phone,
          slug: data.slug,
          password: data.password,
          active: data.active,
          plan: data.plan,
          limits: data.limits,
        });
        toast.success('Tenant criado com sucesso!');
      } else {
        await updateTenant(tenant!.id, {
          name: data.name,
          businessName: data.businessName,
          document: data.document,
          email: data.email,
          phone: data.phone,
          slug: data.slug,
          active: data.active,
          plan: data.plan,
          limits: data.limits,
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
      isOpen={open}
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
            name="businessName"
            label="Razão Social"
            placeholder="Ex: Minha Empresa LTDA"
            disabled={isView}
          />
          
          <FormInput
            form={form}
            name="document"
            label="CPF/CNPJ"
            placeholder="000.000.000-00"
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
          
          <FormInput
            form={form}
            name="slug"
            label="Slug (URL)"
            placeholder="minha-empresa"
            disabled={isView}
          />
          
          {mode === 'create' && (
            <FormInput
              form={form}
              name="password"
              label="Senha"
              type="password"
              placeholder="******"
              required={mode === 'create'}
              disabled={isView}
            />
          )}
          
          <FormSelect
            form={form}
            name="plan"
            label="Plano"
            options={planOptions}
            placeholder="Selecione um plano"
            required
            disabled={isView}
          />
          
          <FormSelect
            form={form}
            name="active"
            label="Status"
            options={[
              { value: 'true', label: 'Ativo' },
              { value: 'false', label: 'Inativo' },
            ]}
            disabled={isView}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              form={form}
              name="limits.maxUsers"
              label="Limite de Usuários"
              type="number"
              disabled={isView}
            />
            <FormInput
              form={form}
              name="limits.maxClients"
              label="Limite de Clientes"
              type="number"
              disabled={isView}
            />
            <FormInput
              form={form}
              name="limits.maxProducts"
              label="Limite de Produtos"
              type="number"
              disabled={isView}
            />
            <FormInput
              form={form}
              name="limits.maxMessages"
              label="Limite de Mensagens"
              type="number"
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
                type="submit"
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
