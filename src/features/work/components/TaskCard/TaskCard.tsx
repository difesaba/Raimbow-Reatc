import { Card, CardContent, Typography, Box, Chip, Stack, Avatar } from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import type { TaskCardProps } from './TaskCard.types';

/**
 * 🎨 Configuración de color personalizado
 * Estructura que define un color con sus variantes y texto de contraste
 */
interface ColorConfig {
  main: string;         // Color principal (hexadecimal)
  dark: string;         // Variante oscura (hexadecimal)
  light: string;        // Variante clara (hexadecimal)
  contrastText: string; // Color de texto que contrasta (hexadecimal)
}

/**
 * 🎨 Paleta de colores hexadecimales personalizados para cada tarea
 * Colores altamente diferenciados para máxima distinción visual
 */
const TASK_COLORS: Record<string, ColorConfig> = {
  'buttajuy': {
    main: '#2196F3',      // 🔵 AZUL BRILLANTE (Material Blue 500)
    dark: '#1976D2',
    light: '#64B5F6',
    contrastText: '#FFFFFF'
  },
  'drywall checkout': {
    main: '#E91E63',      // 💗 ROSA FUERTE (Material Pink 500)
    dark: '#C2185B',
    light: '#F06292',
    contrastText: '#FFFFFF'
  },
  'drywall': {
    main: '#00BCD4',      // 🔷 CYAN BRILLANTE (Material Cyan 500)
    dark: '#0097A7',
    light: '#4DD0E1',
    contrastText: '#FFFFFF'
  },
  'paint': {
    main: '#4CAF50',      // 🟢 VERDE BRILLANTE (Material Green 500)
    dark: '#388E3C',
    light: '#81C784',
    contrastText: '#FFFFFF'
  },
  'stain': {
    main: '#FF9800',      // 🟠 NARANJA VIBRANTE (Material Orange 500)
    dark: '#F57C00',
    light: '#FFB74D',
    contrastText: '#000000'
  },
  'trim': {
    main: '#F44336',      // 🔴 ROJO BRILLANTE (Material Red 500)
    dark: '#D32F2F',
    light: '#EF5350',
    contrastText: '#FFFFFF'
  },
  'prime': {
    main: '#8BC34A',      // 🍏 VERDE LIMA (Material Light Green 500)
    dark: '#689F38',
    light: '#AED581',
    contrastText: '#000000'
  },
  'bluetape': {
    main: '#03A9F4',      // 🔹 AZUL CIELO (Material Light Blue 500)
    dark: '#0288D1',
    light: '#4FC3F7',
    contrastText: '#FFFFFF'
  },
  'blue tape': {
    main: '#03A9F4',      // 🔹 AZUL CIELO (variante con espacio)
    dark: '#0288D1',
    light: '#4FC3F7',
    contrastText: '#FFFFFF'
  }
};

/**
 * 🎨 Paleta de colores fallback para tareas no mapeadas
 * Se usa cuando no hay un mapeo explícito
 */
const DEFAULT_COLORS: ColorConfig[] = [
  { main: '#9C27B0', dark: '#7B1FA2', light: '#BA68C8', contrastText: '#FFFFFF' }, // 🟣 PÚRPURA
  { main: '#673AB7', dark: '#512DA8', light: '#9575CD', contrastText: '#FFFFFF' }, // 🟪 ÍNDIGO OSCURO
  { main: '#3F51B5', dark: '#303F9F', light: '#7986CB', contrastText: '#FFFFFF' }, // 🔵 ÍNDIGO
  { main: '#009688', dark: '#00796B', light: '#4DB6AC', contrastText: '#FFFFFF' }, // 🟢 VERDE AZULADO
  { main: '#FFEB3B', dark: '#FBC02D', light: '#FFF176', contrastText: '#000000' }, // 🟡 AMARILLO
  { main: '#FF5722', dark: '#E64A19', light: '#FF8A65', contrastText: '#FFFFFF' }, // 🟠 NARANJA ROJIZO
  { main: '#795548', dark: '#5D4037', light: '#A1887F', contrastText: '#FFFFFF' }, // 🟤 CAFÉ
  { main: '#607D8B', dark: '#455A64', light: '#90A4AE', contrastText: '#FFFFFF' }  // ⚫ GRIS AZULADO
];

/**
 * 🎨 Generar color consistente basado en el nombre del progreso
 * 1. Verifica mapeo explícito primero (colores personalizados)
 * 2. Si no existe, usa algoritmo de hash con paleta fallback
 */
const getProgressColor = (progress: string | number): ColorConfig => {
  if (!progress) return DEFAULT_COLORS[0];

  // Convertir a string y normalizar (lowercase, trim)
  const progressStr = String(progress).toLowerCase().trim();

  // Verificar si existe un mapeo explícito
  if (TASK_COLORS[progressStr]) {
    return TASK_COLORS[progressStr];
  }

  // Fallback: Generar hash del string para asignación automática
  let hash = 0;
  for (let i = 0; i < progressStr.length; i++) {
    hash = progressStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Retornar color basado en el hash
  return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
};

/**
 * 📋 Componente de tarjeta de tarea
 *
 * Muestra información de una tarea con:
 * - Borde coloreado según el tipo de progreso
 * - Nombre del trabajo
 * - Información del lote y cliente
 * - Manager asignado
 * - Detalles adicionales (SQ FT, colores, etc.)
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const color = getProgressColor(task.Progress);

  const handleClick = () => {
    if (onClick) {
      onClick(task);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        borderLeft: 4,
        borderColor: color.main,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        } : undefined,
        minHeight: 120,
        backgroundColor: 'background.paper'
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack spacing={1}>
          {/* Nombre del progreso con chip de estado */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.primary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {task.Progress || 'Sin nombre'}
            </Typography>
            <Chip
              label={task.Days ? `${task.Days}d` : '1d'}
              size="small"
              sx={{
                minWidth: 40,
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: color.main,
                color: color.contrastText,
                fontWeight: 600
              }}
            />
          </Box>

          {/* Lote y Cliente */}
          <Stack spacing={0.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <HomeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Lote: <strong>{task.Number || 'N/A'}</strong>
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={0.5}>
              <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {task.SubName || 'Sin cliente'}
              </Typography>
            </Box>

            {/* Manager */}
            {task.Manager && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Avatar
                  sx={{
                    width: 16,
                    height: 16,
                    fontSize: '0.6rem',
                    bgcolor: color.main,
                    color: color.contrastText
                  }}
                >
                  <PersonIcon sx={{ fontSize: 12 }} />
                </Avatar>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {task.Manager}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Información adicional (si existe) */}
          {(task.SFQuantity || task.Colors || task.DoorDesc || task.StainDesc) && (
            <Box
              sx={{
                pt: 0.5,
                borderTop: 1,
                borderColor: 'divider'
              }}
            >
              <Stack spacing={0.25}>
                {task.SFQuantity && (
                  <Typography variant="caption" color="text.secondary">
                    SQ FT: {task.SFQuantity}
                  </Typography>
                )}
                {task.Colors && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Colores: {task.Colors}
                  </Typography>
                )}
                {task.DoorDesc && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Puerta: {task.DoorDesc}
                  </Typography>
                )}
                {task.StainDesc && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Stain: {task.StainDesc}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
