/**
 * Protected Route Component
 * Wraps routes that require authentication
 */

import { type ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Protected Route wrapper component
 * Ensures user is authenticated before rendering children
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated after loading
    if (!isLoading && !isAuthenticated) {
      // Store current location for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('redirectAfterLogin', currentPath);
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null; // Will redirect via useEffect
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No tienes el rol necesario ({requiredRole}) para acceder a esta página.
        </Typography>
      </Box>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No tienes los permisos necesarios para acceder a esta página.
        </Typography>
      </Box>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

/**
 * HOC for protecting components
 * Wraps a component with authentication check
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: string;
    requiredPermission?: string;
    redirectTo?: string;
  }
) => {
  return (props: P) => {
    return (
      <ProtectedRoute
        requiredRole={options?.requiredRole}
        requiredPermission={options?.requiredPermission}
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};