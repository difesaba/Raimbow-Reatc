/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */

import { apiService } from '@/config/services/apiService';
import type {
  LoginDTO,
  AuthResponse,
  User,
  OperationResult,
  PasswordResetDTO,
  PasswordChangeDTO,
  RegisterDTO
} from '../../models';

/**
 * Local storage keys for authentication data
 */
const STORAGE_KEYS = {
  TOKEN: 'x-token',
  USER: 'log-user'
} as const;

/**
 * Authenticate user with email and password
 * @param credentials - User login credentials
 * @returns Operation result with authentication response
 */
export const login = async (credentials: LoginDTO): Promise<OperationResult<AuthResponse>> => {
  try {
    // Call authentication endpoint
    const response = await apiService.post('/api/auth/login', credentials);
    const authData = response.data as AuthResponse;

    // Store token in localStorage
    if (authData.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
    }

    // Store complete user data in localStorage
    // Legacy behavior: stores entire response object
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData));

    return {
      success: true,
      data: authData,
      message: 'Login successful'
    };
  } catch (error: any) {
    console.error('[AuthService] Login error:', error);

    // Extract error message from backend response
    // Based on legacy code: error.response.data.msg
    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Authentication failed';

    return {
      success: false,
      error: errorMessage,
      message: 'Login failed'
    };
  }
};

/**
 * Logout user and clear authentication data
 * Synchronous operation - no API call required
 */
export const logout = (): void => {
  try {
    // Clear token from localStorage
    localStorage.removeItem(STORAGE_KEYS.TOKEN);

    // Clear user data from localStorage
    localStorage.removeItem(STORAGE_KEYS.USER);

    // Optional: Clear any other auth-related data
    // Could also call a logout endpoint if backend tracks sessions
    console.log('[AuthService] User logged out successfully');
  } catch (error) {
    console.error('[AuthService] Logout error:', error);
  }
};

/**
 * Verify if the current token is valid
 * @returns Operation result indicating token validity
 */
export const verifyToken = async (): Promise<OperationResult<boolean>> => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    // No token found
    if (!token) {
      return {
        success: true,
        data: false,
        message: 'No authentication token found'
      };
    }

    // Optional: Verify token with backend
    // Uncomment when endpoint is available
    /*
    try {
      const response = await apiService.get('/api/auth/verify');
      const verificationData = response.data as TokenVerificationResponse;

      return {
        success: true,
        data: verificationData.valid,
        message: verificationData.valid ? 'Token is valid' : 'Token is invalid'
      };
    } catch (verifyError) {
      // Token verification failed - treat as invalid
      return {
        success: true,
        data: false,
        message: 'Token verification failed'
      };
    }
    */

    // For now, just check if token exists
    // This is a simplified check - real implementation should verify with backend
    return {
      success: true,
      data: true,
      message: 'Token exists (not verified with backend)'
    };
  } catch (error: any) {
    console.error('[AuthService] Token verification error:', error);

    return {
      success: false,
      error: error.message || 'Token verification failed',
      message: 'Error verifying token'
    };
  }
};

/**
 * Get current authenticated user from localStorage
 * @returns Current user object or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  try {
    const userDataString = localStorage.getItem(STORAGE_KEYS.USER);

    if (!userDataString) {
      return null;
    }

    const userData = JSON.parse(userDataString);

    // Extract user object from stored data
    // The stored data might be the full AuthResponse or just the user
    const user = userData.user || userData;

    // Remove token from user object if present
    if (user.token) {
      const { token, ...userWithoutToken } = user;
      return userWithoutToken as User;
    }

    return user as User;
  } catch (error) {
    console.error('[AuthService] Error getting current user:', error);
    return null;
  }
};

/**
 * Get authentication token from localStorage
 * @returns Current token or null if not authenticated
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('[AuthService] Error getting token:', error);
    return null;
  }
};

/**
 * Check if user is currently authenticated
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

/**
 * Register a new user (for future implementation)
 * @param userData - New user registration data
 * @returns Operation result with authentication response
 */
export const register = async (userData: RegisterDTO): Promise<OperationResult<AuthResponse>> => {
  try {
    const response = await apiService.post('/api/auth/register', userData);
    const authData = response.data as AuthResponse;

    // Auto-login after successful registration
    if (authData.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData));
    }

    return {
      success: true,
      data: authData,
      message: 'Registration successful'
    };
  } catch (error: any) {
    console.error('[AuthService] Registration error:', error);

    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Registration failed';

    return {
      success: false,
      error: errorMessage,
      message: 'Registration failed'
    };
  }
};

/**
 * Request password reset (for future implementation)
 * @param data - Password reset request data
 * @returns Operation result
 */
export const requestPasswordReset = async (data: PasswordResetDTO): Promise<OperationResult<void>> => {
  try {
    await apiService.post('/api/auth/password-reset', data);

    return {
      success: true,
      message: 'Password reset email sent successfully'
    };
  } catch (error: any) {
    console.error('[AuthService] Password reset request error:', error);

    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Password reset request failed';

    return {
      success: false,
      error: errorMessage,
      message: 'Failed to send password reset email'
    };
  }
};

/**
 * Change user password (for future implementation)
 * @param data - Password change data
 * @returns Operation result
 */
export const changePassword = async (data: PasswordChangeDTO): Promise<OperationResult<void>> => {
  try {
    await apiService.post('/api/auth/change-password', data);

    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error: any) {
    console.error('[AuthService] Password change error:', error);

    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Password change failed';

    return {
      success: false,
      error: errorMessage,
      message: 'Failed to change password'
    };
  }
};

/**
 * Refresh authentication token (for future implementation)
 * @returns Operation result with new token
 */
export const refreshToken = async (): Promise<OperationResult<string>> => {
  try {
    const response = await apiService.post('/api/auth/refresh');
    const newToken = response.data.token;

    if (newToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    }

    return {
      success: true,
      data: newToken,
      message: 'Token refreshed successfully'
    };
  } catch (error: any) {
    console.error('[AuthService] Token refresh error:', error);

    return {
      success: false,
      error: error.message || 'Token refresh failed',
      message: 'Failed to refresh token'
    };
  }
};