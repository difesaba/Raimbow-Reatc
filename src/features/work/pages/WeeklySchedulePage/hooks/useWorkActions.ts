// src/features/work/pages/WeeklySchedulePage/hooks/useWorkActions.ts
import { useState, useCallback } from 'react';
import { WorkService } from '../../../services/work.service';
import type { LotDetail, NotificationResult } from '../../../interfaces/work.interfaces';
import type { Manager } from '../../../components/AssignManagerDialog/AssignManagerDialog.types';
import { getStartDate, getEndDate, formatDateToISO } from '../utils/dateHelpers';
import { hasValidTaskId } from '../utils/taskMappers';

/**
 * 🎯 Hook para acciones sobre tareas
 * Encapsula toda la lógica de actualización y manejo de errores
 */
export const useWorkActions = (
  onSuccess: () => void,
  updateTaskInState?: (taskId: number, updates: Partial<LotDetail>) => void
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<NotificationResult | null>(null);

  // TODO: Obtener user del contexto de autenticación
  const currentUserId = 1; // Temporal, debería venir del auth context

  /**
   * ✅ Toggle estado completado con actualización optimista
   */
  const toggleCompleted = useCallback(async (task: LotDetail): Promise<boolean> => {
    if (!hasValidTaskId(task)) {
      setError('No se puede actualizar el estado de una tarea sin ID');
      return false;
    }

    setLoading(true);
    setError(null);

    // Invertir el estado actual
    const newCompletedState = !(task.Completed === 1 || task.Completed === true);

    console.log('🔄 Toggling task completed state (optimistic):', {
      TaskId: task.TaskId,
      CurrentState: task.Completed,
      NewState: newCompletedState
    });

    // 1️⃣ ACTUALIZACIÓN OPTIMISTA: Actualizar UI inmediatamente
    if (updateTaskInState) {
      updateTaskInState(task.TaskId!, {
        Completed: newCompletedState ? 1 : 0
      });
    }

    try {
      // 2️⃣ Enviar al backend en segundo plano
      await WorkService.updateWork({
        TaskId: task.TaskId!,
        StartDate: getStartDate(task) || formatDateToISO(new Date()),
        EndDate: getEndDate(task) || formatDateToISO(new Date()),
        Completed: newCompletedState,
        Obs: task.Obs || '',
        UserRainbow: task.UserId || 0,
        User: currentUserId
      });

      console.log('✅ Task completed state updated successfully in backend');
      // ✅ NO llamar onSuccess() para evitar refresh innecesario
      return true;
    } catch (err: unknown) {
      console.error('❌ Error toggling completed state, reverting...', err);

      // 3️⃣ REVERTIR: Si falla el backend, volver al estado original
      if (updateTaskInState) {
        updateTaskInState(task.TaskId!, {
          Completed: task.Completed
        });
      }

      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage || 'Error al actualizar el estado de la tarea');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId, updateTaskInState]);

  /**
   * 👤 Asignar manager a tarea
   */
  const assignManager = useCallback(async (task: LotDetail, manager: Manager): Promise<boolean> => {
    if (!hasValidTaskId(task)) {
      setError('No se puede asignar manager a una tarea sin ID');
      return false;
    }

    setLoading(true);
    setError(null);
    setLastNotification(null);

    try {
      console.log('👤 Assigning manager:', { TaskId: task.TaskId, ManagerId: manager.id });

      const updateResponse = await WorkService.updateWork({
        TaskId: task.TaskId!,
        UserRainbow: manager.id,
        User: currentUserId,
        StartDate: getStartDate(task) || formatDateToISO(new Date()),
        EndDate: getEndDate(task) || formatDateToISO(new Date()),
        Completed: task.Completed === 1,
        Obs: task.Obs || ''
      });

      // Capturar y almacenar notificationResult
      if (updateResponse.notification) {
        setLastNotification(updateResponse.notification);
        console.log('📱 Notification from assignManager:', updateResponse.notification);
      }

      console.log('✅ Manager assigned successfully');
      onSuccess();
      return true;
    } catch (err: unknown) {
      console.error('❌ Error assigning manager:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage || 'Error al asignar el manager');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId, onSuccess]);

  /**
   * 📅 Actualizar fechas de tarea
   */
  const updateDates = useCallback(async (
    task: LotDetail,
    newStartDate: string,
    newEndDate: string
  ): Promise<boolean> => {
    if (!hasValidTaskId(task)) {
      setError('No se puede actualizar la fecha de una tarea sin ID');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📅 Updating task dates:', {
        TaskId: task.TaskId,
        newStartDate,
        newEndDate
      });

      await WorkService.updateWork({
        TaskId: task.TaskId!,
        StartDate: newStartDate,
        EndDate: newEndDate,
        Completed: task.Completed === 1,
        Obs: task.Obs || '',
        UserRainbow: task.UserId || 0,
        User: currentUserId
      });

      console.log('✅ Task dates updated successfully');
      onSuccess();
      return true;
    } catch (err: unknown) {
      console.error('❌ Error updating dates:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage || 'Error al actualizar las fechas');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId, onSuccess]);

  /**
   * 🧹 Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 🧹 Limpiar notificación
   */
  const clearNotification = useCallback(() => {
    setLastNotification(null);
  }, []);

  /**
   * ✅ Toggle estado verificado con actualización optimista
   */
  const toggleVerify = useCallback(async (task: LotDetail): Promise<boolean> => {
    if (!hasValidTaskId(task)) {
      setError('No se puede actualizar la verificación de una tarea sin ID');
      return false;
    }

    setLoading(true);
    setError(null);

    // Invertir el estado actual
    const newVerifyState = !(task.Verify === 1 || task.Verify === true);

    console.log('🔄 Toggling task verify state (optimistic):', {
      TaskId: task.TaskId,
      CurrentState: task.Verify,
      NewState: newVerifyState
    });

    // 1️⃣ ACTUALIZACIÓN OPTIMISTA: Actualizar UI inmediatamente
    if (updateTaskInState) {
      updateTaskInState(task.TaskId!, {
        Verify: newVerifyState ? 1 : 0
      });
    }

    try {
      // 2️⃣ Enviar al backend en segundo plano
      await WorkService.updateWork({
        TaskId: task.TaskId!,
        StartDate: getStartDate(task) || formatDateToISO(new Date()),
        EndDate: getEndDate(task) || formatDateToISO(new Date()),
        Completed: task.Completed === 1,
        Verify: newVerifyState,
        Obs: task.Obs || '',
        UserRainbow: task.UserId || 0,
        User: currentUserId
      });

      console.log('✅ Task verify state updated successfully in backend');
      // ✅ NO llamar onSuccess() para evitar refresh innecesario
      return true;
    } catch (err: unknown) {
      console.error('❌ Error toggling verify state, reverting...', err);

      // 3️⃣ REVERTIR: Si falla el backend, volver al estado original
      if (updateTaskInState) {
        updateTaskInState(task.TaskId!, {
          Verify: task.Verify
        });
      }

      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage || 'Error al actualizar el estado de verificación');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUserId, updateTaskInState]);

  return {
    loading,
    error,
    lastNotification,
    toggleCompleted,
    assignManager,
    updateDates,
    toggleVerify,
    clearError,
    clearNotification
  };
};
