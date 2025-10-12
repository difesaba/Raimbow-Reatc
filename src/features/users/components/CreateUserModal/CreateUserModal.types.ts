import type { Role, Company } from '../../interfaces/user.interfaces';

/**
 * Props para el componente CreateUserModal
 */
export interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => Promise<void>;
  roles: Role[];
  companies: Company[];
  loading?: boolean;
}

/**
 * Datos para crear usuario
 */
export interface CreateUserData {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  RoleId: number;
  Company: string;
  Salary: number;
  DiscountHour: number;
  Status: number;
  IsAdmin: boolean;
  isRainbow: boolean;
  Leader: boolean;
  Img: string;
  WhatsApp: string; // Número de WhatsApp en formato internacional
}
