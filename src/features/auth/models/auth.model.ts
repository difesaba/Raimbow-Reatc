/**
 * Authentication models and DTOs
 *
 * WARNING: These interfaces are ASSUMPTIONS based on the legacy code.
 * They MUST be verified against actual API responses.
 */

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
 * ASSUMPTION: Complete user structure to be verified with backend response
 * Based on localStorage 'log-user' data
 */
export interface User {
  /** Unique user identifier */
  id?: string;
  /** User email address */
  email?: string;
  /** User full name */
  nombre?: string;
  /** User first name */
  firstName?: string;
  /** User last name */
  lastName?: string;
  /** User role (admin, supervisor, operator, etc.) */
  rol?: string;
  /** Alternative role field */
  role?: string;
  /** User department or area */
  department?: string;
  /** User phone number */
  phone?: string;
  /** Account active status */
  isActive?: boolean;
  /** Account creation date */
  createdAt?: string;
  /** Last update date */
  updatedAt?: string;
  /** Last login date */
  lastLogin?: string;
  /** User permissions */
  permissions?: string[];
  /** Company/Organization ID */
  companyId?: string;
  /** Branch/Office ID */
  branchId?: string;
  /** Additional user properties */
  [key: string]: any;
}

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