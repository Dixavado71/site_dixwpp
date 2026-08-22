import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Select from '@/components/ui/Select';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    type?: 'appointment' | 'task' | 'event';
    clientId?: string;
    professionalId?: string;
  };
}

export interface CalendarViewProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (eventId: string, newDate: Date) => void;
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
}

type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

export function CalendarView({ 
  events = [], 
  onEventClick,
  onDateClick,
  onEventDrop,
  onEventResize
}: CalendarViewProps) {
  const [viewType, setViewType] = useState<CalendarViewType>('dayGridMonth');
  const calendarRef = useRef<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Event colors by type
  const eventColors = {
    appointment: '#00ff9d',
    task: '#00b8ff',
    event: '#ff00ff',
  };

  const handleViewChange = (view: CalendarViewType) => {
    setViewType(view);
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.today();
      setCurrentDate(new Date());
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.prev();
      setCurrentDate(calendarRef.current.getDate());
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.next();
      setCurrentDate(calendarRef.current.getDate());
    }
  };

  const formattedEvents = events.map(event => ({
    ...event,
    backgroundColor: event.backgroundColor || eventColors[event.extendedProps?.type || 'event'],
    borderColor: event.borderColor || eventColors[event.extendedProps?.type || 'event'],
  }));

  return (
    <Card className="p-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrev}>
            ‹ Anterior
          </Button>
          <Button variant="secondary" size="sm" onClick={handleToday}>
            Hoje
          </Button>
          <Button variant="secondary" size="sm" onClick={handleNext}>
            Próxima ›
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-accent-primary min-w-[200px] text-center">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>

        <div className="flex items-center gap-2">
          <Select value={viewType} onValueChange={(value) => handleViewChange(value as CalendarViewType)}>
            <Select.Trigger className="w-[140px]">
              <Select.Value placeholder="Selecione a visão" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="dayGridMonth">Mês</Select.Item>
              <Select.Item value="timeGridWeek">Semana</Select.Item>
              <Select.Item value="timeGridDay">Dia</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-container">
        <style>{`
          .fc {
            max-width: 100%;
            --fc-border-color: rgba(255, 255, 255, 0.1);
            --fc-now-indicator-color: #00ff9d;
            --fc-today-bg-color: rgba(0, 255, 157, 0.1);
            --fc-page-bg-color: transparent;
            --fc-neutral-bg-color: rgba(255, 255, 255, 0.05);
            --fc-list-event-hover-bg-color: rgba(255, 255, 255, 0.05);
          }
          
          .fc th {
            background: rgba(255, 255, 255, 0.05);
            padding: 12px 8px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
          
          .fc td {
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .fc-daygrid-day-number {
            color: #a0a0a0;
            padding: 8px;
          }
          
          .fc-daygrid-day.fc-day-today {
            background: rgba(0, 255, 157, 0.1) !important;
          }
          
          .fc-event {
            border: none;
            padding: 4px 8px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: transform 0.2s;
          }
          
          .fc-event:hover {
            transform: scale(1.02);
          }
          
          .fc-button-primary {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #a0a0a0 !important;
          }
          
          .fc-button-primary:hover {
            background: rgba(0, 255, 157, 0.2) !important;
            border-color: #00ff9d !important;
            color: #00ff9d !important;
          }
          
          .fc-button-primary:focus {
            box-shadow: none !important;
          }
        `}</style>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin] as any}
          initialView={viewType}
          locale="pt-br"
          events={formattedEvents}
          height="auto"
          headerToolbar={false}
          selectable={true}
          editable={true}
          droppable={true}
          eventResizableFromStart={true}
          dayMaxEvents={3}
          weekends={true}
          allDaySlot={true}
          slotDuration="00:30:00"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          firstDay={1}
          eventClick={({ event, jsEvent }) => {
            jsEvent.preventDefault();
            onEventClick?.({
              id: event.id,
              title: event.title,
              start: event.start?.toISOString() || '',
              end: event.end?.toISOString(),
              extendedProps: event.extendedProps,
            });
          }}
          dateClick={({ date }) => {
            onDateClick?.(date);
          }}
          eventDrop={({ event, revert }) => {
            if (event.start) {
              onEventDrop?.(event.id, event.start);
            } else {
              revert();
            }
          }}
          eventResize={({ event, oldEvent, revert }) => {
            if (event.start && event.end) {
              onEventResize?.(event.id, event.start, event.end);
            } else {
              revert();
            }
          }}
        />
      </div>
    </Card>
  );
}
