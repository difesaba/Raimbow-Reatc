export interface User {
  /** Unique identifier for the user */
  UserId: number;
  /** User's first name */
  FirstName: string;
  /** User's last name */
  LastName: string;
  /** User's department (optional) */
  Department?: string;
}

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