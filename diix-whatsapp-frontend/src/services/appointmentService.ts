import api from '@/lib/api';
import type { 
  Appointment, 
  CreateAppointmentDTO, 
  UpdateAppointmentDTO, 
  AppointmentFilters 
} from '../types/appointment';

export const appointmentService = {
  /**
   * Get all appointments with optional filters
   */
  async getAll(filters?: AppointmentFilters): Promise<Appointment[]> {
    const params = new URLSearchParams();
    
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.professionalId) params.append('professionalId', filters.professionalId);
    if (filters?.clientId) params.append('clientId', filters.clientId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.serviceId) params.append('serviceId', filters.serviceId);
    
    const response = await api.get(`/appointments?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single appointment by ID
   */
  async getById(id: string): Promise<Appointment> {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  /**
   * Create a new appointment
   */
  async create(data: CreateAppointmentDTO): Promise<Appointment> {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  /**
   * Update an existing appointment
   */
  async update(id: string, data: UpdateAppointmentDTO): Promise<Appointment> {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Cancel an appointment
   */
  async cancel(id: string, reason?: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Confirm an appointment
   */
  async confirm(id: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/confirm`);
    return response.data;
  },

  /**
   * Delete an appointment
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },

  /**
   * Get available time slots for a professional on a specific date
   */
  async getAvailableSlots(professionalId: string, date: string): Promise<{ startTime: string; endTime: string }[]> {
    const response = await api.get(`/appointments/availability/${professionalId}`, {
      params: { date }
    });
    return response.data;
  },

  /**
   * Check for scheduling conflicts
   */
  async checkConflict(
    professionalId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<{ hasConflict: boolean; conflictingAppointments?: Appointment[] }> {
    const response = await api.post('/appointments/check-conflict', {
      professionalId,
      date,
      startTime,
      endTime
    });
    return response.data;
  },
};
