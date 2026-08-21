import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { AppointmentCard } from './AppointmentCard';
import { useAppointmentStore } from '../../stores/appointmentStore';
import type { Appointment, AppointmentFilters } from '../../types/appointment';

type ViewMode = 'day' | 'week' | 'month';

interface AppointmentListProps {
  onViewChange?: (view: ViewMode) => void;
  onEditAppointment?: (appointment: Appointment) => void;
}

export function AppointmentList({ onViewChange, onEditAppointment }: AppointmentListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { appointments, fetchAppointments, cancelAppointment, confirmAppointment } = useAppointmentStore();
  const loading = useAppointmentStore((state) => state.loading);

  useEffect(() => {
    const filters: AppointmentFilters = {
      dateFrom: format(startOfWeek(currentDate), 'yyyy-MM-dd'),
      dateTo: format(addDays(startOfWeek(currentDate), 6), 'yyyy-MM-dd'),
    };
    fetchAppointments(filters);
  }, [currentDate]);

  useEffect(() => {
    onViewChange?.(viewMode);
  }, [viewMode]);

  // Filter appointments for current view
  const getFilteredAppointments = () => {
    const start = startOfWeek(currentDate);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      
      if (viewMode === 'day') {
        return isSameDay(aptDate, currentDate);
      } else if (viewMode === 'week') {
        const endOfWeek = addDays(start, 6);
        return aptDate >= start && aptDate <= endOfWeek;
      } else {
        // Month view - show all for now
        return true;
      }
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const filteredAppointments = getFilteredAppointments();

  // Group appointments by date
  const appointmentsByDate = filteredAppointments.reduce((acc, apt) => {
    const dateKey = apt.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const handlePrev = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      // Month
      setCurrentDate(addDays(currentDate, -30));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      // Month
      setCurrentDate(addDays(currentDate, 30));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCancel = async (appointment: Appointment) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      await cancelAppointment(appointment.id, 'Cancelado pelo usuário');
    }
  };

  const handleConfirm = async (appointment: Appointment) => {
    await confirmAppointment(appointment.id);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrev}>
            ‹
          </Button>
          <Button variant="secondary" size="sm" onClick={handleToday}>
            Hoje
          </Button>
          <Button variant="secondary" size="sm" onClick={handleNext}>
            ›
          </Button>
          
          <h2 className="text-lg font-semibold ml-4 min-w-[200px] text-center">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            options={[
              { value: 'day', label: 'Dia' },
              { value: 'week', label: 'Semana' },
              { value: 'month', label: 'Mês' },
            ]}
          />
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Carregando agendamentos...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          Nenhum agendamento para este período
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(appointmentsByDate).map(([date, dayAppointments]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-accent-primary mb-3 sticky top-0 bg-bg-primary py-2">
                {format(new Date(date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={onEditAppointment}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
