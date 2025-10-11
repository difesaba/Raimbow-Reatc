import { useState, useCallback } from 'react';
import { WorkService } from '../services/work.service';
import type { WorkReport, WorkReportFilters } from '../interfaces/work.interfaces';

/**
 * 🏗️ Hook personalizado para consulta de lotes por subdivisión
 *
 * Funcionalidades:
 * - ✅ Consulta manual (no automática)
 * - ✅ Manejo de estados de carga y error
 * - ✅ Función de limpieza de datos
 * - ✅ Validación de filtros requeridos
 *
 * @returns Objeto con datos, estados y funciones de control
 */
export const useLotsReport = () => {
  // 📊 Datos del reporte
  const [data, setData] = useState<WorkReport[] | null>(null);

  // 🔍 Filtros actuales aplicados
  const [currentFilters, setCurrentFilters] = useState<WorkReportFilters | null>(null);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 📡 Consultar reporte de lotes
   * @param filters - Filtros para la consulta (sub es obligatorio)
   */
  const fetchLots = useCallback(async (filters: WorkReportFilters): Promise<void> => {
    // 🔄 Resetear estado previo
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // 📝 Validación: subdivisión es obligatoria
      if (filters.sub === undefined || filters.sub === null) {
        throw new Error('La subdivisión es obligatoria');
      }

      console.log('🏗️ Consultando lotes por subdivisión:', filters);

      // 📡 Llamada al servicio
      const response = await WorkService.getReportByLot(filters);

      // ✅ Actualizar estado con los datos
      setData(response);
      setCurrentFilters(filters);

      console.log('✅ Reporte de lotes cargado exitosamente:', response);
    } catch (err) {
      // ❌ Capturar error
      const error = err as Error;
      setError(error);
      console.error('❌ Error al cargar reporte de lotes:', error.message);

      // 🔄 Limpiar datos en caso de error
      setData(null);
      setCurrentFilters(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🗑️ Limpiar reporte y resetear estados
   */
  const clearReport = useCallback(() => {
    setData(null);
    setCurrentFilters(null);
    setError(null);
    console.log('🗑️ Reporte de lotes limpiado');
  }, []);

  /**
   * 🔄 Refrescar reporte con los mismos filtros
   */
  const refreshReport = useCallback(async () => {
    if (currentFilters) {
      await fetchLots(currentFilters);
    } else {
      console.warn('⚠️ No hay filtros para refrescar');
    }
  }, [currentFilters, fetchLots]);

  /**
   * 🔍 Verificar si hay datos para mostrar
   */
  const hasData = data !== null && data.length > 0;

  /**
   * ⚠️ Verificar si no hay datos (después de una consulta)
   */
  const isEmpty = data !== null && data.length === 0;

  return {
    // 📝 Datos
    data,
    currentFilters,

    // 📊 Estados
    loading,
    error,
    hasData,
    isEmpty,

    // 🔄 Acciones
    fetchLots,
    clearReport,
    refreshReport
  };
};
