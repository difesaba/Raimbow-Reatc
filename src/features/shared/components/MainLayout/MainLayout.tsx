// src/features/shared/components/MainLayout/MainLayout.tsx
import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { AppBarComponent } from './AppBarComponent';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 280;

/**
 * MainLayout - Layout principal de la aplicación
 *
 * Arquitectura según ui-ux-design-expert:
 * - AppBar fijo en la parte superior
 * - Sidebar permanente (desktop) / temporal (mobile)
 * - Contenido principal con padding responsive
 * - Ancho del drawer: 280px
 *
 * Responsividad:
 * - Desktop (≥960px): Sidebar permanente
 * - Mobile (<960px): Sidebar temporal con botón hamburguesa
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar superior */}
      <AppBarComponent
        onMenuClick={handleDrawerToggle}
      />

      {/* Sidebar de navegación */}
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {/* Espaciador para el AppBar fijo */}
        <Toolbar sx={{ minHeight: 56 }} />

        {/* Contenido de la página */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 2.5 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
