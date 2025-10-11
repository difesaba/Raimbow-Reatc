export interface PayrollDayDetail {
  /** Full name of the employee */
  FullName: string;
  /** Day of the week in Spanish */
  Dia: string;
  /** ISO date string for the work day */
  DateHour: string;
  /** Start time in HH:mm format */
  TimeIni: string;
  /** End time in HH:mm format */
  TimeEnd: string;
  /** Lunch duration in HH:mm format */
  Lunch: string;
  /** Total hours worked that day */
  TotalHour: number;
  /** Hourly rate for the employee */
  Unit: number;
  /** Total payment for the day */
  Total: number;
}

export interface PayrollSummary {
  /** Total hours worked in the period */
  totalHours: number;
  /** Total amount to be paid */
  totalAmount: number;
  /** Average hours worked per day */
  avgHoursPerDay: number;
}

export interface EmployeePayrollDetailTableProps {
  /** Array of daily payroll details to display */
  details: PayrollDayDetail[];

  /** Whether the table is in loading state */
  isLoading?: boolean;

  /** Callback to handle export to Excel/CSV */
  onExport?: () => void;

  /** Callback to handle print action */
  onPrint?: () => void;

  /** Summary statistics for the period */
  summary?: PayrollSummary;
}