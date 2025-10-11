/**
 * 🏘️ Interfaces para Subdivisiones
 * Basadas en la estructura real del API: /api/subdivision
 */

/**
 * 📋 Subdivision - Subdivisión o desarrollo inmobiliario
 * Estructura según respuesta del API
 */
export interface Subdivision {
  /** ID único de la subdivisión */
  SubdivisionId: number;

  /** Nombre de la subdivisión */
  Name: string;

  /** ID del constructor/builder */
  BuilderId?: number;

  /** Cantidad de lotes en la subdivisión */
  LotsQuantity?: number;

  /** Estado de la subdivisión */
  Status?: number;

  /** ID del usuario */
  UserId?: number;

  /** Indica si es townhome */
  IsTownHome?: boolean;

  /** Fecha de creación */
  CreateDate?: string;

  /** Email de contacto */
  Email?: string;

  /** Supervisor asignado */
  Supervisor?: string;
}

/**
 * 📝 CreateSubdivisionDTO - Datos para crear subdivisión
 */
export interface CreateSubdivisionDTO {
  Name: string;
  BuilderId?: number;
  LotsQuantity?: number;
  Status?: number;
  UserId?: number;
  IsTownHome?: boolean;
  Email?: string;
  Supervisor?: string;
}

/**
 * ✏️ UpdateSubdivisionDTO - Datos para actualizar subdivisión
 */
export interface UpdateSubdivisionDTO {
  SubdivisionId: number;
  Name?: string;
  BuilderId?: number;
  LotsQuantity?: number;
  Status?: number;
  UserId?: number;
  IsTownHome?: boolean;
  Email?: string;
  Supervisor?: string;
}

/**
 * 🔍 SubdivisionFilters - Filtros para búsqueda de subdivisiones
 */
export interface SubdivisionFilters {
  search?: string;
  builderId?: number;
  status?: number;
  isTownHome?: boolean;
}

/**
 * 📊 SubdivisionOption - Formato simplificado para selectores
 * Útil para Autocomplete/Select components
 */
export interface SubdivisionOption {
  value: number;
  label: string;
  data?: {
    builderId?: number;
    supervisor?: string;
    lotsQuantity?: number;
  };
}
