// src/features/work/pages/WeeklySchedulePage/view/WeeklySchedulePage.tsx
import { useState, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { useWeeklySchedule } from '../../../hooks/useWeeklySchedule';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useWorkActions } from '../hooks/useWorkActions';
import { useExpandedDays } from '../hooks/useExpandedDays';
import { useSubdivisions } from '../../../hooks/useSubdivisions';
import { formatWeekRange, getDayInfo } from '../utils/dateHelpers';
import { mapLotDetailToWorkAssignment } from '../utils/taskMappers';
import { WeekNavigationBar } from '../components/WeekNavigationBar';
import { TaskContextMenu } from '../components/TaskContextMenu';
import { WeeklyScheduleFilters } from '../components/WeeklyScheduleFilters';
import { MobileWeekView } from './MobileWeekView';
import { DesktopWeekView } from './DesktopWeekView';
import { AssignManagerDialog } from '../../../components/AssignManagerDialog';
import { EditScheduledDateDialog } from '../../../components/EditScheduledDateDialog';
import { TaskDetailDialog } from '../../../components/TaskDetailDialog';
import { TaskAuditDialog } from '../../../components/TaskAuditDialog';
import type { LotDetail } from '../../../interfaces/work.interfaces';
import type { Manager } from '../../../components/AssignManagerDialog/AssignManagerDialog.types';
import type { FilterStatus } from '../components/WeeklyScheduleFilters.types';
import type { Subdivision } from '../../../interfaces/subdivision.interfaces';

/**
 * 📅 Página de Calendario Semanal tipo Gantt
 *
 * Componente principal simplificado que:
 * - Orquesta los hooks y componentes
 * - Maneja el estado de UI (modales, menú contextual)
 * - Delega lógica de negocio a hooks
 * - Delega renderizado a componentes específicos
 */
export const WeeklySchedulePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Estados de filtros
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [progressFilter, setProgressFilter] = useState<string>('all');
  const [selectedSubdivision, setSelectedSubdivision] = useState<Subdivision | null>(null);

  // Hook de subdivisiones
  const { subdivisions } = useSubdivisions();

  // Hook de calendario semanal (con filtro de subdivisión)
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
  } = useWeeklySchedule(selectedSubdivision?.SubdivisionId);

  // Hook de autenticación para validar roles
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  // Hook de acciones sobre tareas
  const {
    loading: actionLoading,
    error: actionError,
    lastNotification,
    toggleCompleted,
    assignManager,
    updateDates,
    clearError,
    clearNotification
  } = useWorkActions(refresh);

  // Hook para días expandidos en móvil
  const { expandedDays, toggleDay } = useExpandedDays(weekRange, weekDays);

  // Estados de UI
  const [selectedTask, setSelectedTask] = useState<LotDetail | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    task: LotDetail;
    position: { mouseX: number; mouseY: number };
  } | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editDateDialogOpen, setEditDateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [workToAudit, setWorkToAudit] = useState<LotDetail | null>(null);

  // Determinar maxWidth del container
  const containerMaxWidth = isMobile ? false : isTablet ? 'lg' : 'xl';

  // Formatear rango de la semana
  const weekRangeText = formatWeekRange(weekRange.start, weekRange.end);

  // Obtener nombres de días para el header (memoizado)
  const dayNames = useMemo(() =>
    weekDays.map(day => getDayInfo(day)),
    [weekDays]
  );

  // Get unique progress types from current tasks
  const getUniqueProgress = useMemo((): string[] => {
    const uniqueSet = new Set<string>();
    tasksWithGridPositions.forEach(task => {
      const progressValue = task.Progress as any;
      if (progressValue) {
        const workName = typeof progressValue === 'string' && progressValue.includes(' - Lote ')
          ? progressValue.split(' - Lote ')[0]
          : String(progressValue);
        uniqueSet.add(workName);
      }
    });
    return Array.from(uniqueSet).sort();
  }, [tasksWithGridPositions]);

  // Filter tasks based on all filters
  const filteredTasksWithGridPositions = useMemo(() => {
    let filtered = tasksWithGridPositions;

    // 1. Filtrar por estado (all/pending/in_progress/completed)
    switch (filterStatus) {
      case 'pending':
        // Pendientes: Sin asignar y no completadas
        filtered = filtered.filter(task =>
          !task.UserId && (task.IsComplete !== 1 && task.Completed !== 1)
        );
        break;
      case 'in_progress':
        // En progreso: Asignadas pero no completadas
        filtered = filtered.filter(task =>
          task.UserId && (task.IsComplete !== 1 && task.Completed !== 1)
        );
        break;
      case 'completed':
        // Completadas: Marcadas como completadas
        filtered = filtered.filter(task => task.IsComplete === 1 || task.Completed === 1);
        break;
      case 'all':
      default:
        break;
    }

    // 2. Filtrar por tipo de trabajo (Progress)
    if (progressFilter !== 'all') {
      filtered = filtered.filter(task => {
        const progressValue = task.Progress as any;
        const workName = typeof progressValue === 'string' && progressValue.includes(' - Lote ')
          ? progressValue.split(' - Lote ')[0]
          : String(progressValue);
        return workName === progressFilter;
      });
    }

    return filtered;
  }, [tasksWithGridPositions, filterStatus, progressFilter]);

  // Agrupar tareas por día para vista móvil (memoizado) - usando tareas filtradas
  const tasksByDay = useMemo(() =>
    weekDays.map((day, dayIndex) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const columnNumber = dayIndex + 1;

      // Filtrar tareas que se ejecutan en este día - usando tareas filtradas
      const dayTasks = filteredTasksWithGridPositions.filter(task => {
        const taskStartCol = task.gridColumnStart;
        const taskEndCol = task.gridColumnStart + task.gridColumnSpan - 1;
        return columnNumber >= taskStartCol && columnNumber <= taskEndCol;
      });

      return {
        date: day,
        dateKey,
        dayInfo: dayNames.find(d => d.dateKey === dateKey)!,
        tasks: dayTasks
      };
    }),
    [weekDays, filteredTasksWithGridPositions, dayNames]
  );

  /**
   * Manejadores de eventos
   */
  const handleTaskClick = useCallback((task: LotDetail, event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      task,
      position: {
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 6
      }
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleToggleCompleted = useCallback(async () => {
    if (selectedTask) {
      const success = await toggleCompleted(selectedTask);
      if (success) {
        setSelectedTask(null);
        handleCloseContextMenu();
      }
    }
  }, [selectedTask, toggleCompleted, handleCloseContextMenu]);

  const handleConfirmAssignment = useCallback(async (manager: Manager) => {
    if (selectedTask) {
      const success = await assignManager(selectedTask, manager);
      if (success) {
        setAssignDialogOpen(false);
        setSelectedTask(null);
      }
    }
  }, [selectedTask, assignManager]);

  const handleConfirmEditDate = useCallback(async (newStartDate: string, newEndDate: string) => {
    if (selectedTask) {
      const success = await updateDates(selectedTask, newStartDate, newEndDate);
      if (success) {
        setEditDateDialogOpen(false);
        setSelectedTask(null);
      }
    }
  }, [selectedTask, updateDates]);

  // Combinar errores
  const displayError = actionError || weekError?.message;

  return (
    <Container maxWidth={containerMaxWidth}>
      <Stack spacing={3} paddingY={3}>
        {/* Header */}
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Calendario Semanal
          </Typography>
          <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
            Visualiza las tareas programadas en formato Gantt
          </Typography>
        </Box>

        {/* Barra de navegación */}
        <WeekNavigationBar
          weekRangeText={weekRangeText}
          isCurrentWeek={isCurrentWeek}
          loading={loading}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onCurrentWeek={goToCurrentWeek}
        />

        {/* Filtros */}
        <WeeklyScheduleFilters
          loading={loading}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          progressFilter={progressFilter}
          onProgressFilterChange={setProgressFilter}
          availableProgress={getUniqueProgress}
          subdivisions={subdivisions}
          selectedSubdivision={selectedSubdivision}
          onSubdivisionChange={setSelectedSubdivision}
        />

        {/* Error Alert */}
        {displayError && (
          <Alert severity="error" onClose={clearError}>
            {displayError}
          </Alert>
        )}

        {/* Notification Result Alert */}
        {lastNotification && (
          <Alert
            severity={lastNotification.whatsapp?.isSuccess ? "success" : "warning"}
            onClose={clearNotification}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {lastNotification.sent ? '✅ Notificación Enviada' : '⚠️ Notificación No Enviada'}
            </Typography>

            {lastNotification.user && (
              <Typography variant="body2" gutterBottom>
                <strong>Usuario:</strong> {lastNotification.user}
                {lastNotification.phone && ` (${lastNotification.phone})`}
              </Typography>
            )}

            <Stack spacing={1} mt={1}>
              {/* WhatsApp Status */}
              {lastNotification.whatsapp && (
                <Box>
                  <Typography variant="body2" component="span">
                    {lastNotification.whatsapp.isSuccess ? '✅' : '❌'} <strong>WhatsApp:</strong>{' '}
                    {lastNotification.whatsapp.isSuccess
                      ? `Estado: ${lastNotification.whatsapp.status}${lastNotification.whatsapp.messageSid ? ` (${lastNotification.whatsapp.messageSid})` : ''}`
                      : lastNotification.whatsapp.errorMessage || 'Error desconocido'
                    }
                  </Typography>
                </Box>
              )}

              {/* Reason if not sent */}
              {lastNotification.reason && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    {lastNotification.reason}
                  </Typography>
                </Alert>
              )}

              {/* Summary */}
              <Divider sx={{ my: 0.5 }} />
              <Typography variant="body2" fontWeight={500}>
                <strong>Estado:</strong> {lastNotification.sent ? '✅ Enviado' : '❌ No enviado'}
              </Typography>
            </Stack>
          </Alert>
        )}

        {/* Vista Móvil */}
        <MobileWeekView
          tasksByDay={tasksByDay}
          expandedDays={expandedDays}
          loading={loading}
          onToggleDay={toggleDay}
          onTaskClick={handleTaskClick}
        />

        {/* Vista Desktop */}
        <DesktopWeekView
          dayNames={dayNames}
          tasksWithGridPositions={filteredTasksWithGridPositions}
          loading={loading}
          onTaskClick={handleTaskClick}
        />

        {/* Leyenda de información */}
        <Paper elevation={0}>
          <Box p={2} bgcolor="action.hover">
            <Typography variant="caption" color="text.secondary">
              💡 <strong>Tip:</strong> Las tareas se organizan automáticamente aprovechando todos los espacios disponibles.
              Haz clic en una tarea para asignar manager o editar fechas.
            </Typography>
          </Box>
        </Paper>

        {/* Menú contextual */}
        <TaskContextMenu
          anchorPosition={contextMenu?.position ?? null}
          task={contextMenu?.task ?? null}
          isAdmin={isAdmin}
          loading={actionLoading}
          onClose={handleCloseContextMenu}
          onViewDetails={() => {
            if (contextMenu) {
              setSelectedTask(contextMenu.task);
              handleCloseContextMenu();
              setDetailDialogOpen(true);
            }
          }}
          onAuditAssignment={() => {
            if (contextMenu) {
              setWorkToAudit(contextMenu.task);
              handleCloseContextMenu();
              setAuditDialogOpen(true);
            }
          }}
          onAssignManager={() => {
            if (contextMenu) {
              setSelectedTask(contextMenu.task);
              handleCloseContextMenu();
              setAssignDialogOpen(true);
            }
          }}
          onEditDates={() => {
            if (contextMenu) {
              setSelectedTask(contextMenu.task);
              handleCloseContextMenu();
              setEditDateDialogOpen(true);
            }
          }}
          onToggleCompleted={() => {
            if (contextMenu) {
              setSelectedTask(contextMenu.task);
              handleCloseContextMenu();
              handleToggleCompleted();
            }
          }}
        />

        {/* Diálogos */}
        <AssignManagerDialog
          open={assignDialogOpen}
          work={selectedTask ? mapLotDetailToWorkAssignment(selectedTask) : null}
          onClose={() => {
            setAssignDialogOpen(false);
            setSelectedTask(null);
          }}
          onConfirm={handleConfirmAssignment}
        />

        <EditScheduledDateDialog
          open={editDateDialogOpen}
          work={selectedTask ? mapLotDetailToWorkAssignment(selectedTask) : null}
          onClose={() => {
            setEditDateDialogOpen(false);
            setSelectedTask(null);
          }}
          onConfirm={handleConfirmEditDate}
        />

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

        {/* Task Audit Dialog */}
        <TaskAuditDialog
          open={auditDialogOpen}
          taskId={workToAudit?.TaskId || null}
          onClose={() => {
            setAuditDialogOpen(false);
            setWorkToAudit(null);
          }}
        />
      </Stack>
    </Container>
  );
};
