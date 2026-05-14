import { apiService } from '../../../config/services/apiService';
import type {
  PagosProgramacionResumen,
  PagosProgramacionDetalle,
  PagosProgramacionWeekRange,
  CreateFacturaDTO,
  CreateFacturaResponse,
  PagosProgramacionFactura,
  PagosProgramacionFacturaDet,
} from '../interfaces/pagosProgramacion.interfaces';

export class PagosProgramacionService {
  private static readonly BASE_PATH = '/api/fac/pagos-programacion';

  static async getWeekSummary(
    range: PagosProgramacionWeekRange
  ): Promise<PagosProgramacionResumen[]> {
    try {
      const response = await apiService.get(
        `${this.BASE_PATH}/semana?ini=${range.ini}&fin=${range.fin}`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || 'Error al obtener pagos programación';
      console.error('❌ Error fetching pagos programacion semana:', msg);
      throw new Error(msg);
    }
  }

  static async getUserDetail(
    userId: number,
    range: PagosProgramacionWeekRange
  ): Promise<PagosProgramacionDetalle[]> {
    try {
      const response = await apiService.get(
        `${this.BASE_PATH}?user=${userId}&ini=${range.ini}&fin=${range.fin}`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || `Error al obtener detalle del usuario ${userId}`;
      console.error('❌ Error fetching pagos programacion detalle:', msg);
      throw new Error(msg);
    }
  }

  static async saveFactura(data: CreateFacturaDTO): Promise<CreateFacturaResponse> {
    try {
      const response = await apiService.post(`${this.BASE_PATH}/factura`, data);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || 'Error al guardar la factura';
      console.error('❌ Error saving factura programacion:', msg);
      throw new Error(msg);
    }
  }

  static async getFacturaDetallePagado(facturaId: number): Promise<PagosProgramacionDetalle[]> {
    try {
      const response = await apiService.get(`${this.BASE_PATH}/facturas/${facturaId}/detalle`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || `Error al obtener detalle de factura ${facturaId}`;
      console.error('❌ Error fetching factura detalle pagado:', msg);
      throw new Error(msg);
    }
  }

  static async getFacturas(): Promise<PagosProgramacionFactura[]> {
    try {
      const response = await apiService.get(`${this.BASE_PATH}/facturas`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || 'Error al obtener las facturas';
      console.error('❌ Error fetching facturas:', msg);
      throw new Error(msg);
    }
  }

  static async getFacturaById(
    facturaId: number
  ): Promise<{ header: PagosProgramacionFactura; detalles: PagosProgramacionFacturaDet[] }> {
    try {
      const response = await apiService.get(`${this.BASE_PATH}/facturas/${facturaId}`);

      // SP returns a flat JOIN: every row contains header fields + detail fields.
      type FlatRow = {
        FacturaId: number; Number: string; UserRainbow: number; FullName: string;
        IniDate: string; FinDate: string; FacturaCreatedAt: string;
        DetId: number; TaskId: number; Valor: number; SubName: string;
        LoteNumber: string; NombreTarea: string; Company: string;
        InitialDate: string; DetCreatedAt: string;
      };

      const rows: FlatRow[] = response.data;
      if (!rows || rows.length === 0) throw new Error('Factura sin detalles.');

      const first = rows[0];
      const header: PagosProgramacionFactura = {
        FacturaId:   first.FacturaId,
        Number:      first.Number,
        UserRainbow: first.UserRainbow,
        FullName:    first.FullName,
        IniDate:     first.IniDate,
        FinDate:     first.FinDate,
        CreatedAt:   first.FacturaCreatedAt,
        TotalValor:  rows.reduce((s, r) => s + r.Valor, 0),
        TotalItems:  rows.length,
      };

      const detalles: PagosProgramacionFacturaDet[] = rows.map((r) => ({
        DetId:       r.DetId,
        FacturaId:   r.FacturaId,
        TaskId:      r.TaskId,
        Valor:       r.Valor,
        SubName:     r.SubName,
        LoteNumber:  r.LoteNumber,
        NombreTarea: r.NombreTarea,
        Company:     r.Company,
        InitialDate: r.InitialDate,
        CreatedAt:   r.DetCreatedAt,
      }));

      return { header, detalles };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || `Error al obtener factura ${facturaId}`;
      console.error('❌ Error fetching factura by id:', msg);
      throw new Error(msg);
    }
  }

  static async deleteFactura(facturaId: number): Promise<void> {
    try {
      await apiService.delete(`${this.BASE_PATH}/facturas/${facturaId}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || `Error al eliminar factura ${facturaId}`;
      console.error('❌ Error deleting factura:', msg);
      throw new Error(msg);
    }
  }
}
