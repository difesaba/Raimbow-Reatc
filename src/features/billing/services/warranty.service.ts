import { apiService } from '../../../config/services/apiService';
import type {
  CreateWarrantyInvoiceLogDetailPayload,
  CreateWarrantyInvoiceLogPayload,
  WarrantyInvoice,
  WarrantyInvoiceDetail,
  WarrantyInvoiceLog,
  WarrantyInvoiceLogDetail,
  WarrantyInvoiceLogWithDetails,
} from '../interfaces/warranty.interfaces';

interface ApiError {
  response?: {
    data?: {
      message?: string;
      msg?: string;
    };
    status?: number;
  };
  message?: string;
}

export class WarrantyService {
  private static readonly BASE_PATH = '/api/fac/warrantys';
  private static readonly LOGS_PATH = `${this.BASE_PATH}/logs`;

  private static normalizeArray<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
      return data as T[];
    }

    if (data && typeof data === 'object') {
      const payload = data as Record<string, unknown>;
      const candidates = ['data', 'invoices', 'details', 'rows'];

      for (const key of candidates) {
        const value = payload[key];
        if (Array.isArray(value)) {
          return value as T[];
        }
      }
    }

    return [];
  }

  private static normalizeObject<T>(data: unknown): T {
    if (data && typeof data === 'object') {
      return data as T;
    }

    return {} as T;
  }

  private static getErrorMessage(error: unknown, fallback: string): string {
    const apiError = error as ApiError;

    return (
      apiError.response?.data?.message ||
      apiError.response?.data?.msg ||
      apiError.message ||
      fallback
    );
  }

  static async getInvoices(): Promise<WarrantyInvoice[]> {
    try {
      const response = await apiService.get(this.BASE_PATH);
      return this.normalizeArray<WarrantyInvoice>(response.data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = this.getErrorMessage(error, 'Error al obtener las facturas warranty');

      console.error('❌ Error fetching warranty invoices:', {
        endpoint: this.BASE_PATH,
        error: errorMessage,
        status: apiError.response?.status,
      });

      throw new Error(errorMessage);
    }
  }

  static async getInvoiceDetail(invoiceId: number): Promise<WarrantyInvoiceDetail[]> {
    try {
      if (!invoiceId || invoiceId <= 0) {
        throw new Error('Id de factura inválido');
      }

      const response = await apiService.get(`${this.BASE_PATH}/${invoiceId}`);
      return this.normalizeArray<WarrantyInvoiceDetail>(response.data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = this.getErrorMessage(
        error,
        `Error al obtener el detalle de la factura ${invoiceId}`
      );

      console.error('❌ Error fetching warranty invoice detail:', {
        endpoint: `${this.BASE_PATH}/${invoiceId}`,
        invoiceId,
        error: errorMessage,
        status: apiError.response?.status,
      });

      throw new Error(errorMessage);
    }
  }

  static async createInvoiceLog(
    payload: CreateWarrantyInvoiceLogPayload
  ): Promise<WarrantyInvoiceLog> {
    try {
      const response = await apiService.post(this.LOGS_PATH, payload);
      return this.normalizeObject<WarrantyInvoiceLog>(response.data);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error, 'Error al crear el encabezado warranty');
      throw new Error(errorMessage);
    }
  }

  static async createInvoiceLogDetail(
    logId: number,
    payload: CreateWarrantyInvoiceLogDetailPayload
  ): Promise<WarrantyInvoiceLogDetail> {
    try {
      const response = await apiService.post(`${this.LOGS_PATH}/${logId}/details`, payload);
      return this.normalizeObject<WarrantyInvoiceLogDetail>(response.data);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(
        error,
        `Error al crear el detalle warranty del log ${logId}`
      );
      throw new Error(errorMessage);
    }
  }

  static async getInvoiceLogById(logId: number): Promise<WarrantyInvoiceLogWithDetails> {
    try {
      const response = await apiService.get(`${this.LOGS_PATH}/${logId}`);
      return this.normalizeObject<WarrantyInvoiceLogWithDetails>(response.data);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error, `Error al obtener el log ${logId}`);
      throw new Error(errorMessage);
    }
  }

  static async getInvoiceLogs(): Promise<WarrantyInvoiceLog[]> {
    try {
      const response = await apiService.get(this.LOGS_PATH);
      return this.normalizeArray<WarrantyInvoiceLog>(response.data);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error, 'Error al obtener los logs warranty');
      throw new Error(errorMessage);
    }
  }

  static async deleteInvoiceLog(logId: number): Promise<void> {
    try {
      await apiService.delete(`${this.LOGS_PATH}/${logId}`);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error, `Error al eliminar el log ${logId}`);
      throw new Error(errorMessage);
    }
  }
}
