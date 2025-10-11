/**
 * Zustand store for authentication state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LoginDTO, User } from '../models';
import * as authService from '../services/authService';
import { showGlobalSuccess } from '@/features/shared/contexts';

/**
 * Authentication state interface
 */
interface AuthState {
  // State
  /** Current authenticated user */
  user: User | null;
  /** Current authentication token */
  token: string | null;
  /** Authentication status */
  isAuthenticated: boolean;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Error message from last operation */
  error: string | null;

  // Actions
  /** Authenticate user with credentials */
  login: (credentials: LoginDTO) => Promise<void>;
  /** Logout current user */
  logout: (silent?: boolean) => void;
  /** Set current user */
  setUser: (user: User | null) => void;
  /** Set authentication token */
  setToken: (token: string | null) => void;
  /** Initialize auth state from localStorage */
  initializeAuth: () => void;
  /** Clear error message */
  clearError: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Verify current token validity */
  verifyAuthentication: () => Promise<boolean>;
  /** Refresh authentication state from localStorage */
  refreshAuthState: () => void;
}

/**
 * Authentication store
 * Manages global authentication state with persistence
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        /**
         * Login user with credentials
         */
        login: async (credentials: LoginDTO) => {
          set({ isLoading: true, error: null });

          try {
            const result = await authService.login(credentials);

            if (result.success && result.data) {
              // Extract user and token from response
              const { token, user, ...restData } = result.data;

              // Determine user object
              const userData = user || restData;

              set({
                user: userData as User,
                token: token,
                isAuthenticated: true,
                isLoading: false,
                error: null
              });
            } else {
              set({
                isLoading: false,
                error: result.error || 'Login failed'
              });
            }
          } catch (error: any) {
            console.error('[AuthStore] Login error:', error);
            set({
              isLoading: false,
              error: error.message || 'An unexpected error occurred'
            });
          }
        },

        /**
         * Logout current user
         * @param silent - Si es true, no muestra notificación (para logout automático por sesión expirada)
         */
        logout: (silent = false) => {
          // Clear service-level storage
          authService.logout();

          // Clear store state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
          });

          // Show success notification only for manual logout
          if (!silent) {
            showGlobalSuccess('Sesión cerrada exitosamente', 3000);
          }
        },

        /**
         * Set current user
         */
        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user
          });
        },

        /**
         * Set authentication token
         */
        setToken: (token: string | null) => {
          set({
            token,
            isAuthenticated: !!token
          });
        },

        /**
         * Initialize authentication state from localStorage
         * Called on app startup
         */
        initializeAuth: () => {
          try {
            const token = authService.getToken();
            const user = authService.getCurrentUser();

            if (token && user) {
              set({
                user,
                token,
                isAuthenticated: true,
                error: null
              });
            } else if (token || user) {
              // Partial data found - clear for consistency
              console.warn('[AuthStore] Partial auth data found, clearing...');
              authService.logout();
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null
              });
            }
          } catch (error) {
            console.error('[AuthStore] Initialization error:', error);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: 'Failed to initialize authentication'
            });
          }
        },

        /**
         * Clear error message
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Set loading state
         */
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        /**
         * Verify authentication status
         * Checks if token is still valid
         */
        verifyAuthentication: async () => {
          const state = get();

          // No token to verify
          if (!state.token) {
            set({ isAuthenticated: false });
            return false;
          }

          try {
            const result = await authService.verifyToken();

            if (result.success && result.data) {
              // Token is valid
              return true;
            } else {
              // Token is invalid - clear auth state
              get().logout();
              return false;
            }
          } catch (error) {
            console.error('[AuthStore] Token verification error:', error);
            get().logout();
            return false;
          }
        },

        /**
         * Refresh authentication state from localStorage
         * Useful after external changes to localStorage
         */
        refreshAuthState: () => {
          const token = authService.getToken();
          const user = authService.getCurrentUser();

          set({
            user,
            token,
            isAuthenticated: !!token && !!user
          });
        }
      }),
      {
        name: 'auth-store', // localStorage key for persistence
        partialize: (_state) => ({
          // Don't persist isAuthenticated - it should be derived from localStorage
          // Token and user are already in localStorage via authService
          // This ensures state is always in sync with localStorage
        })
      }
    ),
    {
      name: 'AuthStore' // Redux DevTools name
    }
  )
);

/**
 * Selector hooks for specific state slices
 * Use these for optimized re-renders
 */
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthStatus = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

/**
 * Action hooks for auth operations
 * Use these to access actions without subscribing to state
 */
export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const verifyAuthentication = useAuthStore((state) => state.verifyAuthentication);
  const refreshAuthState = useAuthStore((state) => state.refreshAuthState);

  return {
    login,
    logout,
    clearError,
    initializeAuth,
    verifyAuthentication,
    refreshAuthState
  };
};