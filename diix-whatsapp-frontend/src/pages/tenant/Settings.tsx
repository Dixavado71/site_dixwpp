import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Building2, Bell, Save, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { tenantService } from '../../services'
import type { TenantSettings } from '../../types'

const settingsSchema = z.object({
  businessName: z.string().min(3, 'Nome da empresa deve ter no mínimo 3 caracteres'),
  whatsappNumber: z.string().min(10, 'WhatsApp inválido'),
  timezone: z.string().min(1, 'Fuso horário é obrigatório'),
  notificationPreferences: z.object({
    newAppointment: z.boolean(),
    appointmentReminder: z.boolean(),
    promotionExpiring: z.boolean(),
    marketingMessages: z.boolean(),
  }),
})

type SettingsFormData = z.infer<typeof settingsSchema>

const timezones = [
  { value: 'America/Sao_Paulo', label: 'Brasília (UTC-3)' },
  { value: 'America/Manaus', label: 'Manaus (UTC-4)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (UTC-2)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (UTC-5)' },
]

export default function TenantSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile')
  const queryClient = useQueryClient()

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['tenant-settings'],
    queryFn: async () => {
      const response = await tenantService.getSettings()
      return response.data
    },
  })

  const settings = settingsData

  const updateMutation = useMutation({
    mutationFn: tenantService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-settings'] })
      toast.success('Configurações salvas com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao salvar configurações')
    },
  })

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: '',
      whatsappNumber: '',
      timezone: 'America/Sao_Paulo',
      notificationPreferences: {
        newAppointment: true,
        appointmentReminder: true,
        promotionExpiring: true,
        marketingMessages: false,
      },
    },
  })

  useEffect(() => {
    if (settings) {
      reset({
        businessName: settings.businessName,
        whatsappNumber: settings.whatsappNumber,
        timezone: settings.timezone,
        notificationPreferences: settings.notificationPreferences,
      })
    }
  }, [settings, reset])

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Configurações</h1>
        <p className="text-text-muted">Gerencie as configurações da sua conta e empresa</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-2 inline-flex gap-2"
      >
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'profile'
              ? 'bg-accent-primary/10 text-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Perfil da Empresa
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'notifications'
              ? 'bg-accent-primary/10 text-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notificações
        </button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center neon-glow-purple">
                  <span className="text-3xl font-bold text-white">
                    {watch('businessName').charAt(0).toUpperCase() || 'E'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">Logo da Empresa</h3>
                  <p className="text-sm text-text-muted">PNG ou JPG, máximo 2MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Nome da Empresa *</label>
                <input
                  {...register('businessName')}
                  type="text"
                  className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.businessName ? 'border-error' : 'border-white/10'} text-text-primary focus:outline-none focus:border-accent-primary/50`}
                  placeholder="Razão Social da Empresa"
                />
                {errors.businessName && <p className="text-error text-sm mt-1">{errors.businessName.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">WhatsApp *</label>
                <input
                  {...register('whatsappNumber')}
                  type="tel"
                  className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.whatsappNumber ? 'border-error' : 'border-white/10'} text-text-primary focus:outline-none focus:border-accent-primary/50`}
                  placeholder="(00) 00000-0000"
                />
                {errors.whatsappNumber && <p className="text-error text-sm mt-1">{errors.whatsappNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Fuso Horário *</label>
                <select
                  {...register('timezone')}
                  className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${errors.timezone ? 'border-error' : 'border-white/10'} text-text-primary focus:outline-none focus:border-accent-primary/50`}
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
                {errors.timezone && <p className="text-error text-sm mt-1">{errors.timezone.message}</p>}
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={!isDirty || updateMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 neon-glow-green"
                >
                  <Save className="w-5 h-5" />
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div className="pb-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-text-primary mb-2">Preferências de Notificação</h3>
                <p className="text-text-muted">Escolha quais notificações você deseja receber</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <h4 className="text-text-primary font-medium mb-1">Novos Agendamentos</h4>
                  <p className="text-sm text-text-muted">Receba notificações quando um novo agendamento for criado</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.newAppointment')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <h4 className="text-text-primary font-medium mb-1">Lembretes de Agendamento</h4>
                  <p className="text-sm text-text-muted">Receba lembretes antes dos agendamentos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.appointmentReminder')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <h4 className="text-text-primary font-medium mb-1">Promoções Expirando</h4>
                  <p className="text-sm text-text-muted">Seja alertado quando promoções estiverem para expirar</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.promotionExpiring')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <h4 className="text-text-primary font-medium mb-1">Mensagens de Marketing</h4>
                  <p className="text-sm text-text-muted">Receba dicas e atualizações sobre a plataforma</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.marketingMessages')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={!isDirty || updateMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-cyan text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 neon-glow-green"
                >
                  <Save className="w-5 h-5" />
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar Preferências'}
                </button>
              </div>
            </div>
          )}
        </form>
      </motion.div>

      {/* Dirty State Indicator */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 glass-card rounded-xl px-4 py-3 flex items-center gap-2 neon-glow-green"
        >
          <CheckCircle className="w-5 h-5 text-accent-primary" />
          <span className="text-text-primary font-medium">Alterações não salvas</span>
        </motion.div>
      )}
    </div>
  )
}
