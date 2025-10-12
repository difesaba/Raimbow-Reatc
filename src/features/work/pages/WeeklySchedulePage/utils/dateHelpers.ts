// src/features/work/pages/WeeklySchedulePage/utils/dateHelpers.ts
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { LotDetail } from '../../../interfaces/work.interfaces';

/**
 * 🗓️ Obtener fecha de inicio prioritaria
 * Prioridad: StartDate → InitialDate
 */
export const getStartDate = (task: LotDetail): string => {
  return (task.StartDate && task.StartDate.trim() !== '')
    ? task.StartDate
    : task.InitialDate || '';
};

/**
 * 🗓️ Obtener fecha de fin prioritaria
 * Prioridad: EndDateTask → EndDate
 */
export const getEndDate = (task: LotDetail): string => {
  return (task.EndDateTask && task.EndDateTask.trim() !== '')
    ? task.EndDateTask
    : task.EndDate || '';
};

/**
 * 📅 Formatear fecha a YYYY-MM-DD
 * @param date - Fecha a formatear
 * @returns Fecha en formato YYYY-MM-DD
 */
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 📅 Formatear rango de semana para mostrar
 * @param start - Fecha de inicio
 * @param end - Fecha de fin
 * @returns Texto formateado del rango
 */
export const formatWeekRange = (start: Date, end: Date): string => {
  return `${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM yyyy', { locale: es })}`;
};

/**
 * 📅 Obtener información del día
 * @param day - Fecha del día
 * @returns Objeto con información formateada del día
 */
export const getDayInfo = (day: Date) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const dateKey = format(day, 'yyyy-MM-dd');

  return {
    name: format(day, 'EEEE', { locale: es }),
    number: format(day, 'd'),
    isToday: dateKey === today,
    dateKey,
    fullDate: format(day, "EEEE d 'de' MMMM", { locale: es })
  };
};
