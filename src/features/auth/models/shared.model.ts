/**
 * Shared models and utility types for authentication module
 */

/**
 * Generic operation result wrapper for service responses
 * @template T - The type of data returned on successful operations
 */
export interface OperationResult<T = void> {
  /** Indicates whether the operation was successful */
  success: boolean;
  /** Data returned on successful operations */
  data?: T;
  /** Error message if the operation failed */
  error?: string;
  /** User-friendly message about the operation result */
  message?: string;
}

/**
 * Standard error response structure from the backend
 * Based on legacy code: error.response.data.msg
 */
export interface ErrorResponse {
  /** Error message from the backend */
  msg?: string;
  /** Alternative error message field */
  message?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Additional error details */
  errors?: Record<string, any>;
}

/**
 * Token payload structure (decoded JWT)
 * ASSUMPTION: Structure to be verified with actual JWT payload
 */
export interface TokenPayload {
  /** User ID */
  id?: string;
  /** User email */
  email?: string;
  /** User role */
  role?: string;
  /** Token issued at timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
  /** Additional claims */
  [key: string]: any;
}