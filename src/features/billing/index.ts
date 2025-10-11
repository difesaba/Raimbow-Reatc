// Main exports for the billing feature module

// Components
export * from './components';

// Pages
export * from './pages';

// Router configuration
export { billingRoutes, billingNavigation } from './router';

// Interfaces
export type {
  PayrollEmployee,
  PayrollDayDetail,
  PayrollWeekRange,
  PayrollSummary,
  PayrollHeaderProps,
  PayrollTableProps,
  PayrollDetailDrawerProps
} from './interfaces/payroll.interfaces';

// Hooks (for future use when connecting to API)
export {
  useWeeklyPayroll,
  useEmployeePayrollDetails,
  usePayrollExport
} from './hooks/usePayroll';

// Services (for future use when connecting to API)
export { PayrollService } from './services/payroll.service';

// Utilities
export {
  formatCurrency,
  dollarsToWords,
  formatDate,
  getCurrentWeekRange
} from './utils/payroll.utils';