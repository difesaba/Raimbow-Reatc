/**
 * Unit tests for Authentication Service
 * NOTE: Tests are commented out because vitest is not installed
 */

// import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// import { apiService } from '@/config/services/apiService';
// import type { LoginDTO, AuthResponse, User } from '../../models';
// import {
//   login,
//   logout,
//   verifyToken,
//   getCurrentUser,
//   getToken,
//   isAuthenticated,
//   register,
//   requestPasswordReset,
//   changePassword
// } from './authService';

// // Mock apiService
// vi.mock('@/config/services/apiService', () => ({
//   apiService: {
//     get: vi.fn(),
//     post: vi.fn(),
//     put: vi.fn(),
//     delete: vi.fn()
//   }
// }));

// // Mock localStorage
// const localStorageMock = (() => {
//   let store: Record<string, string> = {};

//   return {
//     getItem: (key: string) => store[key] || null,
//     setItem: (key: string, value: string) => {
//       store[key] = value.toString();
//     },
//     removeItem: (key: string) => {
//       delete store[key];
//     },
//     clear: () => {
//       store = {};
//     }
//   };
// })();

// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// describe('AuthService', () => {
//   beforeEach(() => {
//     // Clear localStorage before each test
//     localStorageMock.clear();
//     // Clear all mocks
//     vi.clearAllMocks();
//   });

//   afterEach(() => {
//     vi.clearAllMocks();
//   });

//   describe('login', () => {
//     it('should successfully login user and store token and user data', async () => {
//       const credentials: LoginDTO = {
//         email: 'test@example.com',
//         password: 'password123'
//       };

//       const mockResponse: AuthResponse = {
//         token: 'mock-jwt-token',
//         user: {
//           id: '1',
//           email: 'test@example.com',
//           nombre: 'Test User',
//           role: 'admin'
//         }
//       };

//       // Mock successful API response
//       (apiService.post as any).mockResolvedValue({ data: mockResponse });

//       const result = await login(credentials);

//       // Verify API call
//       expect(apiService.post).toHaveBeenCalledWith('/api/auth/login', credentials);

//       // Verify result
//       expect(result.success).toBe(true);
//       expect(result.data).toEqual(mockResponse);
//       expect(result.message).toBe('Login successful');

//       // Verify localStorage
//       expect(localStorage.getItem('x-token')).toBe('mock-jwt-token');
//       expect(JSON.parse(localStorage.getItem('log-user') || '{}')).toEqual(mockResponse);
//     });

//     it('should handle login error with backend message', async () => {
//       const credentials: LoginDTO = {
//         email: 'test@example.com',
//         password: 'wrong-password'
//       };

//       const errorResponse = {
//         response: {
//           data: {
//             msg: 'Invalid credentials'
//           }
//         }
//       };

//       // Mock failed API response
//       (apiService.post as any).mockRejectedValue(errorResponse);

//       const result = await login(credentials);

//       // Verify result
//       expect(result.success).toBe(false);
//       expect(result.error).toBe('Invalid credentials');
//       expect(result.message).toBe('Login failed');

//       // Verify localStorage is not modified
//       expect(localStorage.getItem('x-token')).toBeNull();
//       expect(localStorage.getItem('log-user')).toBeNull();
//     });
//   });

//   describe('logout', () => {
//     it('should clear token and user data from localStorage', () => {
//       // Setup initial authenticated state
//       localStorage.setItem('x-token', 'mock-token');
//       localStorage.setItem('log-user', JSON.stringify({ user: 'data' }));

//       // Perform logout
//       logout();

//       // Verify localStorage is cleared
//       expect(localStorage.getItem('x-token')).toBeNull();
//       expect(localStorage.getItem('log-user')).toBeNull();
//     });
//   });

//   describe('verifyToken', () => {
//     it('should return false when no token exists', async () => {
//       const result = await verifyToken();

//       expect(result.success).toBe(true);
//       expect(result.data).toBe(false);
//       expect(result.message).toBe('No authentication token found');
//     });

//     it('should return true when token exists', async () => {
//       localStorage.setItem('x-token', 'mock-token');

//       const result = await verifyToken();

//       expect(result.success).toBe(true);
//       expect(result.data).toBe(true);
//       expect(result.message).toBe('Token exists (not verified with backend)');
//     });
//   });

//   describe('getCurrentUser', () => {
//     it('should return null when no user data exists', () => {
//       const user = getCurrentUser();
//       expect(user).toBeNull();
//     });

//     it('should return user object from stored AuthResponse', () => {
//       const storedData: AuthResponse = {
//         token: 'mock-token',
//         user: {
//           id: '1',
//           email: 'test@example.com',
//           nombre: 'Test User'
//         }
//       };

//       localStorage.setItem('log-user', JSON.stringify(storedData));

//       const user = getCurrentUser();
//       expect(user).toEqual(storedData.user);
//     });

//     it('should handle stored data that is directly a user object', () => {
//       const userData: User = {
//         id: '1',
//         email: 'test@example.com',
//         nombre: 'Test User'
//       };

//       localStorage.setItem('log-user', JSON.stringify(userData));

//       const user = getCurrentUser();
//       expect(user).toEqual(userData);
//     });

//     it('should remove token from user object if present', () => {
//       const userData = {
//         id: '1',
//         email: 'test@example.com',
//         nombre: 'Test User',
//         token: 'should-be-removed'
//       };

//       localStorage.setItem('log-user', JSON.stringify(userData));

//       const user = getCurrentUser();
//       expect(user).not.toHaveProperty('token');
//       expect(user?.id).toBe('1');
//     });
//   });

//   describe('getToken', () => {
//     it('should return null when no token exists', () => {
//       const token = getToken();
//       expect(token).toBeNull();
//     });

//     it('should return token when it exists', () => {
//       localStorage.setItem('x-token', 'mock-token');

//       const token = getToken();
//       expect(token).toBe('mock-token');
//     });
//   });

//   describe('isAuthenticated', () => {
//     it('should return false when no token exists', () => {
//       expect(isAuthenticated()).toBe(false);
//     });

//     it('should return true when token exists', () => {
//       localStorage.setItem('x-token', 'mock-token');
//       expect(isAuthenticated()).toBe(true);
//     });
//   });

//   describe('register', () => {
//     it('should successfully register user and auto-login', async () => {
//       const userData = {
//         email: 'new@example.com',
//         password: 'password123',
//         nombre: 'New User'
//       };

//       const mockResponse: AuthResponse = {
//         token: 'new-user-token',
//         user: {
//           id: '2',
//           email: 'new@example.com',
//           nombre: 'New User'
//         }
//       };

//       (apiService.post as any).mockResolvedValue({ data: mockResponse });

//       const result = await register(userData);

//       expect(apiService.post).toHaveBeenCalledWith('/api/auth/register', userData);
//       expect(result.success).toBe(true);
//       expect(result.data).toEqual(mockResponse);

//       // Verify auto-login
//       expect(localStorage.getItem('x-token')).toBe('new-user-token');
//     });
//   });

//   describe('requestPasswordReset', () => {
//     it('should successfully send password reset request', async () => {
//       const resetData = { email: 'test@example.com' };

//       (apiService.post as any).mockResolvedValue({ data: { success: true } });

//       const result = await requestPasswordReset(resetData);

//       expect(apiService.post).toHaveBeenCalledWith('/api/auth/password-reset', resetData);
//       expect(result.success).toBe(true);
//       expect(result.message).toBe('Password reset email sent successfully');
//     });
//   });

//   describe('changePassword', () => {
//     it('should successfully change password', async () => {
//       const passwordData = {
//         currentPassword: 'old-password',
//         newPassword: 'new-password',
//         confirmPassword: 'new-password'
//       };

//       (apiService.post as any).mockResolvedValue({ data: { success: true } });

//       const result = await changePassword(passwordData);

//       expect(apiService.post).toHaveBeenCalledWith('/api/auth/change-password', passwordData);
//       expect(result.success).toBe(true);
//       expect(result.message).toBe('Password changed successfully');
//     });
//   });
// });

export {}; // Mantener como módulo TypeScript