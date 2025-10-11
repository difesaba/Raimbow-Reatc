import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// Lazy load del componente principal
const UsersManagementPage = lazy(() =>
  import('../pages/UsersManagementPage').then(module => ({
    default: module.UsersManagementPage
  }))
);

/**
 * 🚦 Configuración de rutas para el módulo de usuarios
 */
export const UsersRoutes = () => {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      }
    >
      <Routes>
        {/* Ruta principal de administración de usuarios */}
        <Route path="/" element={<UsersManagementPage />} />

        {/* Futuras rutas pueden agregarse aquí */}
        {/* <Route path="/:id" element={<UserDetailsPage />} /> */}
        {/* <Route path="/roles" element={<RolesManagementPage />} /> */}
        {/* <Route path="/permissions" element={<PermissionsPage />} /> */}
      </Routes>
    </Suspense>
  );
};

/**
 * Configuración de ruta para el router principal
 */
export const usersRoute = {
  path: '/users/*',
  element: <UsersRoutes />
};