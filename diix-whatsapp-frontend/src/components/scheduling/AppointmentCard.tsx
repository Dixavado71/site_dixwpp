import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Appointment } from '../../types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
}

const statusConfig = {
  pending: { label: 'Pendente', variant: 'warning' as const },
  confirmed: { label: 'Confirmado', variant: 'success' as const },
  cancelled: { label: 'Cancelado', variant: 'error' as const },
  completed: { label: 'Concluído', variant: 'success' as const },
  'no-show': { label: 'Não Compareceu', variant: 'error' as const },
};

export function AppointmentCard({ 
  appointment, 
  onEdit, 
  onCancel, 
  onConfirm 
}: AppointmentCardProps) {
  const status = statusConfig[appointment.status];

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-4 hover:border-accent-primary transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-accent-primary">{appointment.clientName}</h3>
          <p className="text-sm text-gray-400">{appointment.serviceName}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{format(new Date(appointment.date), "dd 'de' MMMM", { locale: ptBR })}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{appointment.startTime} - {appointment.endTime}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{appointment.professionalName}</span>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-gray-400 italic">{appointment.notes}</p>
        </div>
      )}

      {/* Recurring indicator */}
      {appointment.isRecurring && (
        <div className="mt-2">
          <Badge variant="info">Recorrente</Badge>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
        {onEdit && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => onEdit(appointment)}
            className="flex-1"
          >
            Editar
          </Button>
        )}
        
        {onConfirm && appointment.status === 'pending' && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onConfirm(appointment)}
            className="flex-1"
          >
            Confirmar
          </Button>
        )}
        
        {onCancel && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onCancel(appointment)}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}
