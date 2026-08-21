import { create } from 'zustand';
import { appointmentService } from '../services/appointmentService';
import type { Appointment, CreateAppointmentDTO, UpdateAppointmentDTO, AppointmentFilters } from '../types/appointment';
import { toast } from 'sonner';

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  filters: AppointmentFilters;
  
  // Actions
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>;
  createAppointment: (data: CreateAppointmentDTO) => Promise<Appointment>;
  updateAppointment: (id: string, data: UpdateAppointmentDTO) => Promise<Appointment>;
  cancelAppointment: (id: string, reason?: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  setFilters: (filters: AppointmentFilters) => void;
  clearError: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  loading: false,
  error: null,
  filters: {},

  fetchAppointments: async (filters?: AppointmentFilters) => {
    set({ loading: true, error: null });
    try {
      const allFilters = filters ? { ...get().filters, ...filters } : get().filters;
      const appointments = await appointmentService.getAll(allFilters);
      set({ appointments, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar agendamentos';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createAppointment: async (data: CreateAppointmentDTO) => {
    set({ loading: true, error: null });
    try {
      const appointment = await appointmentService.create(data);
      set((state) => ({
        appointments: [...state.appointments, appointment],
        loading: false,
      }));
      toast.success('Agendamento criado com sucesso!');
      return appointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar agendamento';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateAppointment: async (id: string, data: UpdateAppointmentDTO) => {
    set({ loading: true, error: null });
    try {
      const appointment = await appointmentService.update(id, data);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === id ? appointment : apt
        ),
        loading: false,
      }));
      toast.success('Agendamento atualizado com sucesso!');
      return appointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar agendamento';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  cancelAppointment: async (id: string, reason?: string) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.cancel(id, reason);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
        ),
        loading: false,
      }));
      toast.success('Agendamento cancelado');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar agendamento';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  confirmAppointment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.confirm(id);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'confirmed' as const } : apt
        ),
        loading: false,
      }));
      toast.success('Agendamento confirmado!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao confirmar agendamento';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteAppointment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.delete(id);
      set((state) => ({
        appointments: state.appointments.filter((apt) => apt.id !== id),
        loading: false,
      }));
      toast.success('Agendamento removido');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover agendamento';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  setFilters: (filters: AppointmentFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },
}));
