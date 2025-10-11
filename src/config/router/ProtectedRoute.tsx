// src/config/router/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { ROUTES } from './routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Componente HOC que protege rutas que requieren autenticación
 *
 * Usa el authStore de Zustand para verificar si el usuario está autenticado.
 * Si no está autenticado, redirige al login.
 * Si está autenticado, permite el acceso al children (la página protegida).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Si está autenticado, permite acceso
  return <>{children}</>;
};
