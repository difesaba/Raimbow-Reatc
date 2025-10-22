import { Box, Typography, Tooltip, Chip, Stack, useTheme, useMediaQuery } from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import type { TaskBarProps } from './TaskBar.types';
import type { LotDetail } from '../../interfaces/work.interfaces';

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
 * 🏷️ Obtener estado de la tarea con color apropiado
 */
const getTaskStatus = (task: LotDetail): { label: string; color: 'success' | 'primary' | 'warning' | 'default' } => {
  // Completada
  if (task.IsComplete === 1 || task.Completed === 1) {
    return { label: 'Completada', color: 'success' };
  }

  // En progreso (tiene manager asignado)
  if (task.Manager) {
    return { label: 'En Progreso', color: 'primary' };
  }

  // Pendiente
  return { label: 'Pendiente', color: 'warning' };
};

/**
 * 📊 Componente de barra de tarea horizontal (estilo Gantt)
 *
 * Se extiende horizontalmente por múltiples columnas del grid
 * según la duración de la tarea en días.
 */
export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  gridColumnStart,
  gridColumnSpan,
  onClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 

  const color = getProgressColor(task.Progress);
  const status = getTaskStatus(task);

  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(task, event);
    }
  };

  // Contenido del tooltip con detalles completos
  const tooltipContent = (
    <Stack spacing={0.5} p={0.5}>
      <Typography variant="body2" fontWeight={600}>
        {task.Progress || 'Sin nombre'}
      </Typography>
      <Typography variant="caption">
        <strong>Estado:</strong> {status.label}
      </Typography>
      <Typography variant="caption">
        <strong>Subdivisión:</strong> {task.SubName || 'Sin cliente'}
      </Typography>
      {task.Manager && (
        <Typography variant="caption">
          <strong>Manager:</strong> {task.Manager}
        </Typography>
      )}
      <Typography variant="caption">
        <strong>Duración:</strong> {task.Days || 1} día{(task.Days || 1) > 1 ? 's' : ''}
      </Typography>
      {task.SFQuantity && (
        <Typography variant="caption">
          <strong>SQ FT:</strong> {task.SFQuantity}
        </Typography>
      )}
      {task.Colors && (
        <Typography variant="caption">
          <strong>Colores:</strong> {task.Colors}
        </Typography>
      )}
      {task.DoorDesc && (
        <Typography variant="caption">
          <strong>Puerta:</strong> {task.DoorDesc}
        </Typography>
      )}
      {task.StainDesc && (
        <Typography variant="caption">
          <strong>Stain:</strong> {task.StainDesc}
        </Typography>
      )}
    </Stack>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Box
        onClick={handleClick}
        sx={{
          gridColumn: isMobile ? 'auto' : `${gridColumnStart} / span ${gridColumnSpan}`,
          backgroundColor: color.main,
          color: color.contrastText,
          borderRadius: 1,
          p: 1.5,
          minHeight: 85,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: onClick ? 'pointer' : 'default',
          overflow: 'hidden',
          border: 2,
          borderColor: color.dark,
          transition: 'all 0.2s ease-in-out',
          boxSizing: 'border-box',
          '&:hover': onClick ? {
            transform: 'translateY(-2px)',
            boxShadow: 4,
            borderColor: color.light,
          } : undefined,
        }}
      >
        <Stack spacing={0.75}>
          {/* Fila 1: Nombre del progreso + Estado + Lote */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              fontWeight={700}
              noWrap
              style={{ flex: 1, lineHeight: 1.3 }}
            >
              {task.Progress || 'Sin nombre'}
            </Typography>

            {/* Estado + Lote */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <Chip
                label={status.label}
                size="small"
                color={status.color}
              />
              <Typography
                variant="caption"
                fontWeight={500}
                noWrap
              >
                #{task.Number}
              </Typography>
            </Box>
          </Box>

          {/* Fila 2: Subdivisión + Badge días */}
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
            {task.SubName && (
              <Box display="flex" alignItems="center" gap={0.4} flex={1}>
                <BusinessIcon fontSize="small" style={{ opacity: 0.9 }} />
                <Typography
                  variant="caption"
                  noWrap
                >
                  {task.SubName}
                </Typography>
              </Box>
            )}

            {/* Badge de duración */}
            <Chip
              label={`${task.Days || 1}d`}
              size="small"
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                color: 'inherit',
                fontWeight: 600
              }}
            />
          </Box>

          {/* Fila 3: Manager */}
          {task.Manager && (
            <Box display="flex" alignItems="center" gap={0.4}>
              <PersonIcon fontSize="small" style={{ opacity: 0.9 }} />
              <Typography
                variant="caption"
                noWrap
              >
                {task.Manager}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Tooltip>
  );
};
