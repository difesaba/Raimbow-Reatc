import { useState, useEffect, useCallback, useMemo } from 'react';
import { PayrollService } from '../services/payroll.service';
import type {
  DateHourRecord,
  CreateDateHourDTO,
  UpdateDateHourDTO,
  DateHourDayTotals
} from '../interfaces/payroll.interfaces';

/**
 * 🕐 Hook personalizado para gestión de registros de horas trabajadas
 *
 * Funcionalidades:
 * - ✅ Carga automática de registros al cambiar usuario/fecha
 * - ✅ CRUD completo con estado inmutable
 * - ✅ Cálculo automático de totales del día
 * - ✅ Manejo de errores 409 (registros duplicados)
 * - ✅ ID del último registro creado para highlighting
 *
 * @param userId - ID del usuario a consultar
 * @param date - Fecha a consultar (formato: YYYY-MM-DD)
 * @returns Objeto con registros, estados y funciones de control
 */
export const useDateHours = (userId: number | null, date: string | null) => {
  // 📝 Estado de registros
  const [records, setRecords] = useState<DateHourRecord[]>([]);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  // 🆕 ID del último registro creado (para highlighting)
  const [lastCreatedId, setLastCreatedId] = useState<number | null>(null);

  /**
   * 🔄 Función para cargar registros por usuario y fecha
   */
  const fetchRecords = useCallback(async () => {
    // No hacer nada si no hay usuario o fecha
    if (!userId || !date) {
      setRecords([]);
      return;
    }

    setLoading(true);
    setError(null);
    setLastCreatedId(null);

    try {
      const data = await PayrollService.getDateHoursByUserAndDate(userId, date);

      // ✅ Actualizar estado INMUTABLEMENTE
      setRecords([...data]);

      console.log(`✅ ${data.length} registros de horas cargados exitosamente`);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('❌ Error al cargar registros de horas:', error.message);

      // 🔄 Limpiar datos en caso de error
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  /**
   * 🚀 Efecto para cargar registros automáticamente al cambiar usuario/fecha
   */
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  /**
   * ➕ Crear un nuevo registro de horas
   * @param data - Datos del registro a crear
   * @returns Registro creado con su ID
   * @throws Error si falla o si ya existe (409)
   */
  const create = useCallback(async (data: CreateDateHourDTO): Promise<DateHourRecord> => {
    setLoading(true);
    setError(null);

    try {
      const newRecord = await PayrollService.createDateHour(data);

      // ✅ Actualizar estado INMUTABLEMENTE - agregar al final
      setRecords(prev => [...prev, newRecord]);

      // 💡 Guardar ID para highlighting
      setLastCreatedId(newRecord.Id);

      console.log(`✅ Registro de horas creado exitosamente: ID ${newRecord.Id}`);

      return newRecord;
    } catch (err) {
      const error = err as any;
      setError(error);

      // Mensaje específico para error 409
      if (error.status === 409) {
        console.error('❌ Error 409: Ya existe un registro para este día');
      } else {
        console.error('❌ Error al crear registro de horas:', error.message);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✏️ Actualizar un registro existente
   * @param id - ID del registro a actualizar
   * @param data - Datos actualizados
   * @returns Registro actualizado
   */
  const update = useCallback(async (
    id: number,
    data: UpdateDateHourDTO
  ): Promise<DateHourRecord> => {
    setLoading(true);
    setError(null);

    try {
      const updatedRecord = await PayrollService.updateDateHour(id, data);

      // ✅ Actualizar estado INMUTABLEMENTE - reemplazar el registro
      setRecords(prev =>
        prev.map(record =>
          record.Id === id ? { ...updatedRecord } : record
        )
      );

      console.log(`✅ Registro de horas actualizado exitosamente: ID ${id}`);

      return updatedRecord;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error(`❌ Error al actualizar registro ${id}:`, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🗑️ Eliminar un registro
   * @param id - ID del registro a eliminar
   * @returns true si se eliminó correctamente
   */
  const remove = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await PayrollService.deleteDateHour(id);

      // ✅ Actualizar estado INMUTABLEMENTE - filtrar el eliminado
      setRecords(prev => prev.filter(record => record.Id !== id));

      console.log(`✅ Registro de horas eliminado exitosamente: ID ${id}`);

      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error(`❌ Error al eliminar registro ${id}:`, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔁 Función pública para refrescar manualmente los datos
   */
  const refresh = useCallback(() => {
    return fetchRecords();
  }, [fetchRecords]);

  /**
   * 📊 Calcular totales del día (memoizado)
   */
  const totals = useMemo((): DateHourDayTotals => {
    const totalHours = records.reduce((sum, record) => sum + record.TotalHour, 0);
    const totalAmount = records.reduce((sum, record) => sum + record.Total, 0);

    return {
      totalHours,
      totalAmount,
      recordCount: records.length
    };
  }, [records]);

  /**
   * 🔍 Buscar un registro específico por ID
   * @param recordId - ID del registro
   * @returns Registro encontrado o undefined
   */
  const findById = useCallback((recordId: number): DateHourRecord | undefined => {
    return records.find(record => record.Id === recordId);
  }, [records]);

  return {
    // 📝 Datos
    records,
    totals,
    lastCreatedId,

    // 📊 Estados
    loading,
    error,

    // 🔄 Acciones
    create,
    update,
    remove,
    refresh,
    findById
  };
};
