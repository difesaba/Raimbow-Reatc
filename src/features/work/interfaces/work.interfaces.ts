/**
 * 🏗️ Interfaces para módulo de Work (Obras/Tareas)
 * Gestión de trabajos, tareas, lotes y reportes de obras
 */

/**
 * 📋 Work - Tarea o trabajo principal
 * Representa una tarea asignada a un lote/obra
 */
export interface Work {
  TaskId: number;
  LotId?: number;
  Town?: number;
  Sub?: number;
  Status?: number;
  UserRainbow?: number;
  Obs?: string;
  User?: number;
  StartDate?: string;
  EndDate?: string;
  Completed?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
}

/**
 * ➕ CreateWorkDTO - Datos para crear nuevo trabajo
 */
export interface CreateWorkDTO {
  LotId: number;
  Town: number;
  Sub: number;
  Status: number;
  UserRainbow: number;
  Obs: string;
  User: number;
}

/**
 * ✏️ UpdateWorkDTO - Datos para actualizar trabajo existente
 */
export interface UpdateWorkDTO {
  TaskId: number;
  StartDate: string;
  EndDate: string;
  Completed: boolean;
  Obs: string;
  UserRainbow: number;
  User: number;
}

/**
 * 📊 WorkReport - Reporte de lote por subdivisión
 * Contiene información de lotes con sus builders y subdivisiones
 */
export interface WorkReport {
  BuilderId: number;
  Builder: string;
  SubdivisionId: number;
  Sub: string;
  IsTownHome: boolean;
  LoteId: number;
  Number: string;
  SFQuantity?: number | string;
  Colors?: string;
  DoorDesc?: string;
  StainDesc?: string;
}

/**
 * 🔍 LotDetail - Detalles completos de un lote
 * Respuesta del endpoint /api/work/report-lot y /api/work/work-day
 */
export interface LotDetail {
  IdDet: number;
  TaskId?: number | null; // ID de tarea asignada (null si no existe aún)
  LoteId: number;
  Number: string;
  ContractorId: number;
  ProgressStatusId: number;
  InitialDate: string;
  EndDate: string;
  IsComplete: number;
  Obs: string;
  InvoiceId: number;
  SubdivisionId: number;
  SubName: string;
  IsTownHome: number;
  Progress: number | string; // Puede ser nombre del proceso (string) o porcentaje (number)
  Days: number;
  UserId: number;
  Manager: string;
  StartDate: string;
  EndDateTask: string;
  WorkDays: number;
  Completed: number;
  CreatedAt: string;
  UserCreate: number;
  UpdatedAt: string;
  UserUpdate: number;
  SFQuantity?: number | string;
  Colors?: string;
  DoorDesc?: string;
  StainDesc?: string;
  address?: string; // Dirección de la obra/lote (campo del backend en minúscula)
}

/**
 * 📋 WorkReportResponse - Respuesta del endpoint report-xsub
 * El backend puede devolver un array de WorkReport o un objeto envuelto
 */
export interface WorkReportResponse {
  data?: WorkReport[];
  Tasks?: WorkReport[];
  lots?: WorkReport[];
}

/**
 * 📅 WorkDay - Trabajos por día
 * Contiene trabajos realizados en una fecha específica
 */
export interface WorkDay {
  ok?: boolean;
  total?: number;
  data?: LotDetail[];
  // Campos legacy (compatibilidad)
  Date?: string;
  TotalWorks?: number;
  Works?: Work[];
}

/**
 * 🔍 WorkReportFilters - Filtros para reporte de lote
 */
export interface WorkReportFilters {
  sub?: number;
  town?: number;
  lot?: string; // String para soportar valores alfanuméricos (ej: "10A")
  status?: number;
}

/**
 * 📅 WorkDayFilters - Filtros para trabajos por día
 */
export interface WorkDayFilters {
  fecha: string; // Formato: YYYY-MM-DD
}

/**
 * 🗑️ DeleteWorkParams - Parámetros para eliminar trabajo
 */
export interface DeleteWorkParams {
  taskId: number;
  userId: number;
}

/**
 * 🖼️ ImageUploadResponse - Respuesta al subir imagen
 */
export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
}

/**
 * 📝 Work Status (opcional - para referencia)
 */
export const WorkStatus = {
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4
} as const;

export type WorkStatusValue = typeof WorkStatus[keyof typeof WorkStatus];

/**
 * 🕒 AuditRecord - Registro individual de auditoría
 * Representa un cambio realizado en una tarea
 */
export interface AuditRecord {
  AuditId: number;
  TableName: string;
  TaskId: number;
  ActionType: string; // 'UPDATE', 'CREATE', 'DELETE'
  UserId: number;
  Usuario?: string; // Nombre completo del usuario que hizo el cambio
  Changes: string;
  Summary: string; // JSON string que necesita parsearse
  Description: string;
  CreatedAt: string;
}

/**
 * 📋 AuditResponse - Respuesta del endpoint de auditoría
 * GET /api/work/audit?TaskId=123
 */
export interface AuditResponse {
  ok: boolean;
  data: AuditRecord[];
}

/**
 * 🔍 ParsedSummary - Summary parseado con cambios
 * El campo Summary es un JSON string que contiene los cambios
 */
export interface ParsedSummary {
  [field: string]: {
    old: unknown;
    new: unknown;
  };
}

/**
 * 📱 NotificationChannel - Resultado de envío por canal (WhatsApp o SMS)
 * Estructura completa de la respuesta del backend
 */
export interface NotificationChannel {
  messageSid: string | null;
  messageLogId: number | null;
  status: string; // "queued", "sent", "delivered", "failed", "unknown"
  errorCode: string | null;
  errorMessage: string | null;
  isSuccess: boolean; // ← Flag principal para verificar éxito
  isFailed: boolean;
  isSandboxIssue: boolean; // ← Indica si el error es por sandbox de Twilio
}

/**
 * 📲 NotificationResult - Resultado completo de notificaciones enviadas
 * Incluido en las respuestas de creación/actualización de tareas
 */
export interface NotificationResult {
  sent: boolean; // true si al menos un mensaje se envió correctamente
  user?: string; // Nombre del usuario (ej: "Juan Pérez")
  phone: string | null; // Teléfono del usuario (ej: "+13045207634")
  whatsapp: NotificationChannel; // Resultado del envío por WhatsApp
  reason: string | null; // Razón si no se pudo enviar (ej: "Usuario no tiene WhatsApp/teléfono configurado")
  error: string | null; // Error general si hubo fallo
}

/**
 * ✅ CreateWorkResponse - Respuesta completa al crear un trabajo
 * Incluye información de notificaciones enviadas
 */
export interface CreateWorkResponse {
  ok: boolean;
  msg: string;
  data: Work;
  notification?: NotificationResult;
}

/**
 * ✅ UpdateWorkResponse - Respuesta completa al actualizar un trabajo
 * Incluye información de notificaciones enviadas
 */
export interface UpdateWorkResponse {
  ok: boolean;
  msg: string;
  data: Work;
  notification?: NotificationResult;
}
