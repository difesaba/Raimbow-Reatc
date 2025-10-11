import type { User } from '../../interfaces/user.interfaces';

/**
 * Props para el componente DeleteUserDialog
 */
export interface DeleteUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: number) => Promise<void>;
  loading?: boolean;
}