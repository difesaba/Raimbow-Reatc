/**
 * Authentication models and DTOs
 *
 * WARNING: These interfaces are ASSUMPTIONS based on the legacy code.
 * They MUST be verified against actual API responses.
 */

// Import User interface from users module (matches backend structure)
import type { User } from '../../users/interfaces/user.interfaces';

/**
 * Login request DTO
 * Based on legacy code: { email: string, password: string }
 */
export interface LoginDTO {
  /** User email address */
  email: string;
  /** User password (plain text, will be hashed by backend) */
  password: string;
}

/**
 * Authentication response from the API
 * Based on legacy code: response.data containing token and user data
 *
 * ASSUMPTION: The exact structure needs to be verified with real API
 */
export interface AuthResponse {
  /** JWT authentication token */
  token: string;
  /** User information */
  user?: User;
  /** User role/permissions */
  role?: string;
  /** Permissions array */
  permissions?: string[];
  /** Success message */
  message?: string;
  /** Additional fields from backend */
  [key: string]: any;
}

/**
 * User entity model
 *
 * NOTE: User interface is now imported from users module to ensure consistency
 * with backend structure (UserId, FirstName, LastName, etc.)
 * The old interface with id, email, nombre fields was outdated.
 */
// export interface User - REMOVED, now imported from users module

/**
 * Token verification response
 * Used when validating token with backend
 */
export interface TokenVerificationResponse {
  /** Token validity status */
  valid: boolean;
  /** User data if token is valid */
  user?: User;
  /** Error message if token is invalid */
  error?: string;
  /** Token expiration time */
  expiresAt?: string;
}

/**
 * Password reset request DTO
 * For future implementation
 */
export interface PasswordResetDTO {
  /** User email for password reset */
  email: string;
}

/**
 * Password change DTO
 * For future implementation
 */
export interface PasswordChangeDTO {
  /** Current password */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** Password confirmation */
  confirmPassword: string;
}

/**
 * Register user DTO
 * For future implementation
 */
export interface RegisterDTO {
  /** User email */
  email: string;
  /** User password */
  password: string;
  /** User full name */
  nombre: string;
  /** User role */
  role?: string;
  /** Additional registration fields */
  [key: string]: any;
}