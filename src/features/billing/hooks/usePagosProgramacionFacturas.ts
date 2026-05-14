import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  PagosProgramacionFactura,
  PagosProgramacionFacturaDet,
} from '../interfaces/pagosProgramacion.interfaces';
import { PagosProgramacionService } from '../services/pagosProgramacion.service';
import {
  buildPagosProgramacionPdf,
  type PagosProgramacionPdfRow,
} from '../utils/pagosProgramacionPdf';

export const usePagosProgramacionFacturas = () => {
  const [facturas, setFacturas]       = useState<PagosProgramacionFactura[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<Error | null>(null);
  const [deletingId, setDeletingId]   = useState<number | null>(null);

  // PDF viewer state
  const [pdfOpen, setPdfOpen]         = useState(false);
  const [pdfLoading, setPdfLoading]   = useState(false);
  const [pdfError, setPdfError]       = useState<Error | null>(null);
  const [pdfUrl, setPdfUrl]           = useState<string | null>(null);
  const [pdfFactura, setPdfFactura]   = useState<PagosProgramacionFactura | null>(null);
  const [pdfDetalles, setPdfDetalles] = useState<PagosProgramacionFacturaDet[]>([]);

  const pdfUrlRef = useRef<string | null>(null);

  const fetchFacturas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PagosProgramacionService.getFacturas();
      setFacturas(data);
    } catch (err) {
      setError(err as Error);
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFacturas(); }, [fetchFacturas]);

  useEffect(() => {
    return () => { if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current); };
  }, []);

  const openPdf = useCallback(async (factura: PagosProgramacionFactura) => {
    setPdfFactura(factura);
    setPdfOpen(true);
    setPdfLoading(true);
    setPdfError(null);
    setPdfDetalles([]);

    try {
      const data = await PagosProgramacionService.getFacturaDetallePagado(factura.FacturaId);
      setPdfDetalles(data as unknown as PagosProgramacionFacturaDet[]);

      const rows: PagosProgramacionPdfRow[] = data.map((item, i) => ({
        RowNumber:   i + 1,
        SubName:     item.SubName     ?? '',
        LoteNumber:  item.Number      ?? '',
        NAME:        item.NAME        ?? '',
        Company:     item.Company     ?? '',
        InitialDate: item.InitialDate ?? '',
        Valor:       (item as unknown as { Total: number }).Total ?? 0,
      }));

      const blob = buildPagosProgramacionPdf({
        invoiceNumber: factura.Number,
        fullName:      factura.FullName,
        iniDate:       factura.IniDate,
        finDate:       factura.FinDate,
        rows,
      });

      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
      const url = URL.createObjectURL(blob);
      pdfUrlRef.current = url;
      setPdfUrl(url);
    } catch (err) {
      setPdfError(err as Error);
      setPdfUrl(null);
    } finally {
      setPdfLoading(false);
    }
  }, []);

  const closePdf = useCallback(() => {
    setPdfOpen(false);
    setPdfFactura(null);
    setPdfDetalles([]);
    setPdfError(null);
  }, []);

  const deleteFactura = useCallback(async (facturaId: number) => {
    setDeletingId(facturaId);
    try {
      await PagosProgramacionService.deleteFactura(facturaId);
      if (pdfFactura?.FacturaId === facturaId) closePdf();
      await fetchFacturas();
    } catch (err) {
      throw err;
    } finally {
      setDeletingId(null);
    }
  }, [closePdf, fetchFacturas, pdfFactura]);

  const totalValor = facturas.reduce((s, f) => s + f.TotalValor, 0);

  return {
    facturas,
    loading,
    error,
    totalValor,
    deletingId,
    refresh: fetchFacturas,
    pdfOpen,
    pdfLoading,
    pdfError,
    pdfUrl,
    pdfFactura,
    pdfDetalles,
    openPdf,
    closePdf,
    deleteFactura,
  };
};
