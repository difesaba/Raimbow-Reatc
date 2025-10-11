/**
 * 📦 Barrel export for roles models
 * Exporta todos los modelos del feature de roles
 */

// Role models
export type {
  Role,
  RoleAPIResponse,
  CreateRoleDTO,
  UpdateRoleDTO,
  RoleFilters,
  RoleStatistics
} from './role.model';

// Shared models
export type { OperationResult } from './shared.model';
