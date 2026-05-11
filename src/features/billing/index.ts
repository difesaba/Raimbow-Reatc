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
  PayrollTableProps
} from './interfaces/payroll.interfaces';
export type {
  CreateWarrantyInvoiceLogDetailPayload,
  CreateWarrantyInvoiceLogPayload,
  WarrantyInvoice,
  WarrantyInvoiceDetail,
  WarrantyInvoiceLog,
  WarrantyInvoiceLogDetail,
  WarrantyInvoiceLogWithDetails,
  WarrantyInvoicesSummary,
  WarrantyProcessPdfRow,
} from './interfaces/warranty.interfaces';

// Hooks (for future use when connecting to API)
export {
  useWeeklyPayroll,
  useEmployeePayrollDetails,
  usePayrollExport
} from './hooks/usePayroll';
export { useWarrantyInvoices } from './hooks/useWarrantyInvoices';
export { useWarrantyProcess } from './hooks/useWarrantyProcess';

// Services (for future use when connecting to API)
export { PayrollService } from './services/payroll.service';
export { WarrantyService } from './services/warranty.service';

// Utilities
export {
  formatCurrency,
  dollarsToWords,
  formatDate,
  getCurrentWeekRange
} from './utils/payroll.utils';