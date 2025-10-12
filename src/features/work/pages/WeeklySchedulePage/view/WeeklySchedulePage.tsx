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
  useMediaQuery
} from '@mui/material';
import { format } from 'date-fns';
import { useWeeklySchedule } from '../../../hooks/useWeeklySchedule';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useWorkActions } from '../hooks/useWorkActions';
import { useExpandedDays } from '../hooks/useExpandedDays';
import { formatWeekRange, getDayInfo } from '../utils/dateHelpers';
import { mapLotDetailToWorkAssignment } from '../utils/taskMappers';
import { WeekNavigationBar } from '../components/WeekNavigationBar';
import { TaskContextMenu } from '../components/TaskContextMenu';
import { MobileWeekView } from './MobileWeekView';
import { DesktopWeekView } from './DesktopWeekView';
import { AssignManagerDialog } from '../../../components/AssignManagerDialog';
import { EditScheduledDateDialog } from '../../../components/EditScheduledDateDialog';
import { TaskDetailDialog } from '../../../components/TaskDetailDialog';
import type { LotDetail } from '../../../interfaces/work.interfaces';
import type { Manager } from '../../../components/AssignManagerDialog/AssignManagerDialog.types';

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

  // Hook de calendario semanal
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

  // Hook de acciones sobre tareas
  const {
    loading: actionLoading,
    error: actionError,
    toggleCompleted,
    assignManager,
    updateDates,
    clearError
  } = useWorkActions(refresh);

  // Hook para días expandidos en móvil
  const { expandedDays, toggleDay } = useExpandedDays(weekRange, weekDays);

  // Estados de UI
  const [selectedTask, setSelectedTask] = useState<LotDetail | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editDateDialogOpen, setEditDateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Determinar maxWidth del container
  const containerMaxWidth = isMobile ? false : isTablet ? 'lg' : 'xl';

  // Formatear rango de la semana
  const weekRangeText = formatWeekRange(weekRange.start, weekRange.end);

  // Obtener nombres de días para el header (memoizado)
  const dayNames = useMemo(() =>
    weekDays.map(day => getDayInfo(day)),
    [weekDays]
  );

  // Agrupar tareas por día para vista móvil (memoizado)
  const tasksByDay = useMemo(() =>
    weekDays.map((day, dayIndex) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const columnNumber = dayIndex + 1;

      // Filtrar tareas que se ejecutan en este día
      const dayTasks = tasksWithGridPositions.filter(task => {
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
    [weekDays, tasksWithGridPositions, dayNames]
  );

  /**
   * Manejadores de eventos
   */
  const handleTaskClick = useCallback((task: LotDetail, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedTask(task);
    setContextMenuPosition({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuPosition(null);
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

        {/* Error Alert */}
        {displayError && (
          <Alert severity="error" onClose={clearError}>
            {displayError}
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
          tasksWithGridPositions={tasksWithGridPositions}
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
          anchorPosition={contextMenuPosition}
          task={selectedTask}
          isAdmin={isAdmin}
          loading={actionLoading}
          onClose={handleCloseContextMenu}
          onViewDetails={() => {
            handleCloseContextMenu();
            setDetailDialogOpen(true);
          }}
          onAuditAssignment={() => {
            handleCloseContextMenu();
            setAssignDialogOpen(true);
          }}
          onAssignManager={() => {
            handleCloseContextMenu();
            setAssignDialogOpen(true);
          }}
          onEditDates={() => {
            handleCloseContextMenu();
            setEditDateDialogOpen(true);
          }}
          onToggleCompleted={handleToggleCompleted}
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
      </Stack>
    </Container>
  );
};
