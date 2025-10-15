import { apiService } from '../../../config/services/apiService';
import type {
  PayrollEmployee,
  PayrollDayDetail,
  PayrollWeekRange,
  PayrollWeekRequest
} from '../interfaces/payroll.interfaces';

/**
 * 💼 Servicio para manejo de operaciones de nómina
 * Utiliza apiService centralizado para todas las llamadas HTTP
 *
 * 📝 Notas importantes:
 * - Todos los métodos retornan Promises que pueden ser rechazadas con errores descriptivos
 * - Los errores incluyen el mensaje del backend cuando está disponible
 * - Se mantiene compatibilidad con PayrollWeekRange por código legacy existente
 */
export class PayrollService {
  private static readonly BASE_PATH = '/api/fac';

  /**
   * 📊 Obtener resumen semanal de nómina para todos los empleados
   * @param weekRange - Fechas de inicio y fin de la semana
   * @returns Array con resumen de nómina por empleado
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getWeeklyPayroll(weekRange: PayrollWeekRange): Promise<PayrollEmployee[]> {
    try {
      console.log(weekRange, 'semana servicio')
      const response = await apiService.get(
        `${this.BASE_PATH}/semana?ini=${weekRange.ini}&fin=${weekRange.final}`
      );
      return response.data;
    } catch (error: unknown) {
      let errorMessage = 'Error al obtener datos de nómina semanal';
      let status: number | undefined;

      if (error instanceof Error) {
        // Error genérico
        errorMessage = error.message;
      }

      // Si es un error HTTP de Axios
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string }, status?: number } };
        errorMessage = err.response?.data?.message || errorMessage;
        status = err.response?.status;
      }

      console.error('❌ Error fetching weekly payroll:', {
        endpoint: `${this.BASE_PATH}/semana`,
        params: weekRange,
        error: errorMessage,
        status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 📋 Obtener detalle diario de trabajo para un empleado específico
   * @param employeeId - ID del empleado
   * @param weekRange - Fechas de inicio y fin de la semana
   * @returns Array con el detalle diario del empleado
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getEmployeeDetails(
    employeeId: number,
    weekRange: PayrollWeekRange
  ): Promise<PayrollDayDetail[]> {
    try {
      const response = await apiService.get(
        `${this.BASE_PATH}/det?ini=${weekRange.ini}&fin=${weekRange.final}&user=${employeeId}`
      );
      return response.data;
    } catch (error: any) {
      // 📝 Extraer mensaje de error del backend si está disponible
      const errorMessage = error.response?.data?.message ||
        error.message ||
        `Error al obtener detalles del empleado ${employeeId}`;

      console.error('❌ Error fetching employee details:', {
        endpoint: `${this.BASE_PATH}/det`,
        employeeId,
        params: weekRange,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 📄 Exportar datos de nómina a PDF o Excel
   * @param weekRange - Fechas de inicio y fin de la semana
   * @param format - Formato de exportación ('pdf' o 'excel')
   * @returns Blob con el archivo exportado
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * ⚠️ NOTA: Este endpoint aún no está implementado en el backend
   * Se mantiene como placeholder para futura implementación
   */
  static async exportPayroll(
    weekRange: PayrollWeekRange,
    format: 'pdf' | 'excel'
  ): Promise<Blob> {
    try {
      // TODO: Verificar disponibilidad del endpoint con el equipo de backend
      const response = await apiService.get(
        `${this.BASE_PATH}/export?ini=${weekRange.ini}&fin=${weekRange.final}&format=${format}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        `Error al exportar nómina en formato ${format}`;

      console.error('❌ Error exporting payroll:', {
        endpoint: `${this.BASE_PATH}/export`,
        params: { ...weekRange, format },
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 📑 Generar comprobante de pago para un empleado específico
   * @param employeeId - ID del empleado
   * @param weekRange - Fechas de inicio y fin de la semana
   * @returns Blob con el PDF del comprobante
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * ⚠️ NOTA: Este endpoint aún no está implementado en el backend
   * Se mantiene como placeholder para futura implementación
   */
  static async generateStatement(
    employeeId: number,
    weekRange: PayrollWeekRange
  ): Promise<Blob> {
    try {
      // TODO: Verificar disponibilidad del endpoint con el equipo de backend
      const response = await apiService.get(
        `${this.BASE_PATH}/statement?user=${employeeId}&ini=${weekRange.ini}&fin=${weekRange.final}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        `Error al generar comprobante para empleado ${employeeId}`;

      console.error('❌ Error generating statement:', {
        endpoint: `${this.BASE_PATH}/statement`,
        employeeId,
        params: weekRange,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * 🔄 Convertir PayrollWeekRequest a PayrollWeekRange
   * Helper para mantener compatibilidad entre las interfaces nuevas y legacy
   * @param request - Objeto con startDate y endDate
   * @returns Objeto con ini y final para compatibilidad legacy
   */
  static convertToWeekRange(request: PayrollWeekRequest): PayrollWeekRange {
    return {
      ini: request.startDate,
      final: request.endDate
    };
  }

  /**
   * ✅ Validar formato de fecha YYYY-MM-DD
   * @param date - String de fecha a validar
   * @returns true si el formato es válido
   */
  static isValidDateFormat(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }

  /**
   * 📅 Validar que el rango de fechas sea válido
   * @param weekRange - Rango de fechas a validar
   * @throws Error si las fechas no son válidas
   */
  static validateWeekRange(weekRange: PayrollWeekRange): void {
    if (!this.isValidDateFormat(weekRange.ini)) {
      throw new Error(`Fecha de inicio inválida: ${weekRange.ini}. Use formato YYYY-MM-DD`);
    }

    if (!this.isValidDateFormat(weekRange.final)) {
      throw new Error(`Fecha de fin inválida: ${weekRange.final}. Use formato YYYY-MM-DD`);
    }

    const startDate = new Date(weekRange.ini);
    const endDate = new Date(weekRange.final);

    if (startDate > endDate) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
    }
  }
}