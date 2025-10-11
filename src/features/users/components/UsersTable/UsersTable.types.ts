import type { User, Role } from '../../interfaces/user.interfaces';

/**
 * Props para el componente UsersTable
 */
export interface UsersTableProps {
  users: User[];
  roles: Role[];
  loading?: boolean;
  onEdit?: (user: User) => void;
  onChangePassword?: (user: User) => void;
  onDelete?: (user: User) => void;
  onViewDetails?: (user: User) => void;
}