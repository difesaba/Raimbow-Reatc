import { useState, useEffect, useCallback } from 'react';
import type {
  PayrollEmployee,
  PayrollDayDetail,
  PayrollWeekRange
} from '../interfaces/payroll.interfaces';
import { PayrollService } from '../services/payroll.service';
import { getCurrentWeekRange } from '../utils/payroll.utils';

/**
 * 📊 Hook personalizado para gestión de datos de nómina semanal
 *
 * Funcionalidades:
 * - ✅ Carga automática de datos al montar el componente
 * - ✅ Manejo de estados de carga y error
 * - ✅ Función de refresco manual
 * - ✅ Cambio de rango de fechas con recarga automática
 *
 * @param initialWeekRange - Rango de fechas inicial (opcional, usa semana actual por defecto)
 * @returns Objeto con datos, estados y funciones de control
 */
export const useWeeklyPayroll = (initialWeekRange?: PayrollWeekRange) => {
  // 📅 Estado del rango de fechas (semana actual por defecto)
  const [weekRange, setWeekRange] = useState<PayrollWeekRange>(
    initialWeekRange || getCurrentWeekRange()
  );

  // 👥 Lista de empleados con datos de nómina
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 🔄 Función para cargar datos de nómina
   * Se ejecuta automáticamente cuando cambia el rango de fechas
   */
  const fetchPayroll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 📝 Validar fechas antes de hacer la petición
      PayrollService.validateWeekRange(weekRange);

      // 📡 Llamada al servicio
      const data = await PayrollService.getWeeklyPayroll(weekRange);

      // ✅ Actualizar estado con los datos obtenidos
      setEmployees(data);
    } catch (err) {
      // ❌ Capturar error y actualizar estado
      const error = err as Error;
      setError(error);
      console.error('❌ Error al cargar nómina:', error.message);

      // 🔄 Limpiar datos en caso de error
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [weekRange]);

  /**
   * 🚀 Efecto para cargar datos cuando cambia el rango de fechas
   */
  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  /**
   * 🔁 Función pública para refrescar manualmente los datos
   */
  const refresh = useCallback(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  /**
   * 📊 Calcular resumen de estadísticas
   */
  const summary = {
    totalPayroll: employees.reduce((sum, emp) => sum + emp.Total, 0),
    employeeCount: employees.length,
    totalHours: employees.reduce((sum, emp) => sum + emp.TotalHour, 0),
    averagePayment: employees.length > 0
      ? employees.reduce((sum, emp) => sum + emp.Total, 0) / employees.length
      : 0
  };

  return {
    // 📝 Datos
    employees,
    weekRange,
    summary,

    // 🎛️ Control
    setWeekRange,

    // 📊 Estados
    loading,
    error,

    // 🔄 Acciones
    refresh
  };
};

/**
 * 📋 Hook personalizado para obtener detalles de nómina de un empleado
 *
 * Funcionalidades:
 * - ✅ Carga bajo demanda de detalles diarios
 * - ✅ Limpieza de datos al cerrar detalles
 * - ✅ Manejo independiente de estados de carga/error
 *
 * @returns Objeto con detalles, estados y funciones de control
 */
export const useEmployeePayrollDetails = () => {
  // 📝 Detalles diarios del empleado (null cuando no hay selección)
  const [details, setDetails] = useState<PayrollDayDetail[] | null>(null);

  // ⏳ Estado de carga independiente
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error independiente
  const [error, setError] = useState<Error | null>(null);

  /**
   * 📡 Función para cargar detalles de un empleado específico
   * @param employeeId - ID del empleado
   * @param weekRange - Rango de fechas a consultar
   */
  const fetchDetails = useCallback(
    async (employeeId: number, weekRange: PayrollWeekRange) => {
      setLoading(true);
      setError(null);

      try {
        // 📝 Validar parámetros
        if (!employeeId || employeeId <= 0) {
          throw new Error('ID de empleado inválido');
        }

        PayrollService.validateWeekRange(weekRange);

        // 📡 Llamada al servicio
        const data = await PayrollService.getEmployeeDetails(employeeId, weekRange);

        // ✅ Actualizar estado con los detalles obtenidos
        setDetails(data);
      } catch (err) {
        // ❌ Capturar error y actualizar estado
        const error = err as Error;
        setError(error);
        console.error(`❌ Error al cargar detalles del empleado ${employeeId}:`, error.message);

        // 🔄 Limpiar datos en caso de error
        setDetails(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 🗑️ Función para limpiar detalles y resetear estados
   * Útil al cerrar un modal o drawer de detalles
   */
  const clearDetails = useCallback(() => {
    setDetails(null);
    setError(null);
  }, []);

  /**
   * 📊 Calcular totales del detalle
   */
  const detailSummary = details ? {
    totalHours: details.reduce((sum, day) => sum + day.TotalHour, 0),
    totalPayment: details.reduce((sum, day) => sum + day.Total, 0),
    daysWorked: details.length,
    averageHoursPerDay: details.length > 0
      ? details.reduce((sum, day) => sum + day.TotalHour, 0) / details.length
      : 0
  } : null;

  return {
    // 📝 Datos
    details,
    detailSummary,

    // 📊 Estados
    loading,
    error,

    // 🔄 Acciones
    fetchDetails,
    clearDetails
  };
};

/**
 * 💾 Hook personalizado para exportación de datos de nómina
 *
 * Funcionalidades:
 * - ✅ Exportación a PDF y Excel
 * - ✅ Generación de comprobantes individuales
 * - ✅ Descarga automática de archivos
 *
 * ⚠️ NOTA: Las funciones de exportación dependen de endpoints
 * que aún no están implementados en el backend
 *
 * @returns Objeto con funciones de exportación y estados
 */
export const usePayrollExport = () => {
  // ⏳ Estado de exportación en progreso
  const [exporting, setExporting] = useState(false);

  // ❌ Estado de error en exportación
  const [error, setError] = useState<Error | null>(null);

  /**
   * 📄 Exportar datos de nómina a PDF o Excel
   * @param weekRange - Rango de fechas a exportar
   * @param format - Formato de exportación ('pdf' o 'excel')
   * @returns true si la exportación fue exitosa, false en caso contrario
   */
  const exportPayroll = useCallback(
    async (weekRange: PayrollWeekRange, format: 'pdf' | 'excel'): Promise<boolean> => {
      setExporting(true);
      setError(null);

      try {
        // 📝 Validar parámetros
        PayrollService.validateWeekRange(weekRange);

        // 📡 Llamada al servicio
        const blob = await PayrollService.exportPayroll(weekRange, format);

        // 💾 Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 📝 Nombre descriptivo del archivo
        const fileName = `nomina_${weekRange.ini}_al_${weekRange.final}.${format}`;
        link.download = fileName;

        // 🔽 Iniciar descarga
        document.body.appendChild(link);
        link.click();

        // 🗑️ Limpiar recursos
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log(`✅ Nómina exportada exitosamente: ${fileName}`);
        return true;
      } catch (err) {
        // ❌ Capturar error
        const error = err as Error;
        setError(error);
        console.error('❌ Error al exportar nómina:', error.message);
        return false;
      } finally {
        setExporting(false);
      }
    },
    []
  );

  /**
   * 📑 Generar comprobante de pago individual
   * @param employeeId - ID del empleado
   * @param weekRange - Rango de fechas del comprobante
   * @returns true si la generación fue exitosa, false en caso contrario
   */
  const generateStatement = useCallback(
    async (employeeId: number, weekRange: PayrollWeekRange): Promise<boolean> => {
      setExporting(true);
      setError(null);

      try {
        // 📝 Validar parámetros
        if (!employeeId || employeeId <= 0) {
          throw new Error('ID de empleado inválido');
        }

        PayrollService.validateWeekRange(weekRange);

        // 📡 Llamada al servicio
        const blob = await PayrollService.generateStatement(employeeId, weekRange);

        // 💾 Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 📝 Nombre descriptivo del archivo
        const fileName = `comprobante_empleado_${employeeId}_semana_${weekRange.ini}.pdf`;
        link.download = fileName;

        // 🔽 Iniciar descarga
        document.body.appendChild(link);
        link.click();

        // 🗑️ Limpiar recursos
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log(`✅ Comprobante generado exitosamente: ${fileName}`);
        return true;
      } catch (err) {
        // ❌ Capturar error
        const error = err as Error;
        setError(error);
        console.error(`❌ Error al generar comprobante para empleado ${employeeId}:`, error.message);
        return false;
      } finally {
        setExporting(false);
      }
    },
    []
  );

  return {
    // 📊 Estados
    exporting,
    error,

    // 🔄 Acciones
    exportPayroll,
    generateStatement
  };
};

/**
 * 🎯 Hook principal que combina todas las funcionalidades de nómina
 *
 * Este hook es útil cuando necesitas todas las funcionalidades
 * de nómina en un solo componente (lista, detalles, exportación)
 *
 * @param initialWeekRange - Rango de fechas inicial (opcional)
 * @returns Objeto combinado con todas las funcionalidades
 */
export const usePayroll = (initialWeekRange?: PayrollWeekRange) => {
  // 📊 Hook de datos semanales
  const weeklyPayroll = useWeeklyPayroll(initialWeekRange);

  // 📋 Hook de detalles de empleado
  const employeeDetails = useEmployeePayrollDetails();

  // 💾 Hook de exportación
  const payrollExport = usePayrollExport();

  return {
    // 📊 Datos semanales
    ...weeklyPayroll,

    // 📋 Detalles de empleado
    details: employeeDetails.details,
    detailSummary: employeeDetails.detailSummary,
    detailsLoading: employeeDetails.loading,
    detailsError: employeeDetails.error,
    fetchDetails: employeeDetails.fetchDetails,
    clearDetails: employeeDetails.clearDetails,

    // 💾 Exportación
    exporting: payrollExport.exporting,
    exportError: payrollExport.error,
    exportPayroll: payrollExport.exportPayroll,
    generateStatement: payrollExport.generateStatement
  };
};