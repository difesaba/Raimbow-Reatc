import type { Role, Company, User } from '../../interfaces/user.interfaces';

/**
 * Props para el componente EditUserModal
 */
export interface EditUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (userData: EditUserData) => Promise<void>;
  roles: Role[];
  companies: Company[];
  loading?: boolean;
}

/**
 * Datos para editar usuario
 * Password siempre debe ser "-1" para indicar "no cambiar contraseña"
 */
export interface EditUserData {
  UserId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  RoleId: number;
  Company: string;
  Salary: number;
  DiscountHour: number;
  Status: number;
  IsAdmin: boolean;
  isRainbow: boolean;
  Leader: boolean;
  Img: string;
}
