import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  PersonAdd as PersonAddIcon,
  CalendarToday as CalendarTodayIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useWeeklySchedule } from '../../hooks/useWeeklySchedule';
import { TaskBar } from '../../components/TaskBar';
import { AssignManagerDialog } from '../../components/AssignManagerDialog';
import { EditScheduledDateDialog } from '../../components/EditScheduledDateDialog';
import { TaskDetailDialog } from '../../components/TaskDetailDialog';
import { WorkService } from '../../services/work.service';
import { useAuth } from '../../../auth/hooks/useAuth';
import type { LotDetail } from '../../interfaces/work.interfaces';
import type { Manager, WorkAssignment } from '../../components/AssignManagerDialog/AssignManagerDialog.types';

/**
 * 🔄 Helper: Mapear LotDetail a WorkAssignment
 */
const mapLotDetailToWorkAssignment = (lotDetail: LotDetail): WorkAssignment => ({
  TaskId: lotDetail.TaskId || 0,
  LotId: lotDetail.LoteId,
  Town: lotDetail.IsTownHome,
  Sub: lotDetail.SubdivisionId,
  Status: lotDetail.ProgressStatusId,
  UserRainbow: lotDetail.UserId,
  Obs: lotDetail.Obs || '',
  StartDate: lotDetail.StartDate,
  EndDate: lotDetail.EndDateTask,
  Completed: lotDetail.IsComplete === 1,
  // Extended fields
  Number: lotDetail.Number,
  WorkName: typeof lotDetail.Progress === 'string' ? lotDetail.Progress : `Progreso ${lotDetail.Progress}`,
  ClientName: lotDetail.SubName,
  ManagerName: lotDetail.Manager,
  ScheduledDate: lotDetail.InitialDate,
  Days: lotDetail.Days || lotDetail.WorkDays || 1,
  SFQuantity: lotDetail.SFQuantity,
  Colors: lotDetail.Colors,
  DoorDesc: lotDetail.DoorDesc
});

/**
 * 📅 Página de Calendario Semanal tipo Gantt
 *
 * Muestra las tareas programadas como barras horizontales que se extienden
 * a través de los días que duran. Usa CSS Grid con grid-auto-flow: dense
 * para aprovechar todos los espacios disponibles.
 *
 * Características:
 * - Vista semanal con navegación
 * - Barras de tareas que se extienden por múltiples días
 * - Aprovecha espacios vacíos automáticamente (Tetris effect)
 * - Responsive (desktop: 7 cols, mobile: scroll horizontal)
 */
export const WeeklySchedulePage = () => {
  const {
    weekRange,
    weekDays,
    tasksWithGridPositions,
    loading,
    error: weekError,
    isCurrentWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    refresh
  } = useWeeklySchedule();

  // Hook de autenticación para validar roles
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  // Estados para modales y menú contextual
  const [selectedTask, setSelectedTask] = useState<LotDetail | null>(null);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editDateDialogOpen, setEditDateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingCompleted, setUpdatingCompleted] = useState(false);

  // Formatear rango de la semana para el header
  const weekRangeText = `${format(weekRange.start, 'd MMM', { locale: es })} - ${format(weekRange.end, 'd MMM yyyy', { locale: es })}`;

  // Obtener nombres de días para el header
  const dayNames = weekDays.map(day => ({
    name: format(day, 'EEEE', { locale: es }),
    number: format(day, 'd'),
    isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    dateKey: format(day, 'yyyy-MM-dd')
  }));

  /**
   * Handle task click - abre menú contextual
   */
  const handleTaskClick = (task: LotDetail, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedTask(task);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  /**
   * Cerrar menú contextual
   */
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  /**
   * Abrir modal de asignación de manager
   */
  const handleOpenAssignDialog = () => {
    handleCloseContextMenu();
    setAssignDialogOpen(true);
  };

  /**
   * Abrir modal de edición de fechas
   */
  const handleOpenEditDateDialog = () => {
    handleCloseContextMenu();
    setEditDateDialogOpen(true);
  };

  /**
   * Abrir modal de detalles completos
   */
  const handleOpenDetailDialog = () => {
    handleCloseContextMenu();
    setDetailDialogOpen(true);
  };

  /**
   * Toggle estado de completado de la tarea
   */
  const handleToggleCompleted = async () => {
    if (!selectedTask || !selectedTask.TaskId) {
      setError('No se puede actualizar el estado de una tarea sin ID');
      return;
    }

    handleCloseContextMenu();
    setUpdatingCompleted(true);
    setError(null);

    try {
      // Formatear fecha actual
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Invertir el estado actual de completado
      const newCompletedState = !(selectedTask.IsComplete === 1);

      console.log('🔄 Toggling task completed state:', {
        TaskId: selectedTask.TaskId,
        CurrentState: selectedTask.IsComplete,
        NewState: newCompletedState
      });

      await WorkService.updateWork({
        TaskId: selectedTask.TaskId,
        StartDate: selectedTask.InitialDate || formatDate(new Date()),
        EndDate: selectedTask.EndDate || formatDate(new Date()),
        Completed: newCompletedState,
        Obs: selectedTask.Obs || '',
        UserRainbow: selectedTask.UserId || 0,
        User: 1 // TODO: Get from auth context
      });

      console.log('✅ Task completed state updated successfully');

      // Refrescar datos
      refresh();
      setSelectedTask(null);
    } catch (err: unknown) {
      console.error('❌ Error toggling completed state:', err);
      const errorMessage = err instanceof Error ? err.message : '';
      setError(errorMessage || 'Error al actualizar el estado de la tarea');
    } finally {
      setUpdatingCompleted(false);
    }
  };

  /**
   * Confirmar asignación de manager
   */
  const handleConfirmAssignment = async (manager: Manager) => {
    if (!selectedTask || !selectedTask.TaskId) {
      setError('No se puede asignar manager a una tarea sin ID');
      return;
    }

    try {
      // Formatear fecha actual
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      await WorkService.updateWork({
        TaskId: selectedTask.TaskId,
        UserRainbow: manager.id,
        User: 1, // TODO: Get from auth context
        StartDate: selectedTask.InitialDate || formatDate(new Date()),
        EndDate: selectedTask.EndDate || formatDate(new Date()),
        Completed: selectedTask.IsComplete === 1,
        Obs: selectedTask.Obs || ''
      });

      // Refrescar datos
      refresh();
      setAssignDialogOpen(false);
      setSelectedTask(null);
      setError(null);
    } catch (err: unknown) {
      console.error('❌ Error assigning manager:', err);
      const errorMessage = err instanceof Error ? err.message : '';
      setError(errorMessage || 'Error al asignar el manager');
    }
  };

  /**
   * Confirmar edición de fechas
   */
  const handleConfirmEditDate = async (newStartDate: string, newEndDate: string) => {
    if (!selectedTask || !selectedTask.TaskId) {
      setError('No se puede actualizar la fecha de una tarea sin ID');
      return;
    }

    try {
      await WorkService.updateWork({
        TaskId: selectedTask.TaskId,
        StartDate: newStartDate,
        EndDate: newEndDate,
        Completed: selectedTask.IsComplete === 1,
        Obs: selectedTask.Obs || '',
        UserRainbow: selectedTask.UserId || 0,
        User: 1 // TODO: Get from auth context
      });

      // Refrescar datos
      refresh();
      setEditDateDialogOpen(false);
      setSelectedTask(null);
      setError(null);
    } catch (err: unknown) {
      console.error('❌ Error updating dates:', err);
      const errorMessage = err instanceof Error ? err.message : '';
      setError(errorMessage || 'Error al actualizar las fechas');
    }
  };

  // Combinar errores
  const displayError = error || weekError?.message;

  return (
    <Container maxWidth="xl">
      <Stack spacing={3} paddingY={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Calendario Semanal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualiza las tareas programadas en formato Gantt
          </Typography>
        </Box>

        {/* Controles de navegación */}
        <Paper elevation={0}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            flexWrap="wrap"
            gap={2}
          >
            {/* Semana actual */}
            <Typography variant="h6" fontWeight={600}>
              Semana del {weekRangeText}
            </Typography>

            {/* Botones de navegación */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ChevronLeftIcon />}
                onClick={goToPreviousWeek}
                disabled={loading}
              >
                Anterior
              </Button>

              {!isCurrentWeek && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<TodayIcon />}
                  onClick={goToCurrentWeek}
                  disabled={loading}
                >
                  Hoy
                </Button>
              )}

              <Button
                variant="outlined"
                size="small"
                endIcon={<ChevronRightIcon />}
                onClick={goToNextWeek}
                disabled={loading}
              >
                Siguiente
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Error Alert */}
        {displayError && (
          <Alert severity="error" onClose={() => setError(null)}>
            {displayError}
          </Alert>
        )}

        {/* Calendario tipo Gantt */}
        <Paper
          elevation={0}
          sx={{
            overflow: 'auto',
            minHeight: 400,
            maxHeight: 'calc(100vh - 300px)' // Limita altura para scroll con header sticky
          }}
        >
          {/* Header de días de la semana (sticky) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0,
              borderBottom: 2,
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              backgroundColor: 'background.paper',
              zIndex: 10
            }}
          >
            {dayNames.map((day, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: day.isToday ? 'primary.main' : 'background.default',
                  color: day.isToday ? 'primary.contrastText' : 'text.primary',
                  borderRight: index < 6 ? 1 : 0,
                  borderColor: 'divider',
                  minWidth: 100 // Mínimo para mobile scroll
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  textTransform="capitalize"
                  display="block"
                >
                  {day.name}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {day.number}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Grid de tareas con auto-flow dense */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridAutoFlow: 'dense', // ¡Magia de Tetris!
              gridAutoRows: 'minmax(95px, auto)', // Más espacio para las tarjetas
              gap: 1.5, // Más separación entre tarjetas
              p: 2,
              minWidth: 700, // Para scroll horizontal en mobile
              position: 'relative'
            }}
          >
            {loading ? (
              // Loading skeletons
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={60}
                    sx={{
                      gridColumn: `${Math.floor(Math.random() * 5) + 1} / span ${Math.floor(Math.random() * 3) + 1}`,
                      borderRadius: 1
                    }}
                  />
                ))}
              </>
            ) : tasksWithGridPositions.length > 0 ? (
              // Tareas con posiciones de grid
              tasksWithGridPositions.map((task) => (
                <TaskBar
                  key={task.IdDet}
                  task={task}
                  gridColumnStart={task.gridColumnStart}
                  gridColumnSpan={task.gridColumnSpan}
                  onClick={handleTaskClick}
                />
              ))
            ) : (
              // Sin tareas
              <Box
                sx={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  color: 'text.secondary'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Sin tareas programadas
                </Typography>
                <Typography variant="body2">
                  No hay tareas para esta semana
                </Typography>
              </Box>
            )}
          </Box>

          {/* Loading general */}
          {loading && (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          )}
        </Paper>

        {/* Leyenda de información */}
        <Paper elevation={0} sx={{ p: 2, backgroundColor: 'action.hover' }}>
          <Typography variant="caption" color="text.secondary">
            💡 <strong>Tip:</strong> Las tareas se organizan automáticamente aprovechando todos los espacios disponibles.
            Haz clic en una tarea para asignar manager o editar fechas.
          </Typography>
        </Paper>

        {/* Menú contextual */}
        <Menu
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {(() => {
            // ✅ Validación: Solo permitir editar si tiene TaskId válido
            const hasValidTaskId = selectedTask?.TaskId && selectedTask.TaskId > 0;

            // 🔒 Determinar mensaje de tooltip según la restricción
            const getTooltipMessage = (requiresAdmin: boolean): string => {
              if (!hasValidTaskId) {
                return 'Esta acción requiere que la tarea esté guardada en el sistema';
              }
              if (requiresAdmin && !isAdmin) {
                return 'Esta acción requiere permisos de Administrador';
              }
              return '';
            };

            return (
              <>
                {/* Opción 1: Ver Detalles - Siempre habilitada (solo lectura) */}
                <MenuItem onClick={handleOpenDetailDialog}>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Ver Detalles</ListItemText>
                </MenuItem>

                {/* Opción 2: Asignar/Reasignar Manager - Solo Admin + Requiere TaskId */}
                <Tooltip
                  title={getTooltipMessage(true)}
                  placement="right"
                  arrow
                >
                  <span>
                    <MenuItem
                      onClick={handleOpenAssignDialog}
                      disabled={!isAdmin || !hasValidTaskId}
                    >
                      <ListItemIcon>
                        <PersonAddIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>
                        {selectedTask?.Manager ? 'Reasignar Manager' : 'Asignar Manager'}
                      </ListItemText>
                    </MenuItem>
                  </span>
                </Tooltip>

                {/* Opción 3: Editar Fechas - Solo Admin + Requiere TaskId */}
                <Tooltip
                  title={getTooltipMessage(true)}
                  placement="right"
                  arrow
                >
                  <span>
                    <MenuItem
                      onClick={handleOpenEditDateDialog}
                      disabled={!isAdmin || !hasValidTaskId}
                    >
                      <ListItemIcon>
                        <CalendarTodayIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Editar Fechas</ListItemText>
                    </MenuItem>
                  </span>
                </Tooltip>

                {/* Opción 4: Toggle Completado - Todos los usuarios + Requiere TaskId */}
                {selectedTask && (
                  <Tooltip
                    title={getTooltipMessage(false)}
                    placement="right"
                    arrow
                  >
                    <span>
                      <MenuItem
                        onClick={handleToggleCompleted}
                        disabled={!hasValidTaskId || updatingCompleted}
                      >
                        <ListItemIcon>
                          {selectedTask.IsComplete === 1 ? (
                            <RadioButtonUncheckedIcon fontSize="small" />
                          ) : (
                            <CheckCircleIcon fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText>
                          {selectedTask.IsComplete === 1
                            ? 'Marcar como Pendiente'
                            : 'Marcar como Completada'}
                        </ListItemText>
                      </MenuItem>
                    </span>
                  </Tooltip>
                )}
              </>
            );
          })()}
        </Menu>

        {/* Modal de Asignación de Manager */}
        <AssignManagerDialog
          open={assignDialogOpen}
          work={selectedTask ? mapLotDetailToWorkAssignment(selectedTask) : null}
          onClose={() => {
            setAssignDialogOpen(false);
            setSelectedTask(null);
          }}
          onConfirm={handleConfirmAssignment}
        />

        {/* Modal de Edición de Fechas */}
        <EditScheduledDateDialog
          open={editDateDialogOpen}
          work={selectedTask ? mapLotDetailToWorkAssignment(selectedTask) : null}
          onClose={() => {
            setEditDateDialogOpen(false);
            setSelectedTask(null);
          }}
          onConfirm={handleConfirmEditDate}
        />

        {/* Modal de Detalles Completos */}
        <TaskDetailDialog
          open={detailDialogOpen}
          task={selectedTask}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedTask(null);
          }}
          onAssignManager={() => {
            setDetailDialogOpen(false);
            setAssignDialogOpen(true);
          }}
          onEditDate={() => {
            setDetailDialogOpen(false);
            setEditDateDialogOpen(true);
          }}
        />
      </Stack>
    </Container>
  );
};
