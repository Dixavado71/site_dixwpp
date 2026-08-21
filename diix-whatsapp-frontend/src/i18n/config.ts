import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      // Navegação
      'Dashboard': 'Dashboard',
      'Sales': 'Vendas',
      'Customers': 'Clientes',
      'Products': 'Produtos',
      'Services': 'Serviços',
      'Financial': 'Financeiro',
      'Settings': 'Configurações',
      
      // Ações
      'Save': 'Salvar',
      'Cancel': 'Cancelar',
      'Delete': 'Excluir',
      'Edit': 'Editar',
      'New': 'Novo',
      'Search': 'Buscar',
      'Filter': 'Filtrar',
      'Export': 'Exportar',
      
      // Status
      'Pending': 'Pendente',
      'Completed': 'Concluído',
      'Cancelled': 'Cancelado',
      'Active': 'Ativo',
      'Inactive': 'Inativo',
      
      // Mensagens
      'Loading': 'Carregando...',
      'No results found': 'Nenhum resultado encontrado',
      'Success': 'Sucesso',
      'Error': 'Erro',
      
      // Agendamento
      'Schedule': 'Agendar',
      'Appointment': 'Agendamento',
      'Date': 'Data',
      'Time': 'Hora',
      'Professional': 'Profissional',
      'Client': 'Cliente',
      'Duration': 'Duração',
      
      // Dashboard
      'Revenue': 'Receita',
      'Expenses': 'Despesas',
      'Profit': 'Lucro',
      'Total Sales': 'Total de Vendas',
    },
  },
  'en-US': {
    translation: {
      // Navigation
      'Dashboard': 'Dashboard',
      'Sales': 'Sales',
      'Customers': 'Customers',
      'Products': 'Products',
      'Services': 'Services',
      'Financial': 'Financial',
      'Settings': 'Settings',
      
      // Actions
      'Save': 'Save',
      'Cancel': 'Cancel',
      'Delete': 'Delete',
      'Edit': 'Edit',
      'New': 'New',
      'Search': 'Search',
      'Filter': 'Filter',
      'Export': 'Export',
      
      // Status
      'Pending': 'Pending',
      'Completed': 'Completed',
      'Cancelled': 'Cancelled',
      'Active': 'Active',
      'Inactive': 'Inactive',
      
      // Messages
      'Loading': 'Loading...',
      'No results found': 'No results found',
      'Success': 'Success',
      'Error': 'Error',
      
      // Scheduling
      'Schedule': 'Schedule',
      'Appointment': 'Appointment',
      'Date': 'Date',
      'Time': 'Time',
      'Professional': 'Professional',
      'Client': 'Client',
      'Duration': 'Duration',
      
      // Dashboard
      'Revenue': 'Revenue',
      'Expenses': 'Expenses',
      'Profit': 'Profit',
      'Total Sales': 'Total Sales',
    },
  },
  'es': {
    translation: {
      // Navegación
      'Dashboard': 'Panel',
      'Sales': 'Ventas',
      'Customers': 'Clientes',
      'Products': 'Productos',
      'Services': 'Servicios',
      'Financial': 'Financiero',
      'Settings': 'Configuración',
      
      // Acciones
      'Save': 'Guardar',
      'Cancel': 'Cancelar',
      'Delete': 'Eliminar',
      'Edit': 'Editar',
      'New': 'Nuevo',
      'Search': 'Buscar',
      'Filter': 'Filtrar',
      'Export': 'Exportar',
      
      // Estado
      'Pending': 'Pendiente',
      'Completed': 'Completado',
      'Cancelled': 'Cancelado',
      'Active': 'Activo',
      'Inactive': 'Inactivo',
      
      // Mensajes
      'Loading': 'Cargando...',
      'No results found': 'No se encontraron resultados',
      'Success': 'Éxito',
      'Error': 'Error',
      
      // Programación
      'Schedule': 'Programar',
      'Appointment': 'Cita',
      'Date': 'Fecha',
      'Time': 'Hora',
      'Professional': 'Profesional',
      'Client': 'Cliente',
      'Duration': 'Duración',
      
      // Panel
      'Revenue': 'Ingresos',
      'Expenses': 'Gastos',
      'Profit': 'Beneficio',
      'Total Sales': 'Ventas Totales',
    },
  },
  'fr': {
    translation: {
      // Navigation
      'Dashboard': 'Tableau de bord',
      'Sales': 'Ventes',
      'Customers': 'Clients',
      'Products': 'Produits',
      'Services': 'Services',
      'Financial': 'Financier',
      'Settings': 'Paramètres',
      
      // Actions
      'Save': 'Enregistrer',
      'Cancel': 'Annuler',
      'Delete': 'Supprimer',
      'Edit': 'Modifier',
      'New': 'Nouveau',
      'Search': 'Rechercher',
      'Filter': 'Filtrer',
      'Export': 'Exporter',
      
      // Statut
      'Pending': 'En attente',
      'Completed': 'Terminé',
      'Cancelled': 'Annulé',
      'Active': 'Actif',
      'Inactive': 'Inactif',
      
      // Messages
      'Loading': 'Chargement...',
      'No results found': 'Aucun résultat trouvé',
      'Success': 'Succès',
      'Error': 'Erreur',
      
      // Planification
      'Schedule': 'Planifier',
      'Appointment': 'Rendez-vous',
      'Date': 'Date',
      'Time': 'Heure',
      'Professional': 'Professionnel',
      'Client': 'Client',
      'Duration': 'Durée',
      
      // Tableau de bord
      'Revenue': 'Revenus',
      'Expenses': 'Dépenses',
      'Profit': 'Bénéfice',
      'Total Sales': 'Ventes Totales',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
