/**
 * Custom hook for authentication
 * Provides a simplified interface to authentication state and actions
 */

import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import type { LoginDTO, User } from '../models';

/**
 * Authentication hook return type
 */
interface UseAuthReturn {
  // State
  /** Current authenticated user */
  user: User | null;
  /** Authentication token */
  token: string | null;
  /** Authentication status */
  isAuthenticated: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;

  // Actions
  /** Login with credentials */
  login: (credentials: LoginDTO) => Promise<void>;
  /** Logout user */
  logout: () => void;
  /** Clear error message */
  clearError: () => void;
  /** Verify authentication status */
  verifyAuth: () => Promise<boolean>;
  /** Refresh auth state from localStorage */
  refreshAuth: () => void;

  // Computed values
  /** Check if user has specific role */
  hasRole: (role: string) => boolean;
  /** Check if user has specific permission */
  hasPermission: (permission: string) => boolean;
  /** Get user display name */
  displayName: string;
  /** Get user initials for avatar */
  initials: string;
}

/**
 * Custom hook for authentication management
 * @returns Authentication state and actions
 */
export const useAuth = (): UseAuthReturn => {
  // Get state and actions from store
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    initializeAuth,
    verifyAuthentication,
    refreshAuthState
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false;

      // Check multiple possible role field names for compatibility
      const userRole = user.role || user.rol || (user as any).RoleName;
      if (!userRole) return false;

      // Exact match or check if user has admin role (admin has all permissions)
      return userRole.toLowerCase() === role.toLowerCase() ||
             userRole.toLowerCase() === 'admin';
    },
    [user]
  );

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;

      // Admin has all permissions
      const userRole = user.role || user.rol || (user as any).RoleName;
      if (userRole?.toLowerCase() === 'admin') return true;

      // Check permissions array if exists
      if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
      }

      return false;
    },
    [user]
  );

  /**
   * Get user display name
   * Supports multiple field naming conventions:
   * - Spanish: nombre
   * - PascalCase: FirstName, LastName (backend format)
   * - camelCase: firstName, lastName
   */
  const displayName = user
    ? user.nombre ||
      `${(user as any).FirstName || user.firstName || ''} ${(user as any).LastName || user.lastName || ''}`.trim() ||
      user.email ||
      'Usuario'
    : '';

  /**
   * Get user initials for avatar
   * Supports multiple field naming conventions:
   * - Spanish: nombre
   * - PascalCase: FirstName, LastName (backend format)
   * - camelCase: firstName, lastName
   */
  const initials = (() => {
    if (!user) return '';

    // Try to get initials from nombre (full name in Spanish)
    if (user.nombre) {
      const parts = user.nombre.split(' ').filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0]?.substring(0, 2).toUpperCase() || '';
    }

    // Try FirstName and LastName (PascalCase - backend format)
    const firstName = (user as any).FirstName || user.firstName;
    const lastName = (user as any).LastName || user.lastName;

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    // Fallback: single name (use first 2 letters)
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }

    // Fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return 'U';
  })();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    logout,
    clearError,
    verifyAuth: verifyAuthentication,
    refreshAuth: refreshAuthState,

    // Computed values
    hasRole,
    hasPermission,
    displayName,
    initials
  };
};

/**
 * Hook for protected routes
 * Redirects to login if not authenticated
 */
export const useRequireAuth = (redirectUrl = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store current location for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== redirectUrl) {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }

      // Redirect to login
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirectUrl]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook for guest routes
 * Redirects to home if already authenticated
 */
export const useGuestOnly = (redirectUrl = '/home') => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check for stored redirect URL
      const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
      if (storedRedirect) {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = storedRedirect;
      } else {
        window.location.href = redirectUrl;
      }
    }
  }, [isAuthenticated, isLoading, redirectUrl]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook for role-based access
 * @param requiredRole - Role required to access
 * @param redirectUrl - URL to redirect if access denied
 */
export const useRequireRole = (requiredRole: string, redirectUrl = '/unauthorized') => {
  const { user, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !hasRole(requiredRole)) {
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, user, requiredRole, hasRole, redirectUrl]);

  return hasRole(requiredRole);
};

/**
 * Hook for permission-based access
 * @param requiredPermission - Permission required to access
 * @param redirectUrl - URL to redirect if access denied
 */
export const useRequirePermission = (requiredPermission: string, redirectUrl = '/unauthorized') => {
  const { user, isAuthenticated, hasPermission } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !hasPermission(requiredPermission)) {
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, user, requiredPermission, hasPermission, redirectUrl]);

  return hasPermission(requiredPermission);
};