/**
 * 🔄 Shared models for API responses
 * Estructuras comunes reutilizables en todo el feature de roles
 */

/**
 * Resultado estándar de operaciones API
 * Proporciona estructura consistente para respuestas de servicios
 *
 * @template T - Tipo de datos retornados en caso de éxito
 */
export interface OperationResult<T = void> {
  /** Indica si la operación fue exitosa */
  success: boolean;

  /** Datos retornados (solo si success es true) */
  data?: T;

  /** Mensaje descriptivo del resultado */
  message?: string;

  /** Mensaje de error (solo si success es false) */
  error?: string;
}
