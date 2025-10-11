// ==================== USER DOMAIN INTERFACES ====================

/**
 * 👤 Respuesta del API para información de usuario
 * Endpoint: GET /api/user
 *
 * NOTA: Esta interface es una suposición basada en el código legacy.
 * Debe verificarse con la respuesta real del backend.
 */
export interface User {
  /** Identificador único del usuario */
  UserId: number;

  /** Primer nombre del usuario */
  FirstName: string;

  /** Apellido del usuario */
  LastName: string;

  /** Email del usuario (si está disponible) */
  Email?: string;

  /** Rol del usuario en el sistema */
  Role?: string;

  /** Estado activo/inactivo del usuario */
  Active?: boolean;

  /** Tarifa por hora (para empleados) */
  HourlyRate?: number;

  /** Departamento o área del usuario */
  Department?: string;

  /** Fecha de creación del registro */
  CreatedAt?: string;

  /** Fecha de última actualización */
  UpdatedAt?: string;
}

/**
 * 🔍 Filtros para búsqueda de usuarios
 */
export interface UserFilters {
  /** Buscar por nombre o apellido */
  search?: string;

  /** Filtrar por rol */
  role?: string;

  /** Filtrar solo usuarios activos */
  activeOnly?: boolean;

  /** Filtrar por departamento */
  department?: string;
}

/**
 * 📝 DTO para crear o actualizar usuario
 */
export interface UserDTO {
  /** Primer nombre del usuario */
  FirstName: string;

  /** Apellido del usuario */
  LastName: string;

  /** Email del usuario */
  Email?: string;

  /** Rol del usuario */
  Role?: string;

  /** Estado activo/inactivo */
  Active?: boolean;

  /** Tarifa por hora */
  HourlyRate?: number;

  /** Departamento */
  Department?: string;
}

/**
 * 🎯 Usuario simplificado para selectores y autocomplete
 */
export interface UserOption {
  /** ID del usuario */
  value: number;

  /** Nombre completo para mostrar */
  label: string;

  /** Datos adicionales del usuario */
  data: {
    firstName: string;
    lastName: string;
    role?: string;
    department?: string;
  };
}