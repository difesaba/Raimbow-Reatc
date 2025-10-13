// src/features/work/pages/WeeklySchedulePage/utils/taskMappers.ts
import type { LotDetail } from '../../../interfaces/work.interfaces';
import type { WorkAssignment } from '../../../components/AssignManagerDialog/AssignManagerDialog.types';
import { getStartDate, getEndDate } from './dateHelpers';

/**
 * 🔄 Mapear LotDetail a WorkAssignment
 * Transforma los datos del backend al formato esperado por los diálogos
 */
export const mapLotDetailToWorkAssignment = (lotDetail: LotDetail): WorkAssignment => ({
  TaskId: lotDetail.TaskId || 0,
  LotId: lotDetail.LoteId,
  Town: lotDetail.IsTownHome,
  Sub: lotDetail.SubdivisionId,
  Status: lotDetail.ProgressStatusId,
  UserRainbow: lotDetail.UserId,
  Obs: lotDetail.Obs || '',
  StartDate: getStartDate(lotDetail),
  EndDate: getEndDate(lotDetail),
  Completed: lotDetail.IsComplete === 1,
  // Extended fields
  Number: lotDetail.Number,
  WorkName: typeof lotDetail.Progress === 'string'
    ? lotDetail.Progress
    : `Progreso ${lotDetail.Progress}`,
  ClientName: lotDetail.SubName,
  ManagerName: lotDetail.Manager,
  ScheduledDate: getStartDate(lotDetail),
  Days: lotDetail.Days || lotDetail.WorkDays || 1,
  SFQuantity: lotDetail.SFQuantity,
  Colors: lotDetail.Colors,
  DoorDesc: lotDetail.DoorDesc
});

/**
 * 🔍 Validar si una tarea tiene ID válido
 * @param task - Tarea a validar
 * @returns true si la tarea tiene un TaskId válido
 */
export const hasValidTaskId = (task: LotDetail | null): boolean => {
  if (!task) return false;

  const taskId = task.TaskId;

  // Manejar null o undefined
  if (taskId === null || taskId === undefined) return false;

  // Convertir a número si es string
  const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;

  // Validar que sea un número válido mayor a 0
  return !isNaN(numericId) && numericId > 0;
};
