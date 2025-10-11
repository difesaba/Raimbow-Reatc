import { useState, useCallback } from 'react';
import type { PayrollDayDetail, PayrollWeekRange } from '../interfaces/payroll.interfaces';
import { PayrollService } from '../services/payroll.service';

/**
 * 📋 Hook personalizado para el reporte individual de nómina de empleado
 *
 * Funcionalidades:
 * - ✅ Carga manual de detalles (NO automática)
 * - ✅ Reutiliza PayrollService.getEmployeeDetails() existente
 * - ✅ Manejo de estados de carga y error
 * - ✅ Función para limpiar datos
 * - ✅ Cálculo de resumen estadístico
 *
 * Este hook es específico para la página Employee Payroll Report
 * donde el usuario selecciona un empleado y rango de fechas
 * y luego hace clic en "Consultar" para ver los detalles.
 *
 * @returns Objeto con detalles, estados y funciones de control
 */
export const useEmployeePayrollReport = () => {
  // 📝 Detalles diarios del empleado (null cuando no hay datos)
  const [details, setDetails] = useState<PayrollDayDetail[] | null>(null);

  // 👤 ID del empleado actualmente consultado
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);

  // 📅 Rango de fechas actualmente consultado
  const [currentDateRange, setCurrentDateRange] = useState<PayrollWeekRange | null>(null);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 📡 Función para consultar el reporte de un empleado
   * Se ejecuta cuando el usuario hace clic en "Consultar"
   *
   * @param userId - ID del empleado a consultar
   * @param dateRange - Rango de fechas del reporte
   * @returns Promise que resuelve cuando termina la consulta
   */
  const fetchReport = useCallback(
    async (userId: number, dateRange: PayrollWeekRange): Promise<void> => {
      // 🔄 Resetear estado previo
      setLoading(true);
      setError(null);
      setDetails(null);

      try {
        // 📝 Validar parámetros
        if (!userId || userId <= 0) {
          throw new Error('Por favor seleccione un empleado');
        }

        if (!dateRange || !dateRange.ini || !dateRange.final) {
          throw new Error('Por favor seleccione un rango de fechas válido');
        }

        // 🔍 Validar formato de fechas
        PayrollService.validateWeekRange(dateRange);

        console.log(`📊 Consultando reporte para empleado ${userId}`, {
          userId,
          dateRange
        });

        // 📡 Llamada al servicio existente
        const data = await PayrollService.getEmployeeDetails(userId, dateRange);

        // ✅ Actualizar estado con los detalles obtenidos
        setDetails(data);
        setCurrentEmployeeId(userId);
        setCurrentDateRange(dateRange);

        // 📊 Log de éxito
        if (data && data.length > 0) {
          const totalDays = data.length;
          const totalHours = data.reduce((sum, day) => sum + day.TotalHour, 0);
          const totalPayment = data.reduce((sum, day) => sum + day.Total, 0);

          console.log(`✅ Reporte cargado exitosamente:`, {
            empleado: data[0].FullName,
            dias: totalDays,
            horasTotales: totalHours.toFixed(2),
            pagoTotal: `$${totalPayment.toFixed(2)}`
          });
        } else {
          console.log('⚠️ No se encontraron registros para el período seleccionado');
        }
      } catch (err) {
        // ❌ Capturar error y actualizar estado
        const error = err as Error;
        setError(error);
        console.error(`❌ Error al cargar reporte del empleado:`, error.message);

        // 🔄 Limpiar datos en caso de error
        setDetails(null);
        setCurrentEmployeeId(null);
        setCurrentDateRange(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 🗑️ Función para limpiar el reporte y resetear estados
   * Útil cuando el usuario quiere hacer una nueva consulta
   * o al cambiar de página
   */
  const clearReport = useCallback(() => {
    setDetails(null);
    setCurrentEmployeeId(null);
    setCurrentDateRange(null);
    setError(null);
    console.log('🗑️ Reporte limpiado');
  }, []);

  /**
   * 🔄 Recargar el reporte actual con los mismos parámetros
   * Útil para refrescar los datos sin cambiar la selección
   */
  const refreshReport = useCallback(async () => {
    if (currentEmployeeId && currentDateRange) {
      await fetchReport(currentEmployeeId, currentDateRange);
    } else {
      console.warn('⚠️ No hay reporte actual para refrescar');
    }
  }, [currentEmployeeId, currentDateRange, fetchReport]);

  /**
   * 📊 Calcular resumen estadístico del reporte
   * Solo se calcula si hay detalles disponibles
   */
  const summary = details && details.length > 0 ? {
    // 👤 Información del empleado
    employeeName: details[0].FullName,
    employeeId: currentEmployeeId,

    // 📅 Período consultado
    dateRange: currentDateRange,
    startDate: currentDateRange?.ini,
    endDate: currentDateRange?.final,

    // 📊 Estadísticas laborales
    daysWorked: details.length,
    totalHours: details.reduce((sum, day) => sum + day.TotalHour, 0),
    totalPayment: details.reduce((sum, day) => sum + day.Total, 0),

    // 📈 Promedios
    averageHoursPerDay: details.reduce((sum, day) => sum + day.TotalHour, 0) / details.length,
    averagePaymentPerDay: details.reduce((sum, day) => sum + day.Total, 0) / details.length,

    // 💰 Tarifas
    hourlyRates: [...new Set(details.map(d => d.Unit))], // Tarifas únicas
    averageHourlyRate: details.reduce((sum, day) => sum + day.Unit, 0) / details.length,

    // 📋 Desglose por día
    dailyBreakdown: details.map(day => ({
      day: day.Dia,
      date: day.DateHour,
      hours: day.TotalHour,
      payment: day.Total,
      rate: day.Unit
    }))
  } : null;

  /**
   * 🔍 Verificar si hay datos para mostrar
   */
  const hasData = details !== null && details.length > 0;

  /**
   * ⚠️ Verificar si no hay datos (después de una consulta)
   */
  const isEmpty = details !== null && details.length === 0;

  return {
    // 📝 Datos
    details,
    summary,
    currentEmployeeId,
    currentDateRange,

    // 📊 Estados
    loading,
    error,
    hasData,
    isEmpty,

    // 🔄 Acciones
    fetchReport,
    clearReport,
    refreshReport
  };
};

/**
 * 📑 Hook helper para generar comprobante de pago de empleado
 * Reutiliza PayrollService.generateStatement() existente
 *
 * @returns Funciones para generar y descargar comprobantes
 */
export const useEmployeeStatement = () => {
  // ⏳ Estado de generación en progreso
  const [generating, setGenerating] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 📄 Generar y descargar comprobante de pago
   * @param employeeId - ID del empleado
   * @param dateRange - Rango de fechas del comprobante
   * @returns true si la generación fue exitosa
   */
  const generateStatement = useCallback(
    async (employeeId: number, dateRange: PayrollWeekRange): Promise<boolean> => {
      setGenerating(true);
      setError(null);

      try {
        // 📝 Validar parámetros
        if (!employeeId || employeeId <= 0) {
          throw new Error('ID de empleado inválido');
        }

        PayrollService.validateWeekRange(dateRange);

        console.log(`📑 Generando comprobante para empleado ${employeeId}...`);

        // 📡 Llamada al servicio existente
        const blob = await PayrollService.generateStatement(employeeId, dateRange);

        // 💾 Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 📝 Nombre descriptivo del archivo
        const fileName = `comprobante_empleado_${employeeId}_${dateRange.ini}_al_${dateRange.final}.pdf`;
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
        console.error('❌ Error al generar comprobante:', error.message);
        return false;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  return {
    // 📊 Estados
    generating,
    error,

    // 🔄 Acciones
    generateStatement
  };
};