import type { User } from '../../interfaces/user.interfaces';

/**
 * Props para el componente ChangePasswordModal
 */
export interface ChangePasswordModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (passwordData: PasswordChangeData) => Promise<void>;
  loading?: boolean;
}

/**
 * Datos para cambio de contraseña
 */
export interface PasswordChangeData {
  UserId: number;
  user: User; // Usuario completo con todos sus datos actuales
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}
