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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  History as HistoryIcon,
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
  if (!task) return null;

  const status = getTaskStatus(task);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      {/* Header */}
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
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
          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'action.hover' }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
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

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    NÚMERO DE LOTE
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {task.Number}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    TIPO
                  </Typography>
                  <Box marginTop={0.5}>
                    <Chip
                      label={task.IsTownHome === 1 ? 'Townhome' : 'Lote'}
                      size="small"
                      color={task.IsTownHome === 1 ? 'info' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    ESTADO
                  </Typography>
                  <Box marginTop={0.5}>
                    <Chip
                      label={status.label}
                      size="small"
                      color={status.color}
                      icon={<CheckCircleIcon fontSize="small" />}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    SUBDIVISIÓN / CLIENTE
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} marginTop={0.5}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {task.SubName || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Paper>

          {/* ============ SECCIÓN 2: FECHAS Y DURACIÓN ============ */}
          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'action.hover' }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Fechas y Duración
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA INICIAL PROGRAMADA
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.InitialDate)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA FINAL PROGRAMADA
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.EndDate)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA INICIO REAL
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.StartDate)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA FIN REAL
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.EndDateTask)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    DURACIÓN PROGRAMADA
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} marginTop={0.5}>
                    <Chip
                      label={`${task.Days || 1} día${(task.Days || 1) > 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    DURACIÓN REAL
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} marginTop={0.5}>
                    <Chip
                      label={`${task.WorkDays || 0} día${(task.WorkDays || 0) > 1 ? 's' : ''}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Paper>

          {/* ============ SECCIÓN 3: PERSONAL Y RESPONSABLES ============ */}
          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'action.hover' }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
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
                        <PersonIcon fontSize="small" color="action" />
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
            <Paper elevation={0} sx={{ p: 2, backgroundColor: 'action.hover' }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
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
            <Paper elevation={0} sx={{ p: 2, backgroundColor: 'action.hover' }}>
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

          {/* ============ SECCIÓN 6: IDs INTERNOS (Colapsable) ============ */}
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight={600}>
                IDs Internos del Sistema
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    TASK ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {task.TaskId || 'N/A'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    LOTE ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {task.LoteId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    ID DET
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {task.IdDet}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    PROGRESS STATUS ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {task.ProgressStatusId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    SUBDIVISION ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {task.SubdivisionId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    INVOICE ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {task.InvoiceId || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* ============ SECCIÓN 7: AUDITORÍA (Colapsable) ============ */}
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={1}>
                <HistoryIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Auditoría
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    CREADO POR
                  </Typography>
                  <Typography variant="body2">
                    Usuario ID: {task.UserCreate || 'N/A'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA DE CREACIÓN
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.CreatedAt)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    ACTUALIZADO POR
                  </Typography>
                  <Typography variant="body2">
                    Usuario ID: {task.UserUpdate || 'N/A'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    FECHA DE ACTUALIZACIÓN
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.UpdatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </DialogContent>

      {/* Footer con acciones */}
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} width="100%" justifyContent="space-between" flexWrap="wrap">
          {/* Edit button - only if onEdit callback is provided */}
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
            >
              Editar
            </Button>
          )}

          {/* Assign Manager button - only if callback is provided */}
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
            >
              Asignar Manager
            </Button>
          )}

          {/* Edit Date button - only if callback is provided */}
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
            >
              Editar Fechas
            </Button>
          )}

          <Box flex={1} />

          <Button onClick={onClose} variant="contained" size="medium">
            Cerrar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
