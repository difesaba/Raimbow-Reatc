import { apiService } from '../../../config/services/apiService';
import type {
  Work,
  WorkReport,
  WorkDay,
  LotDetail,
  CreateWorkDTO,
  UpdateWorkDTO,
  WorkReportFilters,
  DeleteWorkParams,
  AuditResponse
} from '../interfaces/work.interfaces';

/**
 * Helper type for API errors
 */
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

/**
 * 🏗️ Servicio para manejo de operaciones de Work (Obras/Tareas)
 * Utiliza apiService centralizado para todas las llamadas HTTP
 */
export class WorkService {
  private static readonly BASE_PATH = '/api/work';

  /**
   * 📊 Obtener reporte de subdivisión con filtros
   * GET /api/work/report-xsub?sub=1&town=0&lot=10A
   *
   * @param filters - Filtros para el reporte (sub es obligatorio)
   * @returns Array de lotes con información de builder y subdivisión
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getReportByLot(filters: WorkReportFilters): Promise<WorkReport[]> {
    try {
      // 🔧 Construir query params
      const params = new URLSearchParams();

      // Sub es obligatorio
      if (filters.sub !== undefined) {
        params.append('sub', filters.sub.toString());
      }

      // Town es opcional
      if (filters.town !== undefined) {
        params.append('town', filters.town.toString());
      }

      // Lot es opcional y puede ser alfanumérico (ej: "10A")
      // Se envía siempre, incluso si está vacío
      if (filters.lot !== undefined) {
        params.append('lot', filters.lot);
      }

      // Status es opcional (default -1 en el backend)
      if (filters.status !== undefined) {
        params.append('status', filters.status.toString());
      }

      const queryString = params.toString();
      const url = `/api/work/report-xsub?${queryString}`;

      console.log('📊 Fetching work report by subdivision:', { url, filters });

      const response = await apiService.get(url);

      // Normalizar respuesta del backend (puede venir en diferentes formatos)
      let lots: WorkReport[] = [];

      if (Array.isArray(response.data)) {
        // Opción 1: Array directo
        lots = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Opción 2: Objeto con propiedad 'data'
        lots = response.data.data;
      } else if (response.data?.Tasks && Array.isArray(response.data.Tasks)) {
        // Opción 3: Objeto con propiedad 'Tasks'
        lots = response.data.Tasks;
      } else if (response.data?.lots && Array.isArray(response.data.lots)) {
        // Opción 4: Objeto con propiedad 'lots'
        lots = response.data.lots;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        lots = [];
      }

      console.log(`✅ ${lots.length} lotes cargados exitosamente`);
      console.log('📋 Datos de lotes:', lots);
      return lots;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          'Error al obtener reporte de subdivisión';

      console.error('❌ Error fetching work report:', {
        endpoint: '/api/work/report-xsub',
        filters,
        error: errorMessage,
        status: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🔍 Obtener detalles de un lote específico
   * GET /api/work/report-lot?sub=1&town=0&lot=10A&status=-1
   *
   * @param filters - Filtros para obtener detalles del lote
   * @returns Array de detalles del lote con tareas
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getLotDetails(filters: WorkReportFilters): Promise<LotDetail[]> {
    try {
      // 🔧 Construir query params
      const params = new URLSearchParams();

      if (filters.sub !== undefined) {
        params.append('sub', filters.sub.toString());
      }

      if (filters.town !== undefined) {
        params.append('town', filters.town.toString());
      }

      if (filters.lot !== undefined) {
        params.append('lot', filters.lot);
      }

      if (filters.status !== undefined) {
        params.append('status', filters.status.toString());
      }

      const queryString = params.toString();
      const url = `/api/work/report-lot?${queryString}`;

      console.log('🔍 Fetching lot details:', { url, filters });

      const response = await apiService.get(url);

      // Normalizar respuesta del backend
      let details: LotDetail[] = [];

      if (Array.isArray(response.data)) {
        details = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        details = response.data.data;
      } else if (response.data?.details && Array.isArray(response.data.details)) {
        details = response.data.details;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        details = [];
      }

      console.log(`✅ ${details.length} lot details loaded successfully`);
      return details;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          'Error al obtener detalles del lote';

      console.error('❌ Error fetching lot details:', {
        endpoint: '/api/work/report-lot',
        filters,
        error: errorMessage,
        status: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 📅 Obtener trabajos por día
   * GET /api/work/work-day?fecha=2025-10-05
   *
   * @param fecha - Fecha en formato YYYY-MM-DD
   * @returns Lista de trabajos del día normalizada
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getWorksByDay(fecha: string): Promise<WorkDay> {
    try {
      if (!fecha || fecha.trim() === '') {
        throw new Error('Fecha es requerida');
      }

      const url = `${this.BASE_PATH}/work-day?fecha=${fecha}`;

      console.log('📅 Fetching works by day:', { url, fecha });

      const response = await apiService.get(url);

      // Normalizar respuesta - el backend devuelve: { ok, total, data: [...] }
      const normalizedResponse: WorkDay = {
        ok: response.data?.ok || true,
        total: response.data?.total || 0,
        data: Array.isArray(response.data?.data) ? response.data.data : [],
        // Campos legacy para compatibilidad
        Date: fecha,
        TotalWorks: response.data?.total || 0,
        Works: [] // Convertir LotDetail[] a Work[] si es necesario
      };

      console.log(`✅ ${normalizedResponse.total} trabajos cargados para ${fecha}`);
      console.log('📋 Datos:', normalizedResponse.data);

      return normalizedResponse;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          `Error al obtener trabajos del día ${fecha}`;

      console.error('❌ Error fetching works by day:', {
        endpoint: `${this.BASE_PATH}/work-day`,
        fecha,
        error: errorMessage,
        status: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 📅 Obtener tareas por rango de fechas
   * GET /api/work/task-range?startDate=2025-10-10&endDate=2025-10-20&sub=-1&lot=-1&status=-1
   *
   * @param startDate - Fecha inicial en formato YYYY-MM-DD
   * @param endDate - Fecha final en formato YYYY-MM-DD
   * @param sub - ID de subdivisión (opcional, default: -1 = todas)
   * @param lot - Número de lote (opcional, default: -1 = todos)
   * @param status - ID de estado (opcional, default: -1 = todos)
   * @returns Array de detalles de lotes/tareas en el rango de fechas
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getTasksByRange(
    startDate: string,
    endDate: string,
    sub: number = -1,
    lot: string = '-1',
    status: number = -1
  ): Promise<LotDetail[]> {
    try {
      // 📝 Validaciones básicas
      if (!startDate || startDate.trim() === '') {
        throw new Error('startDate es requerida');
      }
      if (!endDate || endDate.trim() === '') {
        throw new Error('endDate es requerida');
      }

      // 🔧 Construir query params
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      params.append('sub', sub.toString());
      params.append('lot', lot);
      params.append('status', status.toString());

      const queryString = params.toString();
      const url = `${this.BASE_PATH}/task-range?${queryString}`;

      console.log('📅 Fetching tasks by range:', { url, startDate, endDate, sub, lot, status });

      const response = await apiService.get(url);

      // Normalizar respuesta del backend
      let tasks: LotDetail[] = [];

      if (Array.isArray(response.data)) {
        tasks = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        tasks = response.data.data;
      } else if (response.data?.tasks && Array.isArray(response.data.tasks)) {
        tasks = response.data.tasks;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        tasks = [];
      }

      console.log(`✅ ${tasks.length} tareas cargadas para el rango ${startDate} - ${endDate}`);
      console.log('📋 Datos:', tasks);

      return tasks;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          `Error al obtener tareas del rango ${startDate} - ${endDate}`;

      console.error('❌ Error fetching tasks by range:', {
        endpoint: `${this.BASE_PATH}/task-range`,
        startDate,
        endDate,
        sub,
        lot,
        status,
        error: errorMessage,
        statusCode: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ➕ Crear nuevo trabajo/tarea
   * POST /api/work
   *
   * Body: {
   *   "LotId": 236,
   *   "Town": 1,
   *   "Sub": 29,
   *   "Status": 4,
   *   "UserRainbow": 10,
   *   "Obs": "Tarea de prueba",
   *   "User": 1
   * }
   *
   * @param workData - Datos del nuevo trabajo
   * @returns Trabajo creado
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async createWork(workData: CreateWorkDTO): Promise<Work> {
    try {
      // 📝 Validaciones básicas
      if (!workData.LotId || workData.LotId <= 0) {
        throw new Error('LotId es requerido y debe ser mayor a 0');
      }
      if (!workData.User || workData.User <= 0) {
        throw new Error('User es requerido y debe ser mayor a 0');
      }

      console.log('➕ Creating new work:', { workData });

      const response = await apiService.post(this.BASE_PATH, workData);

      console.log('✅ Work created successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          'Error al crear trabajo';

      console.error('❌ Error creating work:', {
        endpoint: this.BASE_PATH,
        workData,
        error: errorMessage,
        status: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ✏️ Actualizar trabajo existente
   * PUT /api/work
   *
   * Body: {
   *   "TaskId": 2,
   *   "StartDate": "2025-10-04",
   *   "EndDate": "2025-10-07",
   *   "Completed": true,
   *   "Obs": "Actualización de prueba",
   *   "UserRainbow": 1,
   *   "User": 10
   * }
   *
   * @param workData - Datos actualizados del trabajo
   * @returns Trabajo actualizado
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async updateWork(workData: UpdateWorkDTO): Promise<Work> {
    try {
      // 📝 Validaciones básicas
      if (!workData.TaskId || workData.TaskId <= 0) {
        throw new Error('TaskId es requerido y debe ser mayor a 0');
      }
      if (!workData.User || workData.User <= 0) {
        throw new Error('User es requerido y debe ser mayor a 0');
      }

      console.log('✏️ Updating work:', { workData });

      const response = await apiService.put(this.BASE_PATH, workData);

      console.log('✅ Work updated successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          `Error al actualizar trabajo ${workData.TaskId}`;

      console.error('❌ Error updating work:', {
        endpoint: this.BASE_PATH,
        workData,
        error: errorMessage,
        status: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🗑️ Eliminar trabajo
   * DELETE /api/work/:id?user=1
   *
   * @param params - TaskId y UserId para eliminar
   * @returns true si la eliminación fue exitosa
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async deleteWork(params: DeleteWorkParams): Promise<boolean> {
    try {
      // 📝 Validaciones básicas
      if (!params.taskId || params.taskId <= 0) {
        throw new Error('TaskId es requerido y debe ser mayor a 0');
      }
      if (!params.userId || params.userId <= 0) {
        throw new Error('UserId es requerido y debe ser mayor a 0');
      }

      const url = `${this.BASE_PATH}/${params.taskId}?user=${params.userId}`;

      console.log('🗑️ Deleting work:', { url, params });

      await apiService.delete(url);

      console.log('✅ Work deleted successfully');
      return true;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          `Error al eliminar trabajo ${params.taskId}`;

      console.error('❌ Error deleting work:', {
        endpoint: `${this.BASE_PATH}/${params.taskId}`,
        params,
        error: errorMessage,
        status: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🕒 Obtener historial de auditoría de una tarea
   * GET /api/work/audit?TaskId=123
   *
   * @param taskId - ID de la tarea
   * @returns Historial de cambios de la tarea
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getTaskAudit(taskId: number): Promise<AuditResponse> {
    try {
      // 📝 Validaciones básicas
      if (!taskId || taskId <= 0) {
        throw new Error('TaskId es requerido y debe ser mayor a 0');
      }

      const url = `${this.BASE_PATH}/audit?TaskId=${taskId}`;

      console.log('🕒 Fetching task audit:', { url, taskId });

      const response = await apiService.get(url);

      // Normalizar respuesta del backend
      const auditResponse: AuditResponse = {
        ok: response.data?.ok || true,
        data: Array.isArray(response.data?.data) ? response.data.data : []
      };

      console.log(`✅ ${auditResponse.data.length} registros de auditoría cargados`);
      console.log('📋 Audit data:', auditResponse.data);

      return auditResponse;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ||
                          apiError.message ||
                          `Error al obtener auditoría de la tarea ${taskId}`;

      console.error('❌ Error fetching task audit:', {
        endpoint: `${this.BASE_PATH}/audit`,
        taskId,
        error: errorMessage,
        status: apiError.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * 📝 Validar formato de fecha YYYY-MM-DD
   * @param fecha - Fecha a validar
   * @returns true si el formato es válido
   */
  static isValidDateFormat(fecha: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fecha);
  }

  /**
   * 🔄 Formatear fecha a YYYY-MM-DD
   * @param date - Objeto Date o string
   * @returns Fecha formateada
   */
  static formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
