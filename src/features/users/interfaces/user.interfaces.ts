/**
 * 👤 User Management Interfaces
 * Tipos y estructuras de datos para el módulo de administración de usuarios
 */

/**
 * User entity from database
 */
export interface User {
  UserId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password?: string; // Solo para create/edit, nunca mostrar
  RoleId: number;
  Status: number; // 1 = Activo, 0 = Inactivo
  CreateDate: string;
  Company: string;
  Salary: number;
  IsAdmin: boolean;
  Img?: string;
  DiscountHour?: number;
  isRainbow: boolean;
  Leader: boolean;
}

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDTO {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string; // Requerido en creación
  RoleId: number;
  Status: number;
  Company: string;
  Salary: number;
  IsAdmin: boolean;
  Img?: string;
  DiscountHour?: number;
  isRainbow: boolean;
  Leader: boolean;
}

/**
 * DTO para actualizar un usuario existente
 */
export interface UpdateUserDTO {
  UserId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password?: string; // Opcional en actualización
  RoleId: number;
  Status: number;
  Company: string;
  Salary: number;
  IsAdmin: boolean;
  Img?: string;
  DiscountHour?: number;
  isRainbow: boolean;
  Leader: boolean;
}

/**
 * Filtros para búsqueda de usuarios
 */
export interface UserFilters {
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
  roleFilter: 'all' | number;
  companyFilter: 'all' | string;
}

/**
 * Estadísticas de usuarios
 */
export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  administrators: number;
}

/**
 * Role entity
 */
export interface Role {
  RoleId: number;
  RoleName: string;
  Description?: string;
}

/**
 * Company entity
 */
export interface Company {
  CompanyId: string;
  CompanyName: string;
  Active: boolean;
}