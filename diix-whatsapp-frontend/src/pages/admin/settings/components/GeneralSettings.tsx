import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalSettingsSchema } from '@/schemas/settingsSchema';
import type { GeneralSettingsFormData } from '@/schemas/settingsSchema';
import { Form, FormInput, FormCheckbox } from '@/components/ui/form/Form';
import { useSettingsStore } from '@/stores/settingsStore';
import { toast } from 'sonner';

interface GeneralSettingsProps {
  onSave?: () => void;
}

export function GeneralSettings({ onSave }: GeneralSettingsProps) {
  const { settings, updateGeneral, isLoading } = useSettingsStore();
  
  const form = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      appName: settings?.general.appName || '',
      supportEmail: settings?.general.supportEmail || '',
      maintenanceMode: settings?.general.maintenanceMode || false,
    },
  });

  const handleSubmit = async (data: GeneralSettingsFormData) => {
    try {
      await updateGeneral(data);
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
          name="appName"
          label="Nome da Aplicação"
          placeholder="DiixWhatsApp"
          required
        />
        
        <FormInput
          form={form}
          name="supportEmail"
          label="Email de Suporte"
          type="email"
          placeholder="suporte@empresa.com"
          required
        />
        
        <FormCheckbox
          form={form}
          name="maintenanceMode"
          label="Modo de Manutenção"
          description="Ative para colocar o sistema em manutenção"
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
