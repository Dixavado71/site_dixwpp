export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every X days/weeks/months
  endDate?: string;
  occurrences?: number;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  professionalId: string;
}

export interface AvailabilityMatrix {
  professionalId: string;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakTimes?: { start: string; end: string }[];
}

export interface AppointmentFilters {
  dateFrom?: string;
  dateTo?: string;
  professionalId?: string;
  clientId?: string;
  status?: Appointment['status'];
  serviceId?: string;
}

export interface CreateAppointmentDTO {
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  status?: Appointment['status'];
}
