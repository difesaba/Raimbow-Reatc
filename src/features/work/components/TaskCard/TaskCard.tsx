import { Card, CardContent, Typography, Box, Chip, Stack, Avatar } from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import type { TaskCardProps } from './TaskCard.types';

/**
 * 🎨 Generar color consistente basado en el nombre del progreso
 * El mismo string siempre retorna el mismo color
 */
const getProgressColor = (progress: string | number): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' => {
  if (!progress) return 'primary';

  // Convertir a string si es número
  const progressStr = String(progress);

  // Generar hash del string
  let hash = 0;
  for (let i = 0; i < progressStr.length; i++) {
    hash = progressStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Paleta de colores de MUI
  const colors: Array<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'> = [
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
        borderColor: `${color}.main`,
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
              color={color}
              sx={{ minWidth: 40, height: 20, fontSize: '0.65rem' }}
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
                    bgcolor: `${color}.main`
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
