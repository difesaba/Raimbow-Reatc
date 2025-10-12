// src/features/work/pages/WeeklySchedulePage/hooks/useExpandedDays.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';

/**
 * 📂 Hook para manejar días expandidos en vista móvil
 * Controla qué días están expandidos/colapsados en el accordion
 */
export const useExpandedDays = (weekRange: { start: Date; end: Date }, weekDays: Date[]) => {
  // Estado para controlar qué días están expandidos
  const [expandedDays, setExpandedDays] = useState<Set<string>>(() => new Set());

  // Ref para trackear la última semana procesada
  const lastWeekKeyRef = useRef<string>('');

  /**
   * 🔄 Inicializar día actual como expandido al cargar o cambiar de semana
   */
  useEffect(() => {
    // Crear key única de la semana para evitar procesar la misma semana múltiples veces
    const weekKey = format(weekRange.start, 'yyyy-MM-dd');

    // Si ya procesamos esta semana, no hacer nada (evita bucle infinito)
    if (lastWeekKeyRef.current === weekKey) {
      return;
    }

    // Actualizar ref con la nueva semana
    lastWeekKeyRef.current = weekKey;

    // Calcular qué días expandir
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekDaysKeys = weekDays.map(day => format(day, 'yyyy-MM-dd'));

    // Si hoy está en esta semana, expandir solo hoy
    if (weekDaysKeys.includes(today)) {
      setExpandedDays(new Set([today]));
    } else {
      // Si no estamos en la semana actual, expandir todos los días
      setExpandedDays(new Set(weekDaysKeys));
    }
  }, [weekRange.start, weekDays]);

  /**
   * 📂 Toggle expandir/colapsar un día
   */
  const toggleDay = useCallback((dateKey: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  }, []);

  return {
    expandedDays,
    toggleDay
  };
};
