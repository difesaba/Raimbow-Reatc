// src/features/shared/components/MainLayout/Sidebar.tsx
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Engineering as EngineeringIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Analytics as AnalyticsIcon,
  Today as TodayIcon,
  PersonSearch as PersonSearchIcon,
  Apartment as ApartmentIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  CalendarMonth as CalendarMonthIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config/router/routes';

interface SidebarProps {
  /** Ancho del drawer */
  drawerWidth: number;
  /** Si el drawer está abierto (mobile) */
  mobileOpen: boolean;
  /** Función para cerrar el drawer (mobile) */
  onClose: () => void;
}

interface NavItem {
  text: string;
  icon: React.ReactElement;
  path?: string;
  disabled?: boolean;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: ROUTES.DASHBOARD,
  },
  {
    text: 'Obras',
    icon: <EngineeringIcon />,
    children: [
      {
        text: 'Lotes por Subdivisión',
        icon: <ApartmentIcon />,
        path: '/obras/lotes',
      },
      {
        text: 'Asignación de Trabajo',
        icon: <TodayIcon />,
        path: '/obras/asignacion',
      },
      {
        text: 'Calendario Semanal',
        icon: <CalendarMonthIcon />,
        path: '/obras/calendario',
      },
    ],
  },
  {
    text: 'Contratos',
    icon: <DescriptionIcon />,
    path: '/contratos',
    disabled: true, // TODO: Habilitar cuando esté implementado
  },
  {
    text: 'Facturación',
    icon: <ReceiptIcon />,
    children: [
      {
        text: 'Nómina Actual',
        icon: <TodayIcon />,
        path: '/facturacion/actual',
      },
      {
        text: 'Reporte Individual',
        icon: <PersonSearchIcon />,
        path: '/facturacion/reporte',
      },
    ],
  },
  {
    text: 'Reportes',
    icon: <AnalyticsIcon />,
    path: '/reportes',
    disabled: true, // TODO: Habilitar cuando esté implementado
  },
  {
    text: 'Usuarios',
    icon: <PeopleIcon />,
    path: '/usuarios',
  },
  {
    text: 'Roles',
    icon: <SecurityIcon />,
    path: '/roles',
  },
];

/**
 * Sidebar - Menú lateral de navegación
 *
 * Diseño según ui-ux-design-expert:
 * - Ancho: 280px (desktop), full-width (mobile)
 * - Items con iconos + texto
 * - Hover state con fondo alpha(primary, 0.08)
 * - Active state con fondo primary y texto blanco
 * - Responsive: permanent (desktop) → temporary (mobile)
 *
 * Diseño según MUI Theme Best Practices:
 * - Minimiza uso de `sx` props
 * - Usa theme.palette para colores
 * - Usa props nativos cuando es posible
 */
export const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Obras: true, // Abrir Obras por defecto
    Facturación: true, // Abrir Facturación por defecto
  });

  const handleNavigation = (path: string, disabled?: boolean) => {
    if (disabled) return;
    navigate(path);
    // Cerrar drawer en mobile después de navegar
    if (mobileOpen) {
      onClose();
    }
  };

  const handleToggleMenu = (text: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  const drawerContent = (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Toolbar vacío para espaciado debajo del AppBar */}
      <Toolbar sx={{ minHeight: 56 }} />

      <Divider />

      {/* Menú de navegación */}
      <List sx={{ px: 1.5, py: 1.5 }}>
        {navItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus[item.text];
          const isActive = item.path ? location.pathname === item.path : false;

          return (
            <Box key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    if (hasChildren) {
                      handleToggleMenu(item.text);
                    } else if (item.path) {
                      handleNavigation(item.path, item.disabled);
                    }
                  }}
                  disabled={item.disabled}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.9375rem',
                    }}
                  />
                  {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {/* Submenú colapsable */}
              {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children!.map((child) => {
                      const isChildActive = child.path
                        ? location.pathname === child.path
                        : false;

                      return (
                        <ListItem
                          key={child.text}
                          disablePadding
                          sx={{ mb: 0.5 }}
                        >
                          <ListItemButton
                            onClick={() =>
                              child.path && handleNavigation(child.path, child.disabled)
                            }
                            disabled={child.disabled}
                            selected={isChildActive}
                            sx={{
                              borderRadius: 2,
                              py: 0.75,
                              pl: 6,
                              '&.Mui-selected': {
                                bgcolor: 'primary.light',
                                color: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                },
                                '& .MuiListItemIcon-root': {
                                  color: 'primary.main',
                                },
                              },
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 32,
                                color: isChildActive ? 'primary.main' : 'text.secondary',
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.text}
                              primaryTypographyProps={{
                                fontWeight: isChildActive ? 600 : 400,
                                fontSize: '0.875rem',
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      {/* Espaciador para empujar el footer al final */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Footer del sidebar */}
      <Box
        p={2}
        textAlign="center"
        borderTop={1}
        borderColor="divider"
      >
        <Typography variant="caption" color="text.secondary">
          Rainbow Painting ERP v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Drawer temporal para mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer permanente para desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};
