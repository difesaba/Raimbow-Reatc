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
  max
} from 'date-fns';
import { WorkService } from '../services/work.service';
import type { LotDetail } from '../interfaces/work.interfaces';

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
 *
 * @returns Objeto con datos, estados y funciones de control
 */
export const useWeeklySchedule = () => {
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
   */
  const getWeekRange = useCallback((date: Date) => {
    const monday = startOfWeek(date, { weekStartsOn: 1 }); // 1 = Lunes
    const sunday = endOfWeek(date, { weekStartsOn: 1 });

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
      // Usar InitialDate como la fecha de la tarea
      if (task.InitialDate) {
        const dateKey = format(new Date(task.InitialDate), 'yyyy-MM-dd');

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
    if (!task.InitialDate) {
      return null;
    }

    // Fecha de inicio de la tarea
    const taskStart = new Date(task.InitialDate);

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

    return {
      gridColumnStart,
      gridColumnSpan
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
    return tasksWithPositions.sort((a, b) => {
      const dateA = new Date(a.InitialDate).getTime();
      const dateB = new Date(b.InitialDate).getTime();
      return dateA - dateB;
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

      console.log('📅 Cargando tareas de la semana:', {
        start: startFormatted,
        end: endFormatted
      });

      // Llamar al servicio con todos los filtros en -1 (todos)
      const response = await WorkService.getTasksByRange(
        startFormatted,
        endFormatted,
        -1, // sub: todas las subdivisiones
        '-1', // lot: todos los lotes
        -1  // status: todos los estados
      );

      setTasks(response);
      console.log(`✅ ${response.length} tareas cargadas para la semana`);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('❌ Error al cargar tareas de la semana:', error.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [getWeekRange]);

  /**
   * ⬅️ Ir a la semana anterior
   */
  const goToPreviousWeek = useCallback(() => {
    const previousWeek = addWeeks(currentDate, -1);
    setCurrentDate(previousWeek);
    console.log('⬅️ Navegando a semana anterior');
  }, [currentDate]);

  /**
   * ➡️ Ir a la semana siguiente
   */
  const goToNextWeek = useCallback(() => {
    const nextWeek = addWeeks(currentDate, 1);
    setCurrentDate(nextWeek);
    console.log('➡️ Navegando a semana siguiente');
  }, [currentDate]);

  /**
   * 🏠 Volver a la semana actual
   */
  const goToCurrentWeek = useCallback(() => {
    setCurrentDate(new Date());
    console.log('🏠 Volviendo a semana actual');
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
