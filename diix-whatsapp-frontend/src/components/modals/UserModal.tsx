import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserFormData } from '@/schemas/userSchema';
import { Form, FormInput, FormSelect } from '@/components/ui/form/Form';
import { Modal } from '@/components/ui/modal/Modal';
import { useUsersStore } from '@/stores/usersStore';
import { useTenantsStore } from '@/stores/tenantsStore';
import { useEffect } from 'react';

interface UserModalProps {
  mode: 'create' | 'edit' | 'view';
  user?: any;
  open: boolean;
  onClose: () => void;
}

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
];

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

export function UserModal({ mode, user, open, onClose }: UserModalProps) {
  const { createUser, updateUser, isLoading } = useUsersStore();
  const { tenants, fetchTenants } = useTenantsStore();
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: (user?.role as any) || 'admin',
      tenantId: user?.tenantId || '',
      status: (user?.status as any) || 'active',
    },
  });

  const role = form.watch('role');

  useEffect(() => {
    if (open && role === 'admin') {
      fetchTenants();
    }
  }, [open, role]);

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (mode === 'create') {
        await createUser({
          name: data.name,
          email: data.email,
          role: data.role,
          tenantId: data.role === 'admin' ? data.tenantId : undefined,
          status: data.status,
        });
      } else {
        await updateUser(user!.id, {
          name: data.name,
          email: data.email,
          role: data.role,
          tenantId: data.role === 'admin' ? data.tenantId : undefined,
          status: data.status,
        });
      }
      onClose();
    } catch (error: any) {
      // Error toast já é disparado pelo store
    }
  };

  const isView = mode === 'view';
  const tenantOptions = tenants.map(t => ({ value: t.id, label: t.name }));

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Usuário' : mode === 'edit' ? 'Editar Usuário' : 'Detalhes do Usuário'}
    >
      <Form form={form} onSubmit={handleSubmit} submitButton={null}>
        <div className="space-y-4">
          <FormInput
            form={form}
            name="name"
            label="Nome"
            placeholder="Ex: João Silva"
            required
            disabled={isView}
          />
          
          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="usuario@empresa.com"
            required
            disabled={isView}
          />
          
          <FormSelect
            form={form}
            name="role"
            label="Role"
            options={roleOptions}
            placeholder="Selecione um role"
            required
            disabled={isView}
          />
          
          {role === 'admin' && (
            <FormSelect
              form={form}
              name="tenantId"
              label="Tenant"
              options={tenantOptions}
              placeholder="Selecione um tenant"
              disabled={isView}
            />
          )}
          
          <FormSelect
            form={form}
            name="status"
            label="Status"
            options={statusOptions}
            placeholder="Selecione um status"
            required
            disabled={isView}
          />
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
