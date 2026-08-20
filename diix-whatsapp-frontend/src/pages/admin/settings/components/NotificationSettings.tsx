import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationSettingsSchema } from '@/schemas/settingsSchema';
import type { NotificationSettingsFormData } from '@/schemas/settingsSchema';
import { Form, FormCheckbox } from '@/components/ui/form/Form';
import { useSettingsStore } from '@/stores/settingsStore';

interface NotificationSettingsProps {
  onSave?: () => void;
}

export function NotificationSettings({ onSave }: NotificationSettingsProps) {
  const { settings, updateNotifications, isLoading } = useSettingsStore();
  
  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailEnabled: settings?.notifications.emailEnabled ?? true,
      smsEnabled: settings?.notifications.smsEnabled ?? false,
      pushEnabled: settings?.notifications.pushEnabled ?? true,
    },
  });

  const handleSubmit = async (data: NotificationSettingsFormData) => {
    try {
      await updateNotifications(data);
      onSave?.();
    } catch (error) {
      // Error already handled by store
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit} submitButton={null}>
      <div className="space-y-4">
        <FormCheckbox
          form={form}
          name="emailEnabled"
          label="Notificações por Email"
          description="Receba notificações via email"
        />
        
        <FormCheckbox
          form={form}
          name="smsEnabled"
          label="Notificações por SMS"
          description="Receba notificações via SMS"
        />
        
        <FormCheckbox
          form={form}
          name="pushEnabled"
          label="Push Notifications"
          description="Receba notificações push no navegador"
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
