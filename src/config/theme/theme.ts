// src/config/theme/theme.ts
import { createTheme, alpha } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

// Declaración de módulo para extender el tema con propiedades personalizadas
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    construction: {
      concrete: string;
      steel: string;
      wood: string;
      safety: string;
      blueprint: string;
    };
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    construction?: {
      concrete?: string;
      steel?: string;
      wood?: string;
      safety?: string;
      blueprint?: string;
    };
  }
}

// Colores base corporativos
const colors = {
  // Azul Estructural - Confianza, profesionalismo, planos arquitectónicos
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0', // Principal
    900: '#0D47A1',
  },

  // Naranja Seguridad - Energía controlada, visibilidad, acción
  secondary: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00', // Principal
    800: '#EF6C00',
    900: '#E65100',
  },

  // Grises Industriales - Concreto, acero, profesionalismo
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Colores semánticos profesionales
  success: '#2E7D32', // Verde cemento - finalización exitosa
  warning: '#ED6C02', // Naranja amarillento - precaución en obra
  error: '#C62828',   // Rojo estructural - problemas críticos
  info: '#0288D1',    // Azul técnico - información técnica

  // Paleta construcción - Colores sutiles Rainbow
  construction: {
    concrete: '#8D8D8D',  // Gris concreto
    steel: '#4A5568',     // Gris acero
    wood: '#8D6E63',      // Marrón madera
    safety: '#FF6F00',    // Naranja seguridad
    blueprint: '#1A237E', // Azul plano
  }
};

// Configuración base compartida
const baseThemeConfig: ThemeOptions = {
  typography: {
    // Inter: Moderna, profesional, excelente para datos
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',

    // Escala tipográfica para jerarquía clara
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '0.875rem', // 14px - Óptimo para ERPs
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem', // 13px
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02857em',
      textTransform: 'none', // Sin mayúsculas, más moderno
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.6875rem', // 11px
      fontWeight: 500,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },

  // Sistema de espaciado basado en 8px
  spacing: 8,

  // Breakpoints para responsive design
  breakpoints: {
    values: {
      xs: 0,     // Móvil
      sm: 600,   // Tablet vertical
      md: 960,   // Tablet horizontal
      lg: 1280,  // Desktop
      xl: 1920,  // Desktop grande
    },
  },

  // Forma y bordes
  shape: {
    borderRadius: 6, // Bordes sutiles, profesionales
  },
};

// TEMA LIGHT MODE
export const lightTheme = createTheme({
  ...baseThemeConfig,
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[800],
      light: colors.primary[600],
      dark: colors.primary[900],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.secondary[700],
      light: colors.secondary[500],
      dark: colors.secondary[900],
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.error,
      light: '#EF5350',
      dark: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: colors.warning,
      light: '#FF9800',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    success: {
      main: colors.success,
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    info: {
      main: colors.info,
      light: '#03A9F4',
      dark: '#01579B',
      contrastText: '#FFFFFF',
    },
    grey: colors.neutral,
    background: {
      default: '#F8F9FA', // Fondo muy suave
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[700],
      disabled: colors.neutral[500],
    },
    divider: colors.neutral[200],
    neutral: colors.neutral as any,
    construction: colors.construction,
  },

  components: {
    // BOTONES - Tamaño medium por defecto
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Más moderno sin sombras
        // NO size prop - usa default (medium)
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          minHeight: 36,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },

    // CAMPOS DE TEXTO - Size small
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: 40,
          },
        },
      },
    },

    // AUTOCOMPLETE - Size small
    MuiAutocomplete: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: 40,
            padding: '4px 9px',
          },
        },
      },
    },

    // PAPER - Elevaciones sutiles
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: colors.neutral[200],
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 2px 6px 0 rgba(0,0,0,0.10)',
        },
        elevation3: {
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.12)',
        },
      },
    },

    // CARDS - Diseño limpio
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: 8,
        },
      },
    },

    // CHIP - Estilo moderno
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },

    // TABLA - Optimizada para datos
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.neutral[200]}`,
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: colors.neutral[50],
          color: colors.neutral[700],
        },
      },
    },

    // DRAWER - Navegación lateral
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.neutral[200]}`,
          backgroundColor: '#FFFFFF',
        },
      },
    },

    // APP BAR - Header profesional
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.neutral[200]}`,
          backgroundColor: '#FFFFFF',
          color: colors.neutral[900],
        },
      },
    },

    // TABS - Navegación clara
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },

    // TOOLTIP - Información contextual
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.neutral[900],
          fontSize: '0.75rem',
          fontWeight: 400,
        },
      },
    },

    // ALERT - Mensajes de estado
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.success, 0.08),
          color: colors.success,
          '& .MuiAlert-icon': {
            color: colors.success,
          },
        },
        standardError: {
          backgroundColor: alpha(colors.error, 0.08),
          color: colors.error,
          '& .MuiAlert-icon': {
            color: colors.error,
          },
        },
        standardWarning: {
          backgroundColor: alpha(colors.warning, 0.08),
          color: colors.warning,
          '& .MuiAlert-icon': {
            color: colors.warning,
          },
        },
        standardInfo: {
          backgroundColor: alpha(colors.info, 0.08),
          color: colors.info,
          '& .MuiAlert-icon': {
            color: colors.info,
          },
        },
      },
    },

    // DIALOG - Ventanas modales
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)',
        },
      },
    },

    // BREADCRUMBS - Navegación jerárquica
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },

    // DIVIDER - Separadores sutiles
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.neutral[200],
        },
      },
    },

    // SELECT - Dropdowns
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          minHeight: 40,
        },
      },
    },

    // SKELETON - Loading states
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: colors.neutral[100],
        },
      },
    },
  },
}, esES); // Localización español

// TEMA DARK MODE
export const darkTheme = createTheme({
  ...baseThemeConfig,
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: colors.neutral[900],
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[600],
      contrastText: colors.neutral[900],
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: colors.neutral[900],
    },
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#4CAF50',
      contrastText: colors.neutral[900],
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
      contrastText: colors.neutral[900],
    },
    grey: colors.neutral,
    background: {
      default: '#0F1419', // Fondo oscuro profesional
      paper: '#1A1F27',
    },
    text: {
      primary: '#E1E8ED',
      secondary: '#9CA3AF',
      disabled: '#6B7280',
    },
    divider: alpha('#E1E8ED', 0.12),
    neutral: colors.neutral as any,
    construction: {
      ...colors.construction,
      concrete: '#A0A0A0',
      steel: '#6B7280',
    },
  },

  components: {
    // BOTONES - Adaptados para dark mode
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          minHeight: 36,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.4)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: alpha('#E1E8ED', 0.2),
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: alpha('#E1E8ED', 0.05),
          },
        },
      },
    },

    // CAMPOS DE TEXTO - Dark mode
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: 40,
            backgroundColor: alpha('#000000', 0.2),
            '&:hover': {
              backgroundColor: alpha('#000000', 0.3),
            },
            '&.Mui-focused': {
              backgroundColor: alpha('#000000', 0.25),
            },
          },
        },
      },
    },

    // PAPER - Dark surfaces
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1F27',
        },
        outlined: {
          borderColor: alpha('#E1E8ED', 0.08),
        },
      },
    },

    // CARD - Dark cards
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${alpha('#E1E8ED', 0.08)}`,
          borderRadius: 8,
          backgroundColor: '#1A1F27',
        },
      },
    },

    // TABLA - Dark tables
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#E1E8ED', 0.08)}`,
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: alpha('#000000', 0.3),
          color: '#E1E8ED',
        },
      },
    },

    // DRAWER - Dark navigation
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${alpha('#E1E8ED', 0.08)}`,
          backgroundColor: '#141922',
        },
      },
    },

    // APP BAR - Dark header
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#E1E8ED', 0.08)}`,
          backgroundColor: '#141922',
          color: '#E1E8ED',
        },
      },
    },

    // TOOLTIP - Dark tooltips
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2D3748',
          fontSize: '0.75rem',
          fontWeight: 400,
        },
      },
    },

    // ALERT - Dark alerts
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: alpha('#66BB6A', 0.12),
          color: '#66BB6A',
          '& .MuiAlert-icon': {
            color: '#66BB6A',
          },
        },
        standardError: {
          backgroundColor: alpha('#F44336', 0.12),
          color: '#F44336',
          '& .MuiAlert-icon': {
            color: '#F44336',
          },
        },
        standardWarning: {
          backgroundColor: alpha('#FFA726', 0.12),
          color: '#FFA726',
          '& .MuiAlert-icon': {
            color: '#FFA726',
          },
        },
        standardInfo: {
          backgroundColor: alpha('#29B6F6', 0.12),
          color: '#29B6F6',
          '& .MuiAlert-icon': {
            color: '#29B6F6',
          },
        },
      },
    },

    // DIALOG - Dark modals
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          backgroundColor: '#1A1F27',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.6)',
        },
      },
    },

    // DIVIDER - Dark dividers
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#E1E8ED', 0.08),
        },
      },
    },

    // SELECT - Dark dropdowns
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          minHeight: 40,
          backgroundColor: alpha('#000000', 0.2),
          '&:hover': {
            backgroundColor: alpha('#000000', 0.3),
          },
        },
      },
    },

    // AUTOCOMPLETE - Dark autocomplete
    MuiAutocomplete: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: 40,
            padding: '4px 9px',
            backgroundColor: alpha('#000000', 0.2),
            '&:hover': {
              backgroundColor: alpha('#000000', 0.3),
            },
            '&.Mui-focused': {
              backgroundColor: alpha('#000000', 0.25),
            },
          },
        },
        paper: {
          backgroundColor: '#1A1F27',
          border: `1px solid ${alpha('#E1E8ED', 0.08)}`,
        },
      },
    },

    // SKELETON - Dark loading states
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#E1E8ED', 0.08),
        },
      },
    },

    // CHIP - Dark chips
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        outlined: {
          borderColor: alpha('#E1E8ED', 0.2),
        },
      },
    },
  },
}, esES);

// Hook para detectar preferencia del sistema
export const useSystemThemePreference = (): 'light' | 'dark' => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDarkMode ? 'dark' : 'light';
};

// Exportación por defecto (light theme)
export default lightTheme;
