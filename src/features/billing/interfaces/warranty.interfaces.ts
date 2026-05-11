export interface WarrantyInvoice {
  IdInvoice: number;
  Number: number;
  DateInvoice: string;
  Total: number;
  Paid: number;
  UserId: number;
  UserRaimbow?: number;
  Nombre: string;
  Company: string | null;
  GeneratedInvoiceNumber?: string | null;
  ProcessLogId?: number | null;
}

export interface WarrantyInvoiceDetail {
  IdInvoice: number;
  Number: number;
  DateInvoice: string;
  Total: number;
  SubName: string;
  Address: string;
  Observation: string;
  Cost: number;
  Name: string;
  IdWarranty: number;
  UserRaimbow: number;
}

export interface WarrantyInvoiceLog {
  IdLog: number;
  IdInvoice: number;
  InvoiceNumber: string;
  InvoiceDate: string;
  CreatedAt?: string;
  IdUser: number;
}

export interface WarrantyInvoiceLogDetail {
  IdLogDetail: number;
  IdLog: number;
  IdWarranty: number;
  Cost: number;
  Value: number;
}

export interface WarrantyInvoiceLogWithDetails extends WarrantyInvoiceLog {
  details: WarrantyInvoiceLogDetail[];
}

export interface CreateWarrantyInvoiceLogPayload {
  IdInvoice: number;
  InvoiceNumber: string;
  InvoiceDate: string;
  IdUser: number;
}

export interface CreateWarrantyInvoiceLogDetailPayload {
  IdWarranty: number;
  Cost: number;
  Value: number;
}

export interface WarrantyProcessPdfRow extends WarrantyInvoiceDetail {
  RowNumber: number;
  Value: number;
}

export interface WarrantyInvoicesSummary {
  invoiceCount: number;
  totalAmount: number;
  companyCount: number;
}

export interface WarrantyInvoicesTableProps {
  invoices: WarrantyInvoice[];
  loading?: boolean;
  selectedInvoiceId?: number | null;
  deletingInvoiceId?: number | null;
  onViewDetail: (invoice: WarrantyInvoice) => void;
  onProcess: (invoice: WarrantyInvoice) => void;
  onViewGeneratedPdf: (invoice: WarrantyInvoice) => void;
  onDeleteGeneratedInvoice: (invoice: WarrantyInvoice) => void;
}

export interface WarrantyInvoiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  invoice: WarrantyInvoice | null;
  details: WarrantyInvoiceDetail[];
  loading?: boolean;
  error?: Error | null;
}

export interface WarrantyProcessTableProps {
  details: WarrantyInvoiceDetail[];
  values: Record<number, string>;
  loading?: boolean;
  missingWarrantyIds?: number[];
  saving?: boolean;
  onValueChange: (warrantyId: number, value: string) => void;
}

export interface WarrantyProcessResultModalProps {
  open: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  invoice: WarrantyInvoice | null;
  savedLog: WarrantyInvoiceLogWithDetails | null;
  rowCount: number;
  enteredTotal: number;
  loading?: boolean;
  error?: Error | null;
  title?: string;
}
