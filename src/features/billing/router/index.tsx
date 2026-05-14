import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

// Lazy load pages for better performance
const ActualPayrollPage = lazy(() =>
  import('../pages/ActualPayrollPage').then(module => ({
    default: module.ActualPayrollPage
  }))
);

const EmployeePayrollReportPage = lazy(() =>
  import('../pages/EmployeePayrollReportPage').then(module => ({
    default: module.EmployeePayrollReportPage
  }))
);

const DateHourPage = lazy(() =>
  import('../pages/DateHourPage').then(module => ({
    default: module.DateHourPage
  }))
);

const WarrantyInvoicesPage = lazy(() =>
  import('../pages/WarrantyInvoicesPage').then(module => ({
    default: module.WarrantyInvoicesPage
  }))
);

const WarrantyProcessPage = lazy(() =>
  import('../pages/WarrantyProcessPage').then(module => ({
    default: module.WarrantyProcessPage
  }))
);

const PagosProgramacionPage = lazy(() =>
  import('../pages/PagosProgramacionPage').then(module => ({
    default: module.PagosProgramacionPage
  }))
);

/**
 * Billing module routes configuration
 * These routes should be included in the main app router
 */
export const billingRoutes: RouteObject[] = [
  {
    path: 'facturacion',
    children: [
      {
        path: 'actual',
        element: <ActualPayrollPage />,
        // TODO: Add route guard for authentication
        // loader: requireAuth
      },
      {
        path: 'reporte',
        element: <EmployeePayrollReportPage />,
        // TODO: Add route guard for authentication
        // loader: requireAuth
      },
      {
        path: 'registrar-horas',
        element: <DateHourPage />,
        // TODO: Add route guard for authentication
        // loader: requireAuth
      },
      {
        path: 'warrantys',
        element: <WarrantyInvoicesPage />,
      },
      {
        path: 'warrantys/:invoiceId/procesar',
        element: <WarrantyProcessPage />,
      },
      {
        path: 'pagos-programacion',
        element: <PagosProgramacionPage />,
      },
      // TODO: Add more billing routes as needed
      // {
      //   path: 'historico',
      //   element: <HistoricalPayrollPage />
      // },
      // {
      //   path: 'reportes',
      //   element: <PayrollReportsPage />
      // }
    ]
  }
];

/**
 * Navigation items for billing module
 * Used to generate menu items in the app navigation
 */
export const billingNavigation = [
  {
    title: 'Facturación',
    icon: 'receipt',
    children: [
      {
        title: 'Nómina Actual',
        path: '/facturacion/actual',
        icon: 'today'
      },
      {
        title: 'Reporte Individual',
        path: '/facturacion/reporte',
        icon: 'person_search'
      },
      {
        title: 'Registrar Horas',
        path: '/facturacion/registrar-horas',
        icon: 'schedule'
      },
      {
        title: 'Pagos Warranty',
        path: '/facturacion/warrantys',
        icon: 'visibility'
      },
      // TODO: Add more navigation items
      // {
      //   title: 'Histórico',
      //   path: '/facturacion/historico',
      //   icon: 'history'
      // },
      // {
      //   title: 'Reportes',
      //   path: '/facturacion/reportes',
      //   icon: 'analytics'
      // }
    ]
  }
];