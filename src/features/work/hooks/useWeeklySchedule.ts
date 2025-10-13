import { useState, useCallback, useEffect } from 'react';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  addDays,
  format,
  eachDayOfInterval,
  differenceInDays,
  min,
  max,
  parseISO,
  startOfDay
} from 'date-fns';
import { WorkService } from '../services/work.service';
import type { LotDetail } from '../interfaces/work.interfaces';

/**
 * 🔧 Extraer fecha limpia YYYY-MM-DD ignorando timezone
 *
 * Problema: El backend envía "2025-10-12T00:00:00.000Z" (UTC)
 * y parseISO() lo convierte al timezone local, causando offset de días.
 *
 * Solución: Extraer solo los primeros 10 caracteres (YYYY-MM-DD)
 * para evitar conversiones de timezone.
 */
const extractCleanDate = (dateString: string): string => {
  // Si la fecha tiene formato ISO con hora (YYYY-MM-DDTHH:mm:ss...),
  // extraer solo la parte de fecha
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  // Si ya es YYYY-MM-DD, retornarla tal cual
  return dateString.substring(0, 10);
};

/**
 * 🗓️ Obtener fecha de inicio con prioridad correcta
 * Prioridad: StartDate → InitialDate
 *
 * Nota: La fecha de fin se calcula automáticamente basándose en Days,
 * por lo que no necesitamos una función getTaskEndDate aquí.
 */
const getTaskStartDate = (task: LotDetail): string | null => {
  // Prioridad 1: StartDate
  if (task.StartDate && task.StartDate.trim() !== '') {
    return extractCleanDate(task.StartDate);
  }
  // Fallback: InitialDate
  if (task.InitialDate && task.InitialDate.trim() !== '') {
    return extractCleanDate(task.InitialDate);
  }
  return null;
};

/**
 * Tarea con información de posición en el grid
 */
export interface TaskWithGridPosition extends LotDetail {
  gridColumnStart: number; // 1-7 (Lunes-Domingo)
  gridColumnSpan: number;  // Días que ocupa
}

/**
 * 📅 Hook personalizado para calendario semanal de tareas
 *
 * Funcionalidades:
 * - ✅ Calcula semana actual (lunes-domingo)
 * - ✅ Obtiene tareas por rango de fechas
 * - ✅ Agrupa tareas por día
 * - ✅ Navegación entre semanas
 * - ✅ Manejo de estados de carga y error
 * - ✅ Filtrado por subdivisión opcional
 *
 * @param subdivisionId - ID de subdivisión para filtrar (opcional, -1 = todas)
 * @returns Objeto con datos, estados y funciones de control
 */
export const useWeeklySchedule = (subdivisionId?: number) => {
  // 📅 Fecha base de la semana (puede cambiar al navegar)
  const [currentDate, setCurrentDate] = useState(new Date());

  // 📊 Tareas cargadas
  const [tasks, setTasks] = useState<LotDetail[]>([]);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 📆 Calcular lunes y domingo de la semana actual
   *
   * IMPORTANTE: Usamos startOfDay() para normalizar las fechas a medianoche (00:00:00)
   * Esto evita problemas de comparación con fechas que vienen del backend sin hora
   */
  const getWeekRange = useCallback((date: Date) => {
    const monday = startOfDay(startOfWeek(date, { weekStartsOn: 1 })); // 1 = Lunes
    const sunday = startOfDay(endOfWeek(date, { weekStartsOn: 1 }));

    return {
      start: monday,
      end: sunday,
      startFormatted: format(monday, 'yyyy-MM-dd'),
      endFormatted: format(sunday, 'yyyy-MM-dd')
    };
  }, []);

  /**
   * 📅 Obtener array de días de la semana (lunes-domingo)
   */
  const getWeekDays = useCallback((date: Date): Date[] => {
    const { start, end } = getWeekRange(date);
    return eachDayOfInterval({ start, end });
  }, [getWeekRange]);

  /**
   * 🗂️ Agrupar tareas por día
   * Retorna un Map con clave = 'YYYY-MM-DD' y valor = LotDetail[]
   */
  const groupTasksByDay = useCallback((tasks: LotDetail[]): Map<string, LotDetail[]> => {
    const grouped = new Map<string, LotDetail[]>();

    tasks.forEach(task => {
      // Usar fecha de inicio con prioridad: StartDate → InitialDate
      // getTaskStartDate ya retorna la fecha limpia sin timezone
      const startDate = getTaskStartDate(task);
      if (startDate) {
        // startDate ya está en formato YYYY-MM-DD limpio, usarlo directamente como key
        const dateKey = startDate;

        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }

        grouped.get(dateKey)!.push(task);
      }
    });

    return grouped;
  }, []);

  /**
   * 📐 Calcular posición de tarea en el grid de 7 columnas
   *
   * @param task - Tarea a calcular
   * @param weekStart - Fecha de inicio de la semana (lunes)
   * @param weekEnd - Fecha de fin de la semana (domingo)
   * @returns Objeto con gridColumnStart y gridColumnSpan, o null si la tarea no se ve en esta semana
   */
  const calculateTaskGridPosition = useCallback((
    task: LotDetail,
    weekStart: Date,
    weekEnd: Date
  ): { gridColumnStart: number; gridColumnSpan: number } | null => {
    // Usar fecha de inicio con prioridad: StartDate → InitialDate
    const startDate = getTaskStartDate(task);
    if (!startDate) {
      return null;
    }

    // Fecha de inicio de la tarea (normalizada a medianoche con parseISO)
    const taskStart = startOfDay(parseISO(startDate));

    // Calcular fecha de fin basada en Days
    const taskDuration = task.Days || 1;
    const taskEnd = addDays(taskStart, taskDuration - 1); // -1 porque el día inicial cuenta

    // Verificar si la tarea se solapa con la semana visible
    if (taskEnd < weekStart || taskStart > weekEnd) {
      return null; // La tarea no se ve en esta semana
    }

    // Calcular el rango visible de la tarea dentro de la semana
    const visibleStart = max([taskStart, weekStart]);
    const visibleEnd = min([taskEnd, weekEnd]);

    // Calcular columna de inicio (1-7, donde 1 = Lunes)
    const gridColumnStart = differenceInDays(visibleStart, weekStart) + 1;

    // Calcular cuántas columnas ocupa (días visibles)
    const gridColumnSpan = differenceInDays(visibleEnd, visibleStart) + 1;

    // 🚨 IMPORTANTE: Limitar gridColumnSpan para que no se extienda más allá de la semana
    // La semana tiene 7 columnas (lunes-domingo), por lo que:
    // gridColumnStart + gridColumnSpan - 1 debe ser <= 7
    const maxSpan = 7 - gridColumnStart + 1;
    const limitedGridColumnSpan = Math.min(gridColumnSpan, maxSpan);

    return {
      gridColumnStart,
      gridColumnSpan: limitedGridColumnSpan
    };
  }, []);

  /**
   * 🎯 Procesar tareas y agregar información de posición en grid
   *
   * @param tasks - Array de tareas
   * @param weekStart - Fecha de inicio de la semana
   * @param weekEnd - Fecha de fin de la semana
   * @returns Array de tareas con información de posición, ordenadas por fecha
   */
  const getTasksWithGridPositions = useCallback((
    tasks: LotDetail[],
    weekStart: Date,
    weekEnd: Date
  ): TaskWithGridPosition[] => {
    const tasksWithPositions: TaskWithGridPosition[] = [];

    tasks.forEach(task => {
      const position = calculateTaskGridPosition(task, weekStart, weekEnd);

      if (position) {
        tasksWithPositions.push({
          ...task,
          ...position
        });
      }
    });

    // Ordenar por fecha de inicio para mejor visualización
    // getTaskStartDate ya retorna la fecha limpia sin timezone
    return tasksWithPositions.sort((a, b) => {
      const dateA = getTaskStartDate(a) || '1900-01-01'; // Fallback para tareas sin fecha
      const dateB = getTaskStartDate(b) || '1900-01-01';
      return dateA.localeCompare(dateB); // Comparación alfabética de YYYY-MM-DD funciona perfectamente
    });
  }, [calculateTaskGridPosition]);

  /**
   * 📡 Cargar tareas de la semana
   */
  const fetchWeekTasks = useCallback(async (date: Date): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { startFormatted, endFormatted } = getWeekRange(date);

      // Determinar el filtro de subdivisión
      const subFilter = subdivisionId !== undefined ? subdivisionId : -1;

      // Llamar al servicio con filtros
      const response = await WorkService.getTasksByRange(
        startFormatted,
        endFormatted,
        subFilter, // sub: subdivisión seleccionada o todas (-1)
        '-1', // lot: todos los lotes
        -1  // status: todos los estados
      );

      setTasks(response);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [getWeekRange, subdivisionId]);

  /**
   * ⬅️ Ir a la semana anterior
   */
  const goToPreviousWeek = useCallback(() => {
    const previousWeek = addWeeks(currentDate, -1);
    setCurrentDate(previousWeek);
  }, [currentDate]);

  /**
   * ➡️ Ir a la semana siguiente
   */
  const goToNextWeek = useCallback(() => {
    const nextWeek = addWeeks(currentDate, 1);
    setCurrentDate(nextWeek);
  }, [currentDate]);

  /**
   * 🏠 Volver a la semana actual
   */
  const goToCurrentWeek = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  /**
   * 🔄 Refrescar datos de la semana actual
   */
  const refresh = useCallback(() => {
    fetchWeekTasks(currentDate);
  }, [currentDate, fetchWeekTasks]);

  /**
   * 🎯 Cargar tareas cuando cambia la fecha actual
   */
  useEffect(() => {
    fetchWeekTasks(currentDate);
  }, [currentDate, fetchWeekTasks]);

  // Calcular información de la semana actual
  const weekRange = getWeekRange(currentDate);
  const weekDays = getWeekDays(currentDate);
  const tasksByDay = groupTasksByDay(tasks);

  // Calcular tareas con posiciones de grid para vista Gantt
  const tasksWithGridPositions = getTasksWithGridPositions(
    tasks,
    weekRange.start,
    weekRange.end
  );

  // Verificar si es la semana actual
  const isCurrentWeek = format(currentDate, 'yyyy-ww') === format(new Date(), 'yyyy-ww');

  return {
    // 📅 Información de la semana
    weekRange,
    weekDays,
    currentDate,
    isCurrentWeek,

    // 📊 Datos
    tasks,
    tasksByDay,
    tasksWithGridPositions, // Nuevo: tareas con posición para grid

    // 📈 Estados
    loading,
    error,

    // 🔄 Acciones
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    refresh
  };
};
