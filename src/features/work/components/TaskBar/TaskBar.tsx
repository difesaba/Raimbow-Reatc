import { Box, Typography, Tooltip, Chip, Stack } from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import type { TaskBarProps } from './TaskBar.types';
import type { LotDetail } from '../../interfaces/work.interfaces';

/**
 * 🎨 Generar color consistente basado en el nombre del progreso
 * El mismo string siempre retorna el mismo color
 */
const getProgressColor = (progress: string | number): string => {
  if (!progress) return 'primary';

  // Convertir a string si es número
  const progressStr = String(progress);

  // Generar hash del string
  let hash = 0;
  for (let i = 0; i < progressStr.length; i++) {
    hash = progressStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Paleta de colores de MUI
  const colors = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'error'
  ];

  // Retornar color basado en el hash
  return colors[Math.abs(hash) % colors.length];
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
    </Stack>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Box
        onClick={handleClick}
        sx={{
          gridColumn: `${gridColumnStart} / span ${gridColumnSpan}`,
          backgroundColor: `${color}.main`,
          color: `${color}.contrastText`,
          borderRadius: 1,
          p: 1.5,
          minHeight: 85,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: onClick ? 'pointer' : 'default',
          overflow: 'hidden',
          border: 2,
          borderColor: `${color}.dark`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': onClick ? {
            transform: 'translateY(-2px)',
            boxShadow: 4,
            borderColor: `${color}.main`,
          } : undefined,
        }}
      >
        <Stack spacing={0.75}>
          {/* Fila 1: Nombre del progreso + Estado + Lote */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
                flex: 1
              }}
            >
              {task.Progress || 'Sin nombre'}
            </Typography>

            {/* Estado + Lote */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <Chip
                label={status.label}
                size="small"
                color={status.color}
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  '& .MuiChip-label': {
                    px: 0.75
                  }
                }}
              />
              <Typography
                variant="caption"
                fontSize="0.65rem"
                fontWeight={500}
                sx={{ whiteSpace: 'nowrap' }}
              >
                #{task.Number}
              </Typography>
            </Box>
          </Box>

          {/* Fila 2: Subdivisión + Badge días */}
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
            {task.SubName && (
              <Box display="flex" alignItems="center" gap={0.4} flex={1}>
                <BusinessIcon sx={{ fontSize: 13, opacity: 0.9 }} />
                <Typography
                  variant="caption"
                  fontSize="0.7rem"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {task.SubName}
                </Typography>
              </Box>
            )}

            {/* Badge de duración */}
            <Chip
              label={`${task.Days || 1}d`}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.25)',
                color: 'inherit',
                '& .MuiChip-label': {
                  px: 0.75
                }
              }}
            />
          </Box>

          {/* Fila 3: Manager */}
          {task.Manager && (
            <Box display="flex" alignItems="center" gap={0.4}>
              <PersonIcon sx={{ fontSize: 13, opacity: 0.9 }} />
              <Typography
                variant="caption"
                fontSize="0.7rem"
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
      </Box>
    </Tooltip>
  );
};
