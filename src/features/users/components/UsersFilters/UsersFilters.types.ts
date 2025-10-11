import type { UserFilters, Role } from '../../interfaces/user.interfaces';

/**
 * Props para el componente UsersFilters
 */
export interface UsersFiltersProps {
  searchTerm: string;
  statusFilter: UserFilters['statusFilter'];
  roleFilter: UserFilters['roleFilter'];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: UserFilters['statusFilter']) => void;
  onRoleChange: (value: UserFilters['roleFilter']) => void;
  onReset: () => void;
  onAddUser?: () => void;
  roles?: Role[];
  loading?: boolean;
  totalResults?: number;
}