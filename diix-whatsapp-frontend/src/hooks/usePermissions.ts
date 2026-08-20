import { useMemo } from 'react';
import type { User } from '@/types';

type Role = 'admin-global' | 'admin-tenant' | 'admin' | 'tenant' | 'user';

interface PermissionConfig {
  canManageTenants: boolean;
  canManageUsers: boolean;
  canManageCategories: boolean;
  canManageProducts: boolean;
  canManageSales: boolean;
  canManageFinancial: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

const ROLE_PERMISSIONS: Record<Role, PermissionConfig> = {
  'admin-global': {
    canManageTenants: true,
    canManageUsers: true,
    canManageCategories: true,
    canManageProducts: true,
    canManageSales: true,
    canManageFinancial: true,
    canManageSettings: true,
    canViewReports: true,
    canExportData: true,
  },
  'admin-tenant': {
    canManageTenants: false,
    canManageUsers: true,
    canManageCategories: true,
    canManageProducts: true,
    canManageSales: true,
    canManageFinancial: true,
    canManageSettings: false,
    canViewReports: true,
    canExportData: true,
  },
  'admin': {
    canManageTenants: false,
    canManageUsers: false,
    canManageCategories: true,
    canManageProducts: true,
    canManageSales: true,
    canManageFinancial: true,
    canManageSettings: false,
    canViewReports: true,
    canExportData: true,
  },
  'tenant': {
    canManageTenants: false,
    canManageUsers: false,
    canManageCategories: true,
    canManageProducts: true,
    canManageSales: true,
    canManageFinancial: false,
    canManageSettings: true,
    canViewReports: true,
    canExportData: false,
  },
  'user': {
    canManageTenants: false,
    canManageUsers: false,
    canManageCategories: false,
    canManageProducts: false,
    canManageSales: false,
    canManageFinancial: false,
    canManageSettings: false,
    canViewReports: false,
    canExportData: false,
  },
};

interface UsePermissionsReturn extends PermissionConfig {
  user: User | null;
  role: Role | null;
  hasRole: (roles: Role[]) => boolean;
  can: (permission: keyof PermissionConfig) => boolean;
  isGlobalAdmin: boolean;
  isTenantAdmin: boolean;
}

export function usePermissions(user: User | null): UsePermissionsReturn {
  const role = user?.role as Role | null;
  
  const permissions = useMemo(() => {
    if (!role) {
      return {
        canManageTenants: false,
        canManageUsers: false,
        canManageCategories: false,
        canManageProducts: false,
        canManageSales: false,
        canManageFinancial: false,
        canManageSettings: false,
        canViewReports: false,
        canExportData: false,
      };
    }
    return ROLE_PERMISSIONS[role];
  }, [role]);

  const hasRole = (roles: Role[]): boolean => {
    return role ? roles.includes(role) : false;
  };

  const can = (permission: keyof PermissionConfig): boolean => {
    return permissions[permission];
  };

  return {
    user,
    role,
    hasRole,
    can,
    isGlobalAdmin: role === 'admin-global',
    isTenantAdmin: role === 'admin-tenant',
    ...permissions,
  };
}
