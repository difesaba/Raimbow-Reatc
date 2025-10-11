import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

/**
 * 🚦 Roles Module Routes Configuration
 * Configuración de rutas del módulo de roles
 *
 * Features:
 * - ✅ Lazy loading para optimizar performance
 * - ✅ Preparado para guardas de autenticación
 * - ✅ Estructura escalable para futuras rutas
 */

// ==================== LAZY LOADING ====================

/**
 * Lazy load de RolesManagementPage
 * Mejora el performance inicial de la aplicación
 */
const RolesManagementPage = lazy(() =>
  import('../pages/RolesManagementPage').then(module => ({
    default: module.RolesManagementPage
  }))
);

// ==================== ROUTES CONFIGURATION ====================

/**
 * 📋 Configuración de rutas del módulo de roles
 * Estas rutas deben ser incluidas en el router principal de la aplicación
 *
 * Ejemplo de uso en el router principal:
 * ```tsx
 * import { rolesRoutes } from '@/features/roles';
 *
 * const routes: RouteObject[] = [
 *   ...rolesRoutes,
 *   // otras rutas...
 * ];
 * ```
 */
export const rolesRoutes: RouteObject[] = [
  {
    path: 'roles',
    children: [
      {
        path: '',
        element: <RolesManagementPage />,
        // TODO: Agregar guarda de autenticación cuando esté disponible
        // loader: requireAuth,
        // TODO: Agregar verificación de permisos
        // loader: requirePermission('roles.view')
      },
      // TODO: Agregar más rutas según sea necesario
      // {
      //   path: ':roleId',
      //   element: <RoleDetailsPage />,
      //   loader: requireAuth
      // },
      // {
      //   path: ':roleId/edit',
      //   element: <EditRolePage />,
      //   loader: requireAuth
      // }
    ]
  }
];

// ==================== NAVIGATION ITEMS ====================

/**
 * 🧭 Items de navegación para el módulo de roles
 * Usado para generar elementos de menú en la navegación de la app
 *
 * Ejemplo de uso:
 * ```tsx
 * import { rolesNavigation } from '@/features/roles';
 *
 * const menuItems = [
 *   ...rolesNavigation,
 *   // otros items...
 * ];
 * ```
 */
export const rolesNavigation = [
  {
    title: 'Roles',
    icon: 'security', // Material Icon name
    children: [
      {
        title: 'Gestión de Roles',
        path: '/roles',
        icon: 'admin_panel_settings',
        description: 'Administrar roles y permisos del sistema'
      }
      // TODO: Agregar más items según sea necesario
      // {
      //   title: 'Permisos',
      //   path: '/roles/permissions',
      //   icon: 'lock',
      //   description: 'Administrar permisos individuales'
      // }
    ]
  }
];

// ==================== ROUTE PATHS (CONSTANTS) ====================

/**
 * 🔗 Constantes de rutas del módulo
 * Útil para navegación programática y evitar strings mágicos
 *
 * Ejemplo de uso:
 * ```tsx
 * import { ROLES_ROUTES } from '@/features/roles';
 *
 * navigate(ROLES_ROUTES.MANAGEMENT);
 * ```
 */
export const ROLES_ROUTES = {
  /** Ruta principal de gestión de roles */
  MANAGEMENT: '/roles',

  /** Ruta para crear nuevo rol (futuro) */
  CREATE: '/roles/create',

  /** Ruta para ver detalles de rol (futuro) */
  DETAILS: (roleId: number) => `/roles/${roleId}`,

  /** Ruta para editar rol (futuro) */
  EDIT: (roleId: number) => `/roles/${roleId}/edit`
} as const;
