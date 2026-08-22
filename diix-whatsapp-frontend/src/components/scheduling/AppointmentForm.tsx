import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useAppointmentStore } from '../../stores/appointmentStore';
import type { CreateAppointmentDTO } from '../../types/appointment';

const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  professionalId: z.string().min(1, 'Profissional é obrigatório'),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  startTime: z.string().min(1, 'Hora de início é obrigatória'),
  endTime: z.string().min(1, 'Hora de fim é obrigatória'),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  clients?: Array<{ id: string; name: string }>;
  professionals?: Array<{ id: string; name: string }>;
  services?: Array<{ id: string; name: string }>;
}

export function AppointmentForm({ 
  onSuccess, 
  onCancel,
  clients = [],
  professionals = [],
  services = []
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAppointment = useAppointmentStore((state) => state.createAppointment);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: '',
      professionalId: '',
      serviceId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      notes: '',
      isRecurring: false,
    },
  });

  const date = watch('date');
  const startTime = watch('startTime');

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      const appointmentData: CreateAppointmentDTO = {
        clientId: data.clientId,
        professionalId: data.professionalId,
        serviceId: data.serviceId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
        isRecurring: data.isRecurring,
      };

      await createAppointment(appointmentData);
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slots (30 min intervals)
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8; // Start at 8:00
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }).filter(slot => slot >= '08:00' && slot <= '20:00');

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6 text-accent-primary">
        Novo Agendamento
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Client Selection */}
        <Controller
          name="clientId"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-2">Cliente *</label>
              <Select value={field.value} onValueChange={field.onChange}>
                <Select.Trigger className="w-full">
                  <Select.Value placeholder="Selecione um cliente" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="">Selecione um cliente</Select.Item>
                  {clients.map(c => (
                    <Select.Item key={c.id} value={c.id}>{c.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select>
              {errors.clientId?.message && (
                <p className="mt-1 text-xs text-error">{errors.clientId.message}</p>
              )}
            </div>
          )}
        />

        {/* Professional Selection */}
        <Controller
          name="professionalId"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-2">Profissional *</label>
              <Select value={field.value} onValueChange={field.onChange}>
                <Select.Trigger className="w-full">
                  <Select.Value placeholder="Selecione um profissional" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="">Selecione um profissional</Select.Item>
                  {professionals.map(p => (
                    <Select.Item key={p.id} value={p.id}>{p.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select>
              {errors.professionalId?.message && (
                <p className="mt-1 text-xs text-error">{errors.professionalId.message}</p>
              )}
            </div>
          )}
        />

        {/* Service Selection */}
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-2">Serviço *</label>
              <Select value={field.value} onValueChange={field.onChange}>
                <Select.Trigger className="w-full">
                  <Select.Value placeholder="Selecione um serviço" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="">Selecione um serviço</Select.Item>
                  {services.map(s => (
                    <Select.Item key={s.id} value={s.id}>{s.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select>
              {errors.serviceId?.message && (
                <p className="mt-1 text-xs text-error">{errors.serviceId.message}</p>
              )}
            </div>
          )}
        />

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-2">Data *</label>
              <Input
                type="date"
                {...field}
                min={format(new Date(), 'yyyy-MM-dd')}
                error={errors.date?.message}
              />
            </div>
          )}
        />

        {/* Time Slots */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2">Hora Início *</label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger className="w-full">
                    <Select.Value placeholder="Início" />
                  </Select.Trigger>
                  <Select.Content>
                    {timeSlots.map(t => (
                      <Select.Item key={t} value={t}>{t}</Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                {errors.startTime?.message && (
                  <p className="mt-1 text-xs text-error">{errors.startTime.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-2">Hora Fim *</label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger className="w-full">
                    <Select.Value placeholder="Fim" />
                  </Select.Trigger>
                  <Select.Content>
                    {timeSlots
                      .filter(t => t > startTime)
                      .map(t => (
                        <Select.Item key={t} value={t}>{t}</Select.Item>
                      ))}
                  </Select.Content>
                </Select>
                {errors.endTime?.message && (
                  <p className="mt-1 text-xs text-error">{errors.endTime.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Notes */}
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                {...field}
                rows={3}
                className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                placeholder="Adicione observações sobre o agendamento..."
              />
            </div>
          )}
        />

        {/* Recurring Toggle */}
        <Controller
          name="isRecurring"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-bg-secondary"
              />
              <label className="text-sm">Agendamento recorrente</label>
            </div>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Agendar'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
