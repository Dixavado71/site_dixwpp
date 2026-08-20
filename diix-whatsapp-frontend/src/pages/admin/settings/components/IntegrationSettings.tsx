import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { integrationSettingsSchema } from '@/schemas/settingsSchema';
import type { IntegrationSettingsFormData } from '@/schemas/settingsSchema';
import { Form, FormInput, FormSelect } from '@/components/ui/form/Form';
import { useSettingsStore } from '@/stores/settingsStore';
import { PAYMENT_GATEWAYS } from '@/constants';

interface IntegrationSettingsProps {
  onSave?: () => void;
}

const gatewayOptions = PAYMENT_GATEWAYS.map(gw => ({ value: gw, label: gw }));

export function IntegrationSettings({ onSave }: IntegrationSettingsProps) {
  const { settings, updateIntegrations, isLoading } = useSettingsStore();
  
  const form = useForm<IntegrationSettingsFormData>({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues: {
      paymentGateway: settings?.integrations.paymentGateway || 'Stripe',
      crmIntegration: settings?.integrations.crmIntegration || '',
    },
  });

  const handleSubmit = async (data: IntegrationSettingsFormData) => {
    try {
      await updateIntegrations(data);
      onSave?.();
    } catch (error) {
      // Error already handled by store
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit} submitButton={null}>
      <div className="space-y-4">
        <FormSelect
          form={form}
          name="paymentGateway"
          label="Gateway de Pagamento"
          options={gatewayOptions}
          placeholder="Selecione um gateway"
          required
        />
        
        <FormInput
          form={form}
          name="crmIntegration"
          label="Integração CRM"
          type="url"
          placeholder="https://api.seucrm.com"
        />
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Chaves de API</h4>
          <p className="text-xs text-text-muted">Gerencie suas chaves de API na seção de desenvolvedor.</p>
        </div>
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
