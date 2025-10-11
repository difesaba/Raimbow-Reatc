import type { Role } from '../../models';

/**
 * 📋 Props para el componente RolesTable
 */
export interface RolesTableProps {
  /** Lista de roles a mostrar en la tabla */
  roles: Role[];

  /** Estado de carga */
  loading?: boolean;

  /** Callback cuando se solicita editar un rol */
  onEdit?: (role: Role) => void;

  /** Callback cuando se solicita eliminar un rol */
  onDelete?: (roleId: number) => void;

  /** Callback cuando se solicita ver detalles de un rol */
  onViewDetails?: (role: Role) => void;

  /** ID del rol actualmente seleccionado */
  selectedRoleId?: number;
}
