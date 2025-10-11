// src/features/shared/components/MainLayout/AppBarComponent.tsx
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brush as BrushIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { UserMenu } from './UserMenu';

interface AppBarComponentProps {
  /** Función para abrir/cerrar el drawer en mobile */
  onMenuClick: () => void;
}

/**
 * AppBarComponent - Barra superior de la aplicación
 *
 * Diseño cohesivo blanco según ui-ux-design-expert:
 * - Fondo blanco para cohesión con sidebar
 * - Altura: 64px
 * - Logo de Rainbow Painting con iconos de construcción
 * - Botón hamburguesa para mobile
 * - UserMenu con avatar en la derecha
 * - Borde inferior sutil para separación
 *
 * Diseño según MUI Theme Best Practices:
 * - Minimiza uso de `sx` props
 * - Usa theme.palette para colores
 * - Usa props nativos de MUI cuando es posible
 */
export const AppBarComponent: React.FC<AppBarComponentProps> = ({
  onMenuClick,
}) => {
  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Botón hamburguesa para mobile */}
        <IconButton
          aria-label="abrir menú"
          edge="start"
          onClick={onMenuClick}
          color="inherit"
          sx={{
            mr: 2,
            display: { md: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo con iconos de construcción */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: 40,
              height: 40,
            }}
          >
            <BrushIcon
              sx={{
                fontSize: 20,
                color: 'secondary.main',
                position: 'absolute',
                left: 0,
                transform: 'rotate(-15deg)',
                zIndex: 2,
              }}
            />
            <ConstructionIcon
              sx={{
                fontSize: 20,
                color: 'primary.main',
                position: 'absolute',
                right: 0,
                transform: 'rotate(15deg)',
                zIndex: 1,
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              fontWeight={700}
              color="text.primary"
              lineHeight={1.2}
              display={{ xs: 'none', sm: 'block' }}
            >
              Rainbow Painting
            </Typography>
            <Typography
              variant="caption"
              noWrap
              component="div"
              color="text.secondary"
              fontWeight={500}
              letterSpacing={0.5}
              display={{ xs: 'none', sm: 'block' }}
            >
              Sistema ERP de Gestión
            </Typography>
          </Box>
        </Box>

        {/* Espaciador */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Menú de usuario */}
        <UserMenu />
      </Toolbar>
    </MuiAppBar>
  );
};
