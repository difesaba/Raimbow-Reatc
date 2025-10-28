import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Alert,
  Paper,
  Box,
  Stack,
  Divider,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { WorkService } from '../../services/work.service';
import { WorkAssignmentFilters } from '../../components/WorkAssignmentFilters';
import { WorkAssignmentTable } from '../../components/WorkAssignmentTable';
import { TaskEditDialog } from '../../components/TaskEditDialog';
import { TaskAuditDialog } from '../../components/TaskAuditDialog';
import { TaskDetailDialog } from '../../components/TaskDetailDialog';
import { useAuthUser } from '../../../auth/store/authStore';
import type { Work, NotificationResult } from '../../interfaces/work.interfaces';
import type { TaskEditFormData } from '../../components/TaskEditDialog/TaskEditDialog.types';
import type { FilterStatus } from '../../components/WorkAssignmentFilters/WorkAssignmentFilters.types';

/**
 * Extended Work interface with manager information
 */
interface WorkAssignment extends Work {
  ManagerName?: string;
  ClientName?: string;
  WorkName?: string;
  ScheduledDate?: string;
  Number?: string;
  Days?: number; // Duration of the task in days
  SFQuantity?: number | string;
  Colors?: string;
  DoorDesc?: string;
  StainDesc?: string;
  Address?: string; // Dirección de la obra/lote
}

/**
 * Work Assignment Page
 * Main page for viewing and assigning work tasks to managers
 */
export const WorkAssignmentPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get current authenticated user
  const currentUser = useAuthUser();

  // State management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [works, setWorks] = useState<WorkAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [progressFilter, setProgressFilter] = useState<string>('all');

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [workToEdit, setWorkToEdit] = useState<WorkAssignment | null>(null);

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [workToViewDetail, setWorkToViewDetail] = useState<WorkAssignment | null>(null);

  // Audit dialog state
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [workToAudit, setWorkToAudit] = useState<WorkAssignment | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<WorkAssignment | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Force re-render key for table
  const [refreshKey, setRefreshKey] = useState(0);

  // Guard to prevent multiple simultaneous save operations
  const [isSaving, setIsSaving] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
    completionRate: 0
  });

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get unique progress types from current works
  const getUniqueProgress = (): string[] => {
    const uniqueSet = new Set<string>();
    works.forEach(work => {
      if (work.WorkName) {
        uniqueSet.add(work.WorkName);
      }
    });
    return Array.from(uniqueSet).sort();
  };

  // Filter works based on all filters
  const getFilteredWorks = (): WorkAssignment[] => {
    let filtered = works;

    // 1. Filtrar por estado (all/pending/in_progress/completed)
    switch (filterStatus) {
      case 'pending':
        // Pendientes: Sin asignar y no completadas
        filtered = filtered.filter(work => !work.UserRainbow && work.Completed !== true);
        break;
      case 'in_progress':
        // En progreso: Asignadas pero no completadas
        filtered = filtered.filter(work => work.UserRainbow && work.Completed !== true);
        break;
      case 'completed':
        // Completadas: Marcadas como completadas
        filtered = filtered.filter(work => work.Completed === true);
        break;
      case 'all':
      default:
        // No filtrar
        break;
    }

    // 2. Filtrar por tipo de trabajo (Progress/WorkName)
    if (progressFilter !== 'all') {
      filtered = filtered.filter(work => work.WorkName === progressFilter);
    }

    return filtered;
  };

  // Handle filter change
  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilterStatus(newFilter);
  };

  // Fetch works for selected date
  const fetchWorks = async () => {
    setLoading(true);
    setError(null);
    setStatsLoaded(false);

    try {
      const formattedDate = formatDate(selectedDate);
      const response = await WorkService.getWorksByDay(formattedDate);

      // La respuesta ahora viene con: { ok, total, data: LotDetail[] }
      const lotDetails = response.data || [];

      // Transform LotDetail data to WorkAssignment
      const transformedWorks: WorkAssignment[] = lotDetails.map((detail, index) => {
        // 🔍 DEBUG: Log completo del objeto para identificar campos disponibles
        if (index === 0) {
          console.log('🔍 DEBUG - Estructura completa del primer detalle del backend:');
          console.table(detail);
          console.log('📋 Todos los campos disponibles:', Object.keys(detail));
        }

        // 🔍 DEBUG: Log del campo address en cada registro
        console.log(`🏠 DEBUG - Lote ${index + 1} - Address:`, {
          'address (minúscula)': (detail as any).address,
          'Address (mayúscula)': (detail as any).Address,
          'Valor que se guardará': (detail as any).address || (detail as any).Address || undefined
        });

        // 🔧 Procesar Progress - puede venir como "Final Paint - Lote 72" o como ID numérico
        const progressValue = detail.Progress as any;
        let workName: string = String(progressValue);
        let lotNumber = detail.Number;

        // Si Progress es un string con formato "Nombre - Lote XX", separarlo
        if (typeof progressValue === 'string' && workName.includes(' - Lote ')) {
          const parts = workName.split(' - Lote ');
          workName = parts[0]; // "Final Paint"

          // Si Number no existe, extraerlo del Progress
          if (!lotNumber && parts[1]) {
            lotNumber = parts[1]; // "72"
          }
        }

        // 🔍 Mapear TaskId: IMPORTANTE - Preservar null/undefined distintos de 0
        // - Si TaskId es un número > 0: tarea existente
        // - Si TaskId es null/undefined: tarea nueva (sin asignar aún)
        // - Si TaskId es 0: tarea nueva
        const taskId = detail.TaskId ?? 0; // Usar nullish coalescing para preservar 0 si viene del backend

        console.log(`🔍 DEBUG - Lote ${index + 1}:`, {
          'TaskId backend RAW': detail.TaskId,
          'TaskId backend type': typeof detail.TaskId,
          'TaskId backend === null': detail.TaskId === null,
          'TaskId backend === undefined': detail.TaskId === undefined,
          'TaskId mapeado': taskId,
          'Es tarea nueva (TaskId === 0)': taskId === 0,
          'Number original': detail.Number,
          'Progress original': detail.Progress,
          'Number procesado': lotNumber,
          'WorkName procesado': workName
        });

        // 📅 Lógica de fechas:
        // - Primera asignación (TaskId = 0): Usar InitialDate y EndDate del proyecto
        // - Edición (TaskId > 0): Usar StartDate y EndDateTask guardadas, con fallback a fechas del proyecto
        const mappedStartDate = taskId === 0
          ? detail.InitialDate  // Primera asignación: pre-cargar fecha del proyecto
          : (detail.StartDate && detail.StartDate !== '' ? detail.StartDate : detail.InitialDate); // Edición: fecha guardada o fallback

        const mappedEndDate = taskId === 0
          ? detail.EndDate  // Primera asignación: pre-cargar fecha fin del proyecto
          : (detail.EndDateTask && detail.EndDateTask !== '' ? detail.EndDateTask : detail.EndDate); // Edición: fecha guardada o fallback

        // Formatear ScheduledDate para la tabla (sin conversión de zona horaria)
        const scheduledDate = detail.InitialDate
          ? (() => {
              const [year, month, day] = detail.InitialDate.split('T')[0].split('-');
              return `${day}/${month}/${year}`; // Formato dd/MM/yyyy
            })()
          : 'Sin fecha';

        console.log(`📅 Mapeo de fechas - Lote ${index + 1}:`, {
          TaskId: taskId,
          'InitialDate (proyecto) RAW': detail.InitialDate,
          'EndDate (proyecto)': detail.EndDate,
          'StartDate (tarea)': detail.StartDate,
          'EndDateTask (tarea)': detail.EndDateTask,
          '→ StartDate mapeado': mappedStartDate,
          '→ EndDate mapeado': mappedEndDate,
          '→ ScheduledDate formateado': scheduledDate
        });

        return {
          TaskId: taskId,
          LotId: detail.LoteId,
          Town: detail.IsTownHome ? 1 : 0,
          Sub: detail.SubdivisionId,
          Status: detail.ProgressStatusId,
          UserRainbow: detail.UserId || undefined,
          Obs: detail.Obs || '',
          StartDate: mappedStartDate,
          EndDate: mappedEndDate,
          Completed: detail.IsComplete === 1,
          // Extended fields for display
          Number: lotNumber,
          WorkName: workName,
          ClientName: detail.SubName,
          ManagerName: detail.Manager || undefined,
          ScheduledDate: scheduledDate, // InitialDate formateado como dd/MM/yyyy
          Days: detail.Days || detail.WorkDays || 1, // Task duration in days
          SFQuantity: detail.SFQuantity,
          Colors: detail.Colors,
          DoorDesc: detail.DoorDesc,
          StainDesc: detail.StainDesc,
          Address: detail.address || (detail as any).Address || undefined, // Dirección de la obra (intentar minúscula y mayúscula)
          InitialDate: detail.InitialDate // Fecha inicial del proyecto (para validación de rango)
        };
      });

      setWorks(transformedWorks);

      // Calculate statistics
      const assigned = transformedWorks.filter(w => w.ManagerName).length;
      const unassigned = transformedWorks.length - assigned;
      const completionRate = transformedWorks.length > 0
        ? Math.round((assigned / transformedWorks.length) * 100)
        : 0;

      setStats({
        total: transformedWorks.length,
        assigned,
        unassigned,
        completionRate
      });

      setTimeout(() => setStatsLoaded(true), 300);
    } catch (err: unknown) {
      console.error('Error fetching works:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los trabajos del día';
      setError(errorMessage);
      setWorks([]);
      setStats({ total: 0, assigned: 0, unassigned: 0, completionRate: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit work
  const handleEdit = (work: WorkAssignment) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 handleEdit - Opening edit dialog');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Work completo:', work);
    console.log('🆔 TaskId details:', {
      TaskId: work.TaskId,
      'TaskId type': typeof work.TaskId,
      'TaskId value': work.TaskId,
      'Is null?': work.TaskId === null,
      'Is undefined?': work.TaskId === undefined,
      'Is 0?': work.TaskId === 0,
      'Is > 0?': work.TaskId ? work.TaskId > 0 : false,
      'Will be detected as NEW?': !work.TaskId || work.TaskId === 0,
      'Will be detected as UPDATE?': work.TaskId && work.TaskId > 0
    });
    console.log('📊 Work info:', {
      LotId: work.LotId,
      Status: work.Status,
      ManagerName: work.ManagerName,
      WorkName: work.WorkName,
      Number: work.Number
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    setWorkToEdit(work);
    setEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async (data: TaskEditFormData): Promise<NotificationResult | undefined> => {
    if (!workToEdit) return undefined;

    // 🛡️ Guard: Prevent multiple simultaneous saves
    if (isSaving) {
      console.warn('⚠️ handleSaveEdit - Already saving, ignoring duplicate call');
      return undefined;
    }

    console.log('💾 handleSaveEdit - Starting save with workToEdit:', {
      'workToEdit.TaskId': workToEdit.TaskId,
      'workToEdit.TaskId type': typeof workToEdit.TaskId,
      'workToEdit.TaskId === null': workToEdit.TaskId === null,
      'workToEdit.TaskId === undefined': workToEdit.TaskId === undefined,
      'workToEdit.TaskId === 0': workToEdit.TaskId === 0,
      'workToEdit.TaskId > 0': workToEdit.TaskId ? workToEdit.TaskId > 0 : false,
      'Full workToEdit object': workToEdit
    });

    setIsSaving(true);

    try {
      // Determinar si es CREATE o UPDATE basado en TaskId Y si ya tiene manager asignado
      // Si ya tiene UserRainbow (manager asignado), SIEMPRE debe ser UPDATE, incluso si TaskId es 0
      const hasManager = !!workToEdit.UserRainbow || !!workToEdit.ManagerName;
      const isNewTask = (!workToEdit.TaskId || workToEdit.TaskId === 0) && !hasManager;

      console.log(`🔍 Decision: isNewTask = ${isNewTask}`, {
        'TaskId': workToEdit.TaskId,
        'UserRainbow': workToEdit.UserRainbow,
        'ManagerName': workToEdit.ManagerName,
        'hasManager': hasManager,
        'Will CREATE': isNewTask,
        'Will UPDATE': !isNewTask
      });

      let notificationResult: NotificationResult | undefined;

      if (isNewTask) {
        // CREATE: La tarea no existe, crear nueva con fechas incluidas
        console.log('✨ Creating new task with dates:', {
          LotId: workToEdit.LotId,
          Manager: data.manager.name,
          StartDate: data.startDate,
          EndDate: data.endDate,
          Completed: data.completed
        });

        // PASO 1: Crear la tarea con fechas incluidas
        // Validar que el usuario de sesión esté disponible
        if (!currentUser?.UserId) {
          throw new Error('Usuario de sesión no disponible. Por favor, inicia sesión nuevamente.');
        }

        const createResponse = await WorkService.createWork({
          LotId: workToEdit.LotId!,
          Town: workToEdit.Town!,
          Sub: workToEdit.Sub!,
          Status: workToEdit.Status || 4,
          UserRainbow: data.manager.id,
          Obs: data.observations,
          User: currentUser.UserId,
          StartDate: data.startDate || '',
          EndDate: data.endDate || ''
        });

        // Capturar notificationResult del CREATE
        notificationResult = createResponse.notification;
        console.log('📱 Notification from CREATE response:', notificationResult);
        console.log('📱 Notification JSON completo:', JSON.stringify(notificationResult, null, 2));

        // Obtener el nuevo TaskId
        const newTaskId = createResponse.data?.TaskId ||
                          (createResponse as any).TaskId ||
                          (createResponse as any).taskId;

        console.log('✅ Task created with TaskId:', newTaskId);

        // PASO 2: Actualizar fechas (respaldo - las fechas ya se enviaron en el CREATE)
        // Este UPDATE se mantiene como redundancia para garantizar que las fechas se guarden
        if (newTaskId && (data.startDate || data.endDate)) {
          console.log('📅 Updating dates (backup) for newly created task:', {
            TaskId: newTaskId,
            StartDate: data.startDate,
            EndDate: data.endDate
          });

          const updateResponse = await WorkService.updateWork({
            TaskId: newTaskId,
            UserRainbow: data.manager.id,
            User: currentUser.UserId,
            StartDate: data.startDate || '',
            EndDate: data.endDate || '',
            Completed: false, // Primera asignación siempre es false
            Obs: data.observations
          });

          // Sobrescribir notificationResult con el del UPDATE (más reciente)
          if (updateResponse.notification) {
            notificationResult = updateResponse.notification;
            console.log('📱 Notification from UPDATE response:', notificationResult);
            console.log('📱 Notification JSON completo:', JSON.stringify(notificationResult, null, 2));
          }
        }

        // Actualizar el work localmente
        setWorks(prev => {
          console.log('🔄 Actualizando estado local después de CREATE');
          console.log('🔍 Buscando work con:', {
            LotId: workToEdit.LotId,
            Status: workToEdit.Status,
            'TaskId actual': workToEdit.TaskId
          });

          const updatedWorks = prev.map(work => {
            const matches = work.LotId === workToEdit.LotId &&
                            work.Status === workToEdit.Status &&
                            (!work.TaskId || work.TaskId === 0);

            console.log(`🔍 Comparando con work:`, {
              'work.LotId': work.LotId,
              'work.Status': work.Status,
              'work.TaskId': work.TaskId,
              'work.Number': work.Number,
              matches
            });

            if (matches) {
              console.log('✅ Match encontrado! Actualizando con TaskId:', newTaskId);
              return {
                ...work,
                TaskId: newTaskId,
                UserRainbow: data.manager.id,
                ManagerName: data.manager.name,
                StartDate: data.startDate,
                EndDate: data.endDate,
                Completed: false, // Primera asignación siempre es false
                Obs: data.observations
              };
            }
            return work;
          });

          console.log('🔄 Estado actualizado. Verificando resultado...');
          const updatedWork = updatedWorks.find(w =>
            w.LotId === workToEdit.LotId && w.Status === workToEdit.Status
          );
          console.log('✅ Work después de actualizar:', updatedWork);

          return updatedWorks;
        });

        // 🔄 CRÍTICO: Actualizar workToEdit con el nuevo TaskId
        // Esto previene intentos de crear duplicados si el usuario guarda nuevamente sin cerrar el modal
        setWorkToEdit(prev => {
          if (!prev) return null;

          console.log('🔄 Actualizando workToEdit con nuevo TaskId:', newTaskId);
          return {
            ...prev,
            TaskId: newTaskId,
            UserRainbow: data.manager.id,
            ManagerName: data.manager.name,
            StartDate: data.startDate,
            EndDate: data.endDate,
            Completed: false,
            Obs: data.observations
          };
        });

        // Recalcular stats
        setStats(prevStats => ({
          ...prevStats,
          assigned: prevStats.assigned + 1,
          unassigned: prevStats.unassigned - 1,
          completionRate: prevStats.total > 0
            ? Math.round(((prevStats.assigned + 1) / prevStats.total) * 100)
            : 0
        }));
      } else {
        // UPDATE: La tarea ya existe
        console.log('✏️ Updating existing task:', {
          TaskId: workToEdit.TaskId,
          Manager: data.manager.name,
          Completed: data.completed
        });

        // 🛡️ Validación: Si no tiene TaskId válido pero tiene manager, hay un problema de sincronización
        if (!workToEdit.TaskId || workToEdit.TaskId <= 0) {
          const errorMsg = `Error de sincronización: La tarea tiene manager asignado (${workToEdit.ManagerName}) pero TaskId inválido (${workToEdit.TaskId}). Por favor, recarga la página.`;
          console.error('❌', errorMsg);
          throw new Error(errorMsg);
        }

        // Validar que el usuario de sesión esté disponible
        if (!currentUser?.UserId) {
          throw new Error('Usuario de sesión no disponible. Por favor, inicia sesión nuevamente.');
        }

        const updatePayload = {
          TaskId: workToEdit.TaskId,
          UserRainbow: data.manager.id,
          User: currentUser.UserId,
          StartDate: data.startDate,
          EndDate: data.endDate,
          Completed: data.completed,
          Obs: data.observations
        };

        console.log('📤 Payload completo del UPDATE:', updatePayload);
        console.log('📅 Fechas que se envían:', {
          'StartDate enviado': data.startDate,
          'EndDate enviado': data.endDate,
          'Formato correcto': data.startDate?.includes('-') ? 'YYYY-MM-DD ✅' : '❌ Formato incorrecto'
        });

        const updateResponse = await WorkService.updateWork(updatePayload);

        // Capturar notificationResult
        notificationResult = updateResponse.notification;
        console.log('📱 Notification from UPDATE response:', notificationResult);
        console.log('📱 Notification JSON completo:', JSON.stringify(notificationResult, null, 2));

        const wasUnassigned = !workToEdit.ManagerName;

        // Actualizar localmente
        setWorks(prev => prev.map(work =>
          work.TaskId === workToEdit.TaskId
            ? {
                ...work,
                UserRainbow: data.manager.id,
                ManagerName: data.manager.name,
                StartDate: data.startDate,
                EndDate: data.endDate,
                Completed: data.completed,
                Obs: data.observations
              }
            : work
        ));

        // 🔄 Actualizar workToEdit para mantener sincronización
        setWorkToEdit(prev => {
          if (!prev) return null;

          console.log('🔄 Actualizando workToEdit después de UPDATE exitoso');
          return {
            ...prev,
            UserRainbow: data.manager.id,
            ManagerName: data.manager.name,
            StartDate: data.startDate,
            EndDate: data.endDate,
            Completed: data.completed,
            Obs: data.observations
          };
        });

        // Recalcular stats si cambió de sin asignar a asignado
        if (wasUnassigned) {
          setStats(prevStats => ({
            ...prevStats,
            assigned: prevStats.assigned + 1,
            unassigned: prevStats.unassigned - 1,
            completionRate: prevStats.total > 0
              ? Math.round(((prevStats.assigned + 1) / prevStats.total) * 100)
              : 0
          }));
        }
      }

      setRefreshKey(prev => prev + 1);

      // Solo cerrar el diálogo si no hay notificationResult para mostrar
      if (!notificationResult) {
        setEditDialogOpen(false);
        setWorkToEdit(null);
      }

      // Retornar el notificationResult para que TaskEditDialog lo muestre
      return notificationResult;
    } catch (err: unknown) {
      console.error('❌ Error saving changes:', err);
      throw err; // Re-throw para que TaskEditDialog lo maneje
    } finally {
      // 🛡️ Liberar el guard sin importar si tuvo éxito o falló
      setIsSaving(false);
      console.log('✅ handleSaveEdit - Save operation completed, guard released');
    }
  };

  // Handle delete work
  const handleDeleteWork = (work: WorkAssignment) => {
    // Solo permitir eliminar tareas con TaskId válido
    if (!work.TaskId || work.TaskId <= 0) {
      setError('No se puede eliminar una tarea que no ha sido creada aún');
      return;
    }

    setWorkToDelete(work);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!workToDelete || !workToDelete.TaskId || workToDelete.TaskId <= 0) {
      setError('No se puede eliminar una tarea sin ID válido');
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      // Validar que el usuario de sesión esté disponible
      if (!currentUser?.UserId) {
        throw new Error('Usuario de sesión no disponible. Por favor, inicia sesión nuevamente.');
      }

      console.log('🗑️ Deleting work:', workToDelete.TaskId);

      await WorkService.deleteWork({
        taskId: workToDelete.TaskId,
        userId: currentUser.UserId
      });

      console.log('✅ Work deleted successfully');

      // ✅ Actualizar estado local eliminando la tarea
      setWorks(prev => prev.filter(work => work.TaskId !== workToDelete.TaskId));

      // ✅ Recalcular estadísticas
      const wasAssigned = !!workToDelete.ManagerName;
      setStats(prevStats => ({
        total: prevStats.total - 1,
        assigned: wasAssigned ? prevStats.assigned - 1 : prevStats.assigned,
        unassigned: !wasAssigned ? prevStats.unassigned - 1 : prevStats.unassigned,
        completionRate: prevStats.total > 1
          ? Math.round((wasAssigned ? prevStats.assigned - 1 : prevStats.assigned) / (prevStats.total - 1) * 100)
          : 0
      }));

      // Cerrar dialog
      setDeleteDialogOpen(false);
      setWorkToDelete(null);
    } catch (err: unknown) {
      console.error('❌ Error deleting work:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Handle view details
  const handleViewDetails = (work: WorkAssignment) => {
    setWorkToViewDetail(work);
    setDetailDialogOpen(true);
  };

  // Handle view audit
  const handleViewAudit = (work: WorkAssignment) => {
    setWorkToAudit(work);
    setAuditDialogOpen(true);
  };

  // Initial load
  useEffect(() => {
    fetchWorks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="xl" sx={{ paddingX: { xs: 1, sm: 2, md: 3 } }}>
      <Stack spacing={{ xs: 2, md: 3 }} paddingY={{ xs: 2, md: 3 }}>
        {/* Page Header */}
        <Box paddingX={{ xs: 1, md: 0 }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
            Asignación de Trabajo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta las tareas programadas y asigna responsables de forma sencilla
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  TOTAL DE TRABAJOS
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color="primary">
                    {stats.total}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  ASIGNADOS
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color="success.main">
                    {stats.assigned}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  SIN ASIGNAR
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color={stats.unassigned > 0 ? "warning.main" : "text.secondary"}>
                    {stats.unassigned}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  TASA DE ASIGNACIÓN
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color="info.main">
                    {stats.completionRate}%
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Content Paper */}
        <Paper elevation={0} sx={{ padding: { xs: 0, md: 0 } }}>
          <Box>
            {/* Filters Section */}
            <WorkAssignmentFilters
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onSearch={fetchWorks}
              loading={loading}
              filterStatus={filterStatus}
              onFilterChange={handleFilterChange}
              progressFilter={progressFilter}
              onProgressFilterChange={setProgressFilter}
              availableProgress={getUniqueProgress()}
            />

            <Divider />

            {/* Error Alert */}
            {error && (
              <Box margin={{ xs: 2, md: 3 }}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            )}

            {/* Warning for unassigned works */}
            {!loading && stats.unassigned > 0 && (
              <Box margin={{ xs: 2, md: 3 }}>
                <Alert severity="warning">
                  Hay {stats.unassigned} trabajo{stats.unassigned > 1 ? 's' : ''} sin manager asignado.
                  Por favor, revisa y asigna los responsables correspondientes.
                </Alert>
              </Box>
            )}

            {/* Results Table */}
            <Box padding={{ xs: 0, md: 3 }}>
              <WorkAssignmentTable
                key={refreshKey}
                works={getFilteredWorks()}
                loading={loading}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
                onViewAudit={handleViewAudit}
                onDeleteWork={handleDeleteWork}
              />
            </Box>
          </Box>
        </Paper>

        {/* Edit Task Dialog */}
        <TaskEditDialog
          open={editDialogOpen}
          work={workToEdit}
          onClose={() => {
            // Permitir cerrar el diálogo incluso si hay notificaciones para mostrar
            setEditDialogOpen(false);
            setWorkToEdit(null);
          }}
          onConfirm={handleSaveEdit}
        />

        {/* Task Detail Dialog */}
        <TaskDetailDialog
          open={detailDialogOpen}
          task={workToViewDetail}
          onClose={() => {
            setDetailDialogOpen(false);
            setWorkToViewDetail(null);
          }}
          onEdit={() => {
            if (workToViewDetail) {
              setDetailDialogOpen(false);
              handleEdit(workToViewDetail);
            }
          }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>
              ¿Eliminar tarea?
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ padding: { xs: 2, md: 3 } }}>
            <Stack spacing={2}>
              <Alert severity="warning">
                Esta acción no se puede deshacer. ¿Estás seguro de eliminar esta tarea?
              </Alert>

              {workToDelete && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        TRABAJO
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {workToDelete.WorkName || 'Sin nombre'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        LOTE
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {workToDelete.Number || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        CLIENTE
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {workToDelete.ClientName || 'N/A'}
                      </Typography>
                    </Box>
                    {workToDelete.ManagerName && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          MANAGER ASIGNADO
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {workToDelete.ManagerName}
                        </Typography>
                      </Box>
                    )}
                    {workToDelete.SFQuantity && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          SQ FT
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {workToDelete.SFQuantity}
                        </Typography>
                      </Box>
                    )}
                    {workToDelete.Colors && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          COLORES
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {workToDelete.Colors}
                        </Typography>
                      </Box>
                    )}
                    {workToDelete.DoorDesc && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          DESCRIPCIÓN PUERTA
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {workToDelete.DoorDesc}
                        </Typography>
                      </Box>
                    )}
                    {workToDelete.StainDesc && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          STAIN
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {workToDelete.StainDesc}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              px: { xs: 2, md: 3 },
              py: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}
          >
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setWorkToDelete(null);
              }}
              disabled={deleting}
              color="inherit"
              fullWidth={isMobile}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleting}
              color="error"
              variant="contained"
              startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null}
              fullWidth={isMobile}
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

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
