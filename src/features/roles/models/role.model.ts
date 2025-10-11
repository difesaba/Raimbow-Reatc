/**
 * 🎭 Role Management Models
 * Tipos y estructuras de datos para el módulo de gestión de roles
 */

/**
 * Role API Response
 * Estructura real de datos que retorna el backend
 * NOTA: El backend retorna "Name" pero el frontend usa "RoleName"
 */
export interface RoleAPIResponse {
  /** Identificador único del rol */
  RoleId: number;

  /** Nombre del rol (campo backend: "Name") */
  Name: string;

 
  /** Descripción detallada del rol y sus responsabilidades */
  Description?: string;

  /** Estado del rol (true = activo, false = inactivo) */
  Active?: boolean;

  /** Fecha de creación del rol */
  CreatedAt?: string;

  /** Fecha de última actualización */
  UpdatedAt?: string;

  /** Permisos asociados al rol */
  Permissions?: string[];

  /** Nivel de acceso del rol (1-10, donde 10 es máximo) */
  AccessLevel?: number;
}

/**
 * Role entity from database
 * Representa un rol en el sistema con sus permisos asociados
 * NOTA: Esta es la estructura normalizada para uso interno del frontend
 */
export interface Role {
  /** Identificador único del rol */
  RoleId: number;

  /** Nombre descriptivo del rol */
  RoleName: string;

  /** Descripción detallada del rol y sus responsabilidades */
  Description?: string;

  /** Estado del rol (true = activo, false = inactivo) */
  Active?: boolean;

  /** Fecha de creación del rol */
  CreatedAt?: string;

  /** Fecha de última actualización */
  UpdatedAt?: string;

  /** Permisos asociados al rol */
  Permissions?: string[];

  /** Nivel de acceso del rol (1-10, donde 10 es máximo) */
  AccessLevel?: number;
}

/**
 * DTO para crear un nuevo rol
 * Contiene solo los campos necesarios para crear un rol
 */
export interface CreateRoleDTO {
  /** Nombre del nuevo rol (mínimo 3 caracteres) */
  RoleName: string;

  /** Descripción del rol (opcional) */
  Description?: string;

  /** Estado inicial del rol (default: true) */
  Active?: boolean;

  /** Permisos iniciales del rol (opcional) */
  Permissions?: string[];

  /** Nivel de acceso del rol (opcional, default: 1) */
  AccessLevel?: number;
}

/**
 * DTO para actualizar un rol existente
 * Todos los campos son opcionales excepto RoleId
 */
export interface UpdateRoleDTO {
  /** ID del rol a actualizar */
  RoleId: number;

  /** Nuevo nombre del rol */
  RoleName?: string;

  /** Nueva descripción del rol */
  Description?: string;

  /** Nuevo estado del rol */
  Active?: boolean;

  /** Nuevos permisos del rol */
  Permissions?: string[];

  /** Nuevo nivel de acceso */
  AccessLevel?: number;
}

/**
 * Filtros para búsqueda de roles
 * Permite filtrar la lista de roles según diferentes criterios
 */
export interface RoleFilters {
  /** Término de búsqueda (busca en nombre y descripción) */
  searchTerm: string;

  /** Filtro de estado */
  statusFilter: 'all' | 'active' | 'inactive';

  /** Filtro por nivel de acceso mínimo */
  minAccessLevel?: number;
}

/**
 * Estadísticas de roles
 * Información agregada sobre los roles del sistema
 */
export interface RoleStatistics {
  /** Total de roles en el sistema */
  total: number;

  /** Cantidad de roles activos */
  active: number;

  /** Cantidad de roles inactivos */
  inactive: number;

  /** Cantidad de usuarios asignados a cada rol */
  usersPerRole?: Record<number, number>;
}
