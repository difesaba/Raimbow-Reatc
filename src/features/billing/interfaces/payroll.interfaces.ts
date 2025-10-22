// ==================== PAYROLL DOMAIN INTERFACES ====================

/**
 * 📊 Respuesta del API para resumen semanal de nómina
 * Endpoint: GET /api/fac/semana
 */
export interface PayrollEmployee {
  /** Identificador único del empleado */
  IdUser: number;

  /** Nombre completo del empleado */
  FullName: string;

  /** Total de horas trabajadas en la semana */
  TotalHour: number;

  /** Monto total a pagar en USD */
  Total: number;
}

/**
 * 📋 Respuesta del API para detalle diario de empleado
 * Endpoint: GET /api/fac/det
 * Nota: Esta interface NO incluye IdUser según la respuesta real del backend
 */
export interface PayrollDayDetail {
  /** Nombre completo del empleado */
  FullName: string;

  /** Día de la semana (ej: "Lunes", "Martes") */
  Dia: string;

  /** Fecha y hora en formato ISO con timezone */
  DateHour: string;

  /** Hora de inicio de trabajo */
  TimeIni: string;

  /** Hora de fin de trabajo */
  TimeEnd: string;

  /** Duración del almuerzo */
  Lunch: string;

  /** Total de horas trabajadas ese día */
  TotalHour: number;

  /** Tarifa por hora en USD */
  Unit: number;

  /** Pago total del día en USD */
  Total: number;

  /** Fecha de creación del registro (formato smalldatetime del backend) */
  CreateDate: string;
}

// ==================== REQUEST INTERFACES ====================

/**
 * 📅 Parámetros para consulta de nómina semanal
 * Usado en: getWeeklyPayroll()
 */
export interface PayrollWeekRequest {
  /** Fecha de inicio (formato: YYYY-MM-DD) */
  startDate: string;

  /** Fecha de fin (formato: YYYY-MM-DD) */
  endDate: string;
}

/**
 * 📝 Parámetros para consulta de detalle de empleado
 * Usado en: getEmployeeDetails()
 */
export interface PayrollDetailRequest extends PayrollWeekRequest {
  /** ID del empleado a consultar */
  userId: number;
}

/**
 * 📈 Rango de fechas de la semana (nomenclatura legacy)
 * Se mantiene para compatibilidad con código existente
 */
export interface PayrollWeekRange {
  /** Fecha de inicio de la semana (YYYY-MM-DD) */
  ini: string;

  /** Fecha de fin de la semana (YYYY-MM-DD) */
  final: string;
}

// ==================== UI SUPPORT INTERFACES ====================

/**
 * 📊 Resumen estadístico del período de nómina
 */
export interface PayrollSummary {
  /** Monto total de nómina para todos los empleados */
  totalPayroll: number;

  /** Número total de empleados en esta nómina */
  employeeCount: number;

  /** Total de horas trabajadas por todos los empleados */
  totalHours: number;

  /** Pago promedio por empleado */
  averagePayment: number;
}

/**
 * 🎯 Props para componente PayrollHeader
 */
export interface PayrollHeaderProps {
  /** Rango de fechas de la semana */
  weekRange: PayrollWeekRange;

  /** Estadísticas de resumen */
  summary: PayrollSummary;

  /** Callback cuando cambia el rango de fechas */
  onDateRangeChange?: (range: PayrollWeekRange) => void;

  /** Estado de carga */
  loading?: boolean;
}

/**
 * 📋 Props para componente PayrollTable
 */
export interface PayrollTableProps {
  /** Lista de empleados con datos de nómina */
  employees: PayrollEmployee[];

  /** Callback cuando se solicita ver detalle de empleado */
  onViewDetail: (employeeId: number) => void;

  /** Callback cuando se solicita descargar comprobante de empleado */
  onDownloadStatement?: (employeeId: number) => void;

  /** ID del empleado actualmente seleccionado */
  selectedEmployeeId?: number;

  /** Estado de carga */
  loading?: boolean;

  /** Estado de descarga en progreso */
  downloading?: boolean;
}

/**
 * 🗂️ Props para componente PayrollDetailModal
 */
export interface PayrollDetailModalProps {
  /** Si el modal está abierto */
  open: boolean;

  /** Callback para cerrar el modal */
  onClose: () => void;

  /** Detalles del empleado a mostrar */
  employeeDetails: PayrollDayDetail[] | null;

  /** Estado de carga para los detalles */
  loading?: boolean;
}