// src/features/shared/components/MainLayout/UserMenu.tsx
import { useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import { ROUTES } from '../../../../config/router/routes';

/**
 * UserMenu - Menú de usuario con avatar y opciones
 *
 * Diseño según ui-ux-design-expert:
 * - Avatar con iniciales del usuario
 * - Dropdown con opciones de perfil y logout
 * - Animaciones suaves de entrada/salida
 */
export const UserMenu: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, displayName, initials, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    // TODO: Navegar a página de perfil cuando esté implementada
    console.log('Ir a perfil');
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ml: 2,
          transition: theme.transitions.create(['transform', 'background-color']),
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          {initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 2,
              overflow: 'visible',
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
      >
        {/* Header del menú con info del usuario */}
        <Box sx={{ px: 2, py: 1.5, pb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Opciones del menú */}
        <MenuItem
          onClick={handleProfile}
          sx={{
            py: 1.5,
            px: 2,
            transition: theme.transitions.create('background-color'),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mi Perfil</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            color: theme.palette.error.main,
            transition: theme.transitions.create('background-color'),
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText>Cerrar Sesión</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
