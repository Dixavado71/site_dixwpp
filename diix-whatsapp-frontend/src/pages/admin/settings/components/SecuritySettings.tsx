import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { securitySettingsSchema } from '@/schemas/settingsSchema';
import type { SecuritySettingsFormData } from '@/schemas/settingsSchema';
import { Form, FormInput, FormCheckbox } from '@/components/ui/form/Form';
import { useSettingsStore } from '@/stores/settingsStore';

interface SecuritySettingsProps {
  onSave?: () => void;
}

export function SecuritySettings({ onSave }: SecuritySettingsProps) {
  const { settings, updateSecurity, isLoading } = useSettingsStore();
  
  const form = useForm<SecuritySettingsFormData>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      sessionTimeout: settings?.security.sessionTimeout || 30,
      requireTwoFactor: settings?.security.requireTwoFactor || false,
      passwordMinLength: settings?.security.passwordMinLength || 8,
    },
  });

  const handleSubmit = async (data: SecuritySettingsFormData) => {
    try {
      await updateSecurity(data);
      onSave?.();
    } catch (error) {
      // Error already handled by store
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit} submitButton={null}>
      <div className="space-y-4">
        <FormInput
          form={form}
          name="sessionTimeout"
          label="Timeout da Sessão (minutos)"
          type="number"
          placeholder="30"
          required
        />
        
        <FormInput
          form={form}
          name="passwordMinLength"
          label="Tamanho Mínimo da Senha"
          type="number"
          placeholder="8"
          required
        />
        
        <FormCheckbox
          form={form}
          name="requireTwoFactor"
          label="Exigir Autenticação em Dois Fatores"
          description="Requer 2FA para todos os usuários"
        />
      </div>
      
      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading}
          className="px-4 py-2 bg-accent-primary text-text-primary rounded-lg font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={() => form.reset()}
          className="px-4 py-2 bg-white/5 text-text-secondary rounded-lg font-medium hover:bg-white/10 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </Form>
  );
}
