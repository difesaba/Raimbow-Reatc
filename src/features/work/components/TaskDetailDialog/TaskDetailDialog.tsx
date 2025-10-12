import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { TaskDetailDialogProps } from './TaskDetailDialog.types';

/**
 * 🏷️ Obtener estado de la tarea con color apropiado
 */
const getTaskStatus = (task: { IsComplete?: number; Completed?: number | boolean; Manager?: string }): { label: string; color: 'success' | 'primary' | 'warning' | 'default' } => {
  if (task.IsComplete === 1 || task.Completed === 1) {
    return { label: 'Completada', color: 'success' };
  }
  if (task.Manager) {
    return { label: 'En Progreso', color: 'primary' };
  }
  return { label: 'Pendiente', color: 'warning' };
};

/**
 * 📅 Formatear fecha a formato legible
 */
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'No asignada';
  try {
    const date = new Date(dateStr);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return dateStr;
  }
};

/**
 * 📋 Modal de Detalles de Tarea
 * Muestra toda la información completa de una tarea en formato organizado
 */
export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  open,
  task,
  onClose,
  onEdit,
  onAssignManager,
  onEditDate
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  if (!task) return null;

  const status = getTaskStatus(task);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isTablet ? 'sm' : 'md'}
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
    >
      {/* Header */}
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Detalles de la Tarea
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <Stack spacing={3} paddingY={2}>
          {/* ============ SECCIÓN 1: INFORMACIÓN GENERAL ============ */}
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'action.hover' }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <AssignmentIcon color="primary" sx={{ fontSize: { xs: 24, sm: 'medium' } }} />
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Información General
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    NOMBRE DEL TRABAJO
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {task.Progress || 'Sin nombre'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    NÚMERO DE LOTE
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {task.Number}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    TIPO
                  </Typography>
                  <Box marginTop={0.5}>
                    <Chip
                      label={task.IsTownHome === 1 ? 'Townhome' : 'Lote'}
                      size="small"
                      color={task.IsTownHome === 1 ? 'info' : 'default'}
                      variant="outlined"
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    ESTADO
                  </Typography>
                  <Box marginTop={0.5}>
                    <Chip
                      label={status.label}
                      size="small"
                      color={status.color}
                      icon={<CheckCircleIcon fontSize="small" />}
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    SUBDIVISIÓN / CLIENTE
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} marginTop={0.5}>
                    <BusinessIcon sx={{ fontSize: { xs: 18, sm: 'small' } }} color="action" />
                    <Typography variant="body2">
                      {task.SubName || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Paper>

          {/* ============ SECCIÓN 2: FECHAS Y DURACIÓN ============ */}
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'action.hover' }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon color="primary" sx={{ fontSize: { xs: 24, sm: 'medium' } }} />
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Fechas y Duración
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA INICIO REAL {task.StartDate ? '(Prioritaria ⭐)' : ''}
                  </Typography>
                  <Typography variant="body2" fontWeight={task.StartDate ? 600 : 400}>
                    {formatDate(task.StartDate) || 'No asignada'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA FIN REAL {task.EndDateTask ? '(Prioritaria ⭐)' : ''}
                  </Typography>
                  <Typography variant="body2" fontWeight={task.EndDateTask ? 600 : 400}>
                    {formatDate(task.EndDateTask) || 'No asignada'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA INICIAL PROGRAMADA {!task.StartDate ? '(Fallback)' : ''}
                  </Typography>
                  <Typography variant="body2" color={!task.StartDate ? 'text.primary' : 'text.secondary'}>
                    {formatDate(task.InitialDate)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA FINAL PROGRAMADA {!task.EndDateTask ? '(Fallback)' : ''}
                  </Typography>
                  <Typography variant="body2" color={!task.EndDateTask ? 'text.primary' : 'text.secondary'}>
                    {formatDate(task.EndDate)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    DURACIÓN PROGRAMADA
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} marginTop={0.5}>
                    <Chip
                      label={`${task.Days || 1} día${(task.Days || 1) > 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    DURACIÓN REAL
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} marginTop={0.5}>
                    <Chip
                      label={`${task.WorkDays || 0} día${(task.WorkDays || 0) > 1 ? 's' : ''}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Paper>

          {/* ============ SECCIÓN 3: PERSONAL Y RESPONSABLES ============ */}
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'action.hover' }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon color="primary" sx={{ fontSize: { xs: 24, sm: 'medium' } }} />
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Personal y Responsables
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    MANAGER ASIGNADO
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} marginTop={0.5}>
                    {task.Manager ? (
                      <>
                        <PersonIcon sx={{ fontSize: { xs: 18, sm: 'small' } }} color="action" />
                        <Typography variant="body2" fontWeight={500}>
                          {task.Manager}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        Sin asignar
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    CONTRACTOR ID
                  </Typography>
                  <Typography variant="body2">
                    {task.ContractorId || 'N/A'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    USER ID
                  </Typography>
                  <Typography variant="body2">
                    {task.UserId || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Paper>

          {/* ============ SECCIÓN 4: CARACTERÍSTICAS DEL LOTE ============ */}
          {(task.SFQuantity || task.Colors || task.DoorDesc) && (
            <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'action.hover' }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <InfoIcon color="primary" sx={{ fontSize: { xs: 24, sm: 'medium' } }} />
                  <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Características del Lote
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {task.SFQuantity && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        SQ FT (PIES CUADRADOS)
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {task.SFQuantity}
                      </Typography>
                    </Grid>
                  )}

                  {task.Colors && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        COLORES
                      </Typography>
                      <Typography variant="body2">
                        {task.Colors}
                      </Typography>
                    </Grid>
                  )}

                  {task.DoorDesc && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        DESCRIPCIÓN PUERTA
                      </Typography>
                      <Typography variant="body2">
                        {task.DoorDesc}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </Paper>
          )}

          {/* ============ SECCIÓN 5: OBSERVACIONES ============ */}
          {task.Obs && (
            <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'action.hover' }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                  OBSERVACIONES
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {task.Obs}
                </Typography>
              </Stack>
            </Paper>
          )}

        </Stack>
      </DialogContent>

      {/* Footer con acciones */}
      <Divider />
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          width="100%"
          justifyContent="space-between"
        >
          {/* Action buttons group */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            flex={1}
            width={{ xs: '100%', sm: 'auto' }}
          >
            {/* Assign Manager button */}
            {onAssignManager && (
              <Button
                variant="outlined"
                size="medium"
                startIcon={<PersonIcon />}
                onClick={() => {
                  onAssignManager();
                  onClose();
                }}
                color="secondary"
                fullWidth={isMobile}
                sx={{ minHeight: { xs: 44, sm: 36 } }}
              >
                Asignar Manager
              </Button>
            )}

            {/* Edit Date button */}
            {onEditDate && (
              <Button
                variant="outlined"
                size="medium"
                startIcon={<CalendarIcon />}
                onClick={() => {
                  onEditDate();
                  onClose();
                }}
                color="info"
                fullWidth={isMobile}
                sx={{ minHeight: { xs: 44, sm: 36 } }}
              >
                Editar Fechas
              </Button>
            )}

            {/* Edit button */}
            {onEdit && (
              <Button
                variant="outlined"
                size="medium"
                startIcon={<EditIcon />}
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                color="primary"
                fullWidth={isMobile}
                sx={{ minHeight: { xs: 44, sm: 36 } }}
              >
                Editar
              </Button>
            )}
          </Stack>

          {/* Close button */}
          <Button
            onClick={onClose}
            variant="contained"
            size="medium"
            fullWidth={isMobile}
            sx={{ minHeight: { xs: 44, sm: 36 } }}
          >
            Cerrar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
