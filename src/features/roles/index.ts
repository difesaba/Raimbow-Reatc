/**
 * 🎭 Roles Feature - Main Barrel Export
 * Punto de entrada principal del feature de gestión de roles
 *
 * Este feature proporciona funcionalidad completa para:
 * - Gestión de roles del sistema ERP
 * - Creación de nuevos roles
 * - Visualización de roles existentes
 * - Control de permisos y niveles de acceso
 *
 * Arquitectura:
 * - ✅ Clean Architecture (SOLID, KISS)
 * - ✅ Separación de concerns (Models, Services, Hooks, Components, Pages)
 * - ✅ Actualizaciones funcionales de estado
 * - ✅ Manejo robusto de errores
 * - ✅ TypeScript strict mode
 * - ✅ Material-UI components
 */

// ==================== MODELS ====================
export type {
  Role,
  CreateRoleDTO,
  UpdateRoleDTO,
  RoleFilters,
  RoleStatistics,
  OperationResult
} from './models';

// ==================== SERVICES ====================
export { RoleService } from './services/role.service';

// ==================== HOOKS ====================
export { useRoles } from './hooks';

// ==================== COMPONENTS ====================
export { RolesTable, CreateRoleModal } from './components';
export type { RolesTableProps, CreateRoleModalProps } from './components';

// ==================== PAGES ====================
export { RolesManagementPage } from './pages';

// ==================== ROUTER ====================
export { rolesRoutes, rolesNavigation, ROLES_ROUTES } from './router/roles.routes';
