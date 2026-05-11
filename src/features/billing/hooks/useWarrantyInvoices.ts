import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  WarrantyInvoice,
  WarrantyInvoiceDetail,
  WarrantyInvoiceLog,
  WarrantyInvoiceLogWithDetails,
  WarrantyInvoicesSummary,
} from '../interfaces/warranty.interfaces';
import { WarrantyService } from '../services/warranty.service';
import { buildWarrantyInvoicePdf } from '../utils/warrantyPdf';

const mergeInvoicesWithLogs = (
  invoices: WarrantyInvoice[],
  logs: WarrantyInvoiceLog[]
): WarrantyInvoice[] => {
  const latestLogByInvoice = logs.reduce<Map<number, WarrantyInvoiceLog>>((result, log) => {
    if (!result.has(log.IdInvoice)) {
      result.set(log.IdInvoice, log);
    }

    return result;
  }, new Map<number, WarrantyInvoiceLog>());

  return invoices.map((invoice) => {
    const relatedLog = latestLogByInvoice.get(invoice.IdInvoice);

    return {
      ...invoice,
      GeneratedInvoiceNumber: relatedLog?.InvoiceNumber ?? null,
      ProcessLogId: relatedLog?.IdLog ?? null,
    };
  });
};

const enrichInvoicesWithUserRaimbow = async (
  invoices: WarrantyInvoice[]
): Promise<WarrantyInvoice[]> => {
  const enrichedInvoices = await Promise.all(
    invoices.map(async (invoice) => {
      if (typeof invoice.UserRaimbow === 'number') {
        return invoice;
      }

      try {
        const details = await WarrantyService.getInvoiceDetail(invoice.IdInvoice);
        return {
          ...invoice,
          UserRaimbow: details[0]?.UserRaimbow ?? invoice.UserId,
        };
      } catch {
        return {
          ...invoice,
          UserRaimbow: invoice.UserId,
        };
      }
    })
  );

  return enrichedInvoices;
};

const buildPdfRowsFromLog = (
  details: WarrantyInvoiceDetail[],
  savedLog: WarrantyInvoiceLogWithDetails
) =>
  details.map((detail, index) => {
    const persistedDetail = savedLog.details.find(
      (currentDetail) => currentDetail.IdWarranty === detail.IdWarranty
    );

    return {
      ...detail,
      RowNumber: index + 1,
      Value: persistedDetail?.Value ?? 0,
    };
  });

export const useWarrantyInvoices = () => {
  const [invoices, setInvoices] = useState<WarrantyInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<WarrantyInvoice | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<Error | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<WarrantyInvoiceDetail[]>([]);
  const [generatedPdfOpen, setGeneratedPdfOpen] = useState(false);
  const [generatedPdfLoading, setGeneratedPdfLoading] = useState(false);
  const [generatedPdfError, setGeneratedPdfError] = useState<Error | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<WarrantyInvoice | null>(null);
  const [generatedLog, setGeneratedLog] = useState<WarrantyInvoiceLogWithDetails | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<number | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [invoiceData, logs] = await Promise.all([
        WarrantyService.getInvoices(),
        WarrantyService.getInvoiceLogs().catch(() => []),
      ]);
      const invoicesWithUserRaimbow = await enrichInvoicesWithUserRaimbow(invoiceData);
      setInvoices(mergeInvoicesWithLogs(invoicesWithUserRaimbow, logs));
    } catch (err) {
      const nextError = err as Error;
      setError(nextError);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    return () => {
      if (generatedPdfUrl) {
        URL.revokeObjectURL(generatedPdfUrl);
      }
    };
  }, [generatedPdfUrl]);

  const openInvoiceDetail = useCallback(async (invoice: WarrantyInvoice) => {
    setSelectedInvoice(invoice);
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setInvoiceDetails([]);

    try {
      const data = await WarrantyService.getInvoiceDetail(invoice.IdInvoice);
      setInvoiceDetails(data);
    } catch (err) {
      setDetailError(err as Error);
      setInvoiceDetails([]);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeInvoiceDetail = useCallback(() => {
    setDetailOpen(false);
    setSelectedInvoice(null);
    setInvoiceDetails([]);
    setDetailError(null);
  }, []);

  const openGeneratedPdf = useCallback(async (invoice: WarrantyInvoice) => {
    if (!invoice.ProcessLogId) {
      setGeneratedPdfError(new Error('Esta factura todavía no tiene documento generado.'));
      return;
    }

    setGeneratedInvoice(invoice);
    setGeneratedLog(null);
    setGeneratedPdfError(null);
    setGeneratedPdfLoading(true);
    setGeneratedPdfOpen(true);

    try {
      const [details, savedLog] = await Promise.all([
        WarrantyService.getInvoiceDetail(invoice.IdInvoice),
        WarrantyService.getInvoiceLogById(invoice.ProcessLogId),
      ]);

      const nextPdfUrl = URL.createObjectURL(
        buildWarrantyInvoicePdf({
          invoice,
          savedLog,
          rows: buildPdfRowsFromLog(details, savedLog),
        })
      );

      setGeneratedLog(savedLog);
      setGeneratedPdfUrl((previousPdfUrl) => {
        if (previousPdfUrl) {
          URL.revokeObjectURL(previousPdfUrl);
        }

        return nextPdfUrl;
      });
    } catch (err) {
      setGeneratedPdfError(err as Error);
      setGeneratedLog(null);
      setGeneratedPdfUrl((previousPdfUrl) => {
        if (previousPdfUrl) {
          URL.revokeObjectURL(previousPdfUrl);
        }

        return null;
      });
    } finally {
      setGeneratedPdfLoading(false);
    }
  }, []);

  const closeGeneratedPdf = useCallback(() => {
    setGeneratedPdfOpen(false);
    setGeneratedPdfLoading(false);
    setGeneratedPdfError(null);
    setGeneratedInvoice(null);
    setGeneratedLog(null);
    setGeneratedPdfUrl((previousPdfUrl) => {
      if (previousPdfUrl) {
        URL.revokeObjectURL(previousPdfUrl);
      }

      return null;
    });
  }, []);

  const deleteGeneratedInvoice = useCallback(async (invoice: WarrantyInvoice) => {
    if (!invoice.ProcessLogId) {
      throw new Error('Esta factura no tiene un documento generado para eliminar.');
    }

    setDeletingInvoiceId(invoice.IdInvoice);

    try {
      await WarrantyService.deleteInvoiceLog(invoice.ProcessLogId);

      if (generatedInvoice?.IdInvoice === invoice.IdInvoice) {
        closeGeneratedPdf();
      }

      await fetchInvoices();
    } catch (err) {
      const nextError = err as Error;
      setError(nextError);
      throw nextError;
    } finally {
      setDeletingInvoiceId(null);
    }
  }, [closeGeneratedPdf, fetchInvoices, generatedInvoice]);

  const summary = useMemo<WarrantyInvoicesSummary>(() => {
    const companies = new Set(
      invoices
        .map((invoice) => invoice.Company?.trim() || invoice.Nombre?.trim())
        .filter((value): value is string => Boolean(value))
    );

    return {
      invoiceCount: invoices.length,
      totalAmount: invoices.reduce((sum, invoice) => sum + invoice.Total, 0),
      companyCount: companies.size,
    };
  }, [invoices]);

  return {
    invoices,
    loading,
    error,
    summary,
    refreshInvoices: fetchInvoices,
    selectedInvoice,
    detailOpen,
    detailLoading,
    detailError,
    invoiceDetails,
    openInvoiceDetail,
    closeInvoiceDetail,
    generatedPdfOpen,
    generatedPdfLoading,
    generatedPdfError,
    generatedPdfUrl,
    generatedInvoice,
    generatedLog,
    deletingInvoiceId,
    openGeneratedPdf,
    closeGeneratedPdf,
    deleteGeneratedInvoice,
  };
};
