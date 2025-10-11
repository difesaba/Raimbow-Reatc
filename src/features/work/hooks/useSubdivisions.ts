import { useState, useEffect, useCallback } from 'react';
import { SubdivisionService } from '../services/subdivision.service';
import type { Subdivision, SubdivisionFilters } from '../interfaces/subdivision.interfaces';

/**
 * 🏘️ Hook personalizado para gestión de subdivisiones
 *
 * Funcionalidades:
 * - ✅ Carga automática de subdivisiones al montar el componente
 * - ✅ Manejo de estados de carga y error
 * - ✅ Función de refresco manual
 * - ✅ Filtrado local de subdivisiones
 *
 * @returns Objeto con subdivisiones, estados y funciones de control
 */
export const useSubdivisions = () => {
  // 🏘️ Lista completa de subdivisiones
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 🔄 Función para cargar todas las subdivisiones
   * Se ejecuta automáticamente al montar el componente
   */
  const fetchSubdivisions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 📡 Llamada al servicio
      const data = await SubdivisionService.getAllSubdivisions();

      // ✅ Actualizar estado con los datos obtenidos
      setSubdivisions(data);

      console.log(`✅ ${data.length} subdivisiones cargadas exitosamente`);
    } catch (err) {
      // ❌ Capturar error y actualizar estado
      const error = err as Error;
      setError(error);
      console.error('❌ Error al cargar subdivisiones:', error.message);

      // 🔄 Limpiar datos en caso de error
      setSubdivisions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🚀 Efecto para cargar subdivisiones al montar el componente
   */
  useEffect(() => {
    fetchSubdivisions();
  }, [fetchSubdivisions]);

  /**
   * 🔁 Función pública para refrescar manualmente los datos
   */
  const refresh = useCallback(() => {
    return fetchSubdivisions();
  }, [fetchSubdivisions]);

  /**
   * 🔍 Filtrar subdivisiones localmente
   * @param searchTerm - Término de búsqueda
   * @returns Subdivisiones filtradas
   */
  const filterLocally = useCallback((searchTerm: string): Subdivision[] => {
    return SubdivisionService.filterSubdivisionsLocally(subdivisions, searchTerm);
  }, [subdivisions]);

  /**
   * 📊 Aplicar filtros múltiples
   * @param filters - Filtros a aplicar
   * @returns Subdivisiones filtradas
   */
  const applyFilters = useCallback((filters: SubdivisionFilters): Subdivision[] => {
    return SubdivisionService.applyFilters(subdivisions, filters);
  }, [subdivisions]);

  /**
   * 🔍 Buscar subdivisión por ID
   * @param subdivisionId - ID de la subdivisión
   * @returns Subdivisión encontrada o undefined
   */
  const findById = useCallback((subdivisionId: number): Subdivision | undefined => {
    return subdivisions.find(sub => sub.SubdivisionId === subdivisionId);
  }, [subdivisions]);

  /**
   * 📊 Estadísticas de subdivisiones
   */
  const stats = {
    total: subdivisions.length,
    townhomes: subdivisions.filter(s => s.IsTownHome === true).length,
    regular: subdivisions.filter(s => s.IsTownHome !== true).length,
    totalLots: subdivisions.reduce((sum, s) => sum + (s.LotsQuantity || 0), 0),
    byBuilder: subdivisions.reduce((acc, sub) => {
      const builderId = sub.BuilderId || 0;
      acc[builderId] = (acc[builderId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  };

  return {
    // 📝 Datos
    subdivisions,
    stats,

    // 📊 Estados
    loading,
    error,

    // 🔄 Acciones
    refresh,
    filterLocally,
    applyFilters,
    findById
  };
};
