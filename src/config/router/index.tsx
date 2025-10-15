// src/config/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../../features/auth/store/authStore';

// Layout
import { MainLayout } from '../../features/shared/components/MainLayout';

// Páginas públicas
import { LandingPage } from '../../features/landing/pages';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { NotFoundPage } from '../../features/shared/pages/NotFoundPage';

// Páginas protegidas
import { DashboardPage } from '../../features/shared/pages/DashboardPage';

// Billing Module
import { ActualPayrollPage } from '../../features/billing/pages/ActualPayrollPage';
import { EmployeePayrollReportPage } from '../../features/billing/pages/EmployeePayrollReportPage';

// Work Module
import { LotsBySubdivisionPage } from '../../features/work/pages/LotsBySubdivisionPage';
import { WorkAssignmentPage } from '../../features/work/pages/WorkAssignmentPage';
import { WeeklySchedulePage } from '../../features/work/pages/WeeklySchedulePage';

// Users Module
import { UsersManagementPage } from '../../features/users/pages/UsersManagementPage';

// Roles Module
import { RolesManagementPage } from '../../features/roles/pages/RolesManagementPage';

/**
 * Configuración principal del router de la aplicación
 *
 * Estructura:
 * - Ruta pública raíz: / (Landing Page - accesible sin login)
 * - Ruta pública login: /portal (Employee Portal - requiere login)
 * - Rutas protegidas: /dashboard, /obras, etc. (envueltas en MainLayout)
 * - Ruta 404: Cualquier ruta no definida
 *
 * El usuario sin autenticar puede ver la landing page en /
 * El usuario autenticado es redirigido a /dashboard si intenta acceder a /portal
 */
export const router = createBrowserRouter([
  // Ruta raíz - Landing page pública
  {
    path: ROUTES.ROOT,
    element: <LandingPage />,
  },

  // Ruta de login del portal de empleados
  {
    path: ROUTES.LOGIN,
    element: <LoginRedirect />,
  },

  // Rutas protegidas (con MainLayout)
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // Módulo de Facturación
  {
    path: '/facturacion/actual',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ActualPayrollPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/facturacion/reporte',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EmployeePayrollReportPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // Módulo de Obras/Work
  {
    path: '/obras/lotes',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <LotsBySubdivisionPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/obras/asignacion',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <WorkAssignmentPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/obras/calendario',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <WeeklySchedulePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // Módulo de Usuarios
  {
    path: '/usuarios',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <UsersManagementPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // Módulo de Roles
  {
    path: '/roles',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <RolesManagementPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // TODO: Agregar más rutas de módulos aquí

  // Ruta 404 - Captura cualquier ruta no definida
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

/**
 * LoginRedirect - Componente que maneja el acceso a /portal
 *
 * - Si el usuario YA está autenticado → Redirige a /dashboard
 * - Si no está autenticado → Muestra la página de login
 */
function LoginRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    // Usuario ya autenticado, redirige al dashboard
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Usuario no autenticado, muestra login
  return <LoginPage />;
}
