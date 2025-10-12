// src/features/work/pages/WeeklySchedulePage/types/weeklySchedule.types.ts
import type { LotDetail } from '../../../interfaces/work.interfaces';

/**
 * 📅 Información del día formateada para UI
 */
export interface DayInfo {
  name: string;
  number: string;
  isToday: boolean;
  dateKey: string;
  fullDate: string;
}

/**
 * 📋 Datos del día con tareas
 */
export interface DayData {
  date: Date;
  dateKey: string;
  dayInfo: DayInfo;
  tasks: LotDetail[];
}

/**
 * 🎯 Posición del menú contextual
 */
export interface ContextMenuPosition {
  mouseX: number;
  mouseY: number;
}

/**
 * 📊 Estado de acciones sobre tareas
 */
export interface WorkActionState {
  loading: boolean;
  error: string | null;
}
