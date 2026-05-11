import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CreateWarrantyInvoiceLogDetailPayload,
  WarrantyInvoice,
  WarrantyInvoiceDetail,
  WarrantyInvoiceLog,
  WarrantyInvoiceLogDetail,
  WarrantyInvoiceLogWithDetails,
  WarrantyProcessPdfRow,
} from '../interfaces/warranty.interfaces';
import { WarrantyService } from '../services/warranty.service';
import { buildWarrantyInvoicePdf } from '../utils/warrantyPdf';

const sanitizeAmount = (value: string): string => {
  const sanitized = value.replace(/[^\d.]/g, '');
  const parts = sanitized.split('.');

  if (parts.length <= 2) {
    return sanitized;
  }

  return `${parts[0]}.${parts.slice(1).join('')}`;
};

const buildFallbackInvoice = (
  invoiceId: number,
  details: WarrantyInvoiceDetail[]
): WarrantyInvoice | null => {
  const firstDetail = details[0];

  if (!firstDetail) {
    return null;
  }

  return {
    IdInvoice: firstDetail.IdInvoice || invoiceId,
    Number: firstDetail.Number,
    DateInvoice: firstDetail.DateInvoice,
    Total: firstDetail.Total,
    Paid: 0,
    UserId: firstDetail.UserRaimbow || 0,
    Nombre: firstDetail.Name,
    Company: null,
  };
};

const parseAmount = (value: string): number | null => {
  if (value.trim() === '') {
    return null;
  }

  const parsedValue = Number.parseFloat(value);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return null;
  }

  return Number(parsedValue.toFixed(2));
};

const buildMissingRowNumbers = (
  details: WarrantyInvoiceDetail[],
  values: Record<number, string>
): number[] =>
  details.reduce<number[]>((missingRows, detail, index) => {
    const parsedValue = parseAmount(values[detail.IdWarranty] ?? '');

    if (parsedValue === null) {
      missingRows.push(index + 1);
    }

    return missingRows;
  }, []);

const buildPdfRows = (
  details: WarrantyInvoiceDetail[],
  values: Record<number, string>
): WarrantyProcessPdfRow[] =>
  details.map((detail, index) => ({
    ...detail,
    RowNumber: index + 1,
    Value: parseAmount(values[detail.IdWarranty] ?? '') ?? 0,
  }));

const buildPdfRowsFromLog = (
  details: WarrantyInvoiceDetail[],
  savedLog: WarrantyInvoiceLogWithDetails
): WarrantyProcessPdfRow[] =>
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

export const useWarrantyProcess = (
  invoiceId: number,
  initialInvoice: WarrantyInvoice | null = null
) => {
  const [invoice, setInvoice] = useState<WarrantyInvoice | null>(initialInvoice);
  const [details, setDetails] = useState<WarrantyInvoiceDetail[]>([]);
  const [values, setValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [savedLog, setSavedLog] = useState<WarrantyInvoiceLogWithDetails | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const syncSavedDocument = useCallback(
    (
      nextInvoice: WarrantyInvoice | null,
      nextDetails: WarrantyInvoiceDetail[],
      persistedLog: WarrantyInvoiceLogWithDetails | null
    ) => {
      setSavedLog(persistedLog);

      setPdfUrl((previousPdfUrl) => {
        if (previousPdfUrl) {
          URL.revokeObjectURL(previousPdfUrl);
        }

        if (!persistedLog) {
          return null;
        }

        return URL.createObjectURL(
          buildWarrantyInvoicePdf({
            invoice: nextInvoice,
            savedLog: persistedLog,
            rows: buildPdfRowsFromLog(nextDetails, persistedLog),
          })
        );
      });
    },
    []
  );

  const fetchProcessData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const detailsPromise = WarrantyService.getInvoiceDetail(invoiceId);
      const invoicesPromise = initialInvoice
        ? Promise.resolve<WarrantyInvoice[] | null>(null)
        : WarrantyService.getInvoices();
      const logsPromise = WarrantyService.getInvoiceLogs().catch(() => []);

      const [detailData, invoicesData, logsData] = await Promise.all([
        detailsPromise,
        invoicesPromise,
        logsPromise,
      ]);

      setDetails(detailData);

      const matchedInvoice =
        initialInvoice ||
        invoicesData?.find((currentInvoice) => currentInvoice.IdInvoice === invoiceId) ||
        buildFallbackInvoice(invoiceId, detailData);

      setInvoice(matchedInvoice || null);

      const persistedLogHeader = logsData.find((currentLog) => currentLog.IdInvoice === invoiceId);
      const persistedLog = persistedLogHeader
        ? await WarrantyService.getInvoiceLogById(persistedLogHeader.IdLog)
        : null;

      setValues((previousValues) => {
        const nextValues: Record<number, string> = {};

        detailData.forEach((detail) => {
          const persistedDetail = persistedLog?.details.find(
            (currentDetail) => currentDetail.IdWarranty === detail.IdWarranty
          );

          nextValues[detail.IdWarranty] =
            persistedDetail?.Value?.toFixed(2) ?? previousValues[detail.IdWarranty] ?? '';
        });

        return nextValues;
      });

      setIsLocked(Boolean(persistedLog));
      syncSavedDocument(matchedInvoice || null, detailData, persistedLog);
    } catch (err) {
      setError(err as Error);
      setDetails([]);
      setIsLocked(false);
      syncSavedDocument(null, [], null);
    } finally {
      setLoading(false);
    }
  }, [initialInvoice, invoiceId, syncSavedDocument]);

  useEffect(() => {
    if (!invoiceId || Number.isNaN(invoiceId)) {
      setError(new Error('Id de factura inválido.'));
      return;
    }

    fetchProcessData();
  }, [fetchProcessData, invoiceId]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const updateValue = useCallback((warrantyId: number, value: string) => {
    if (saving || isLocked) {
      return;
    }

    setValues((previous) => ({
      ...previous,
      [warrantyId]: sanitizeAmount(value),
    }));
  }, [isLocked, saving]);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
  }, []);

  const summary = useMemo(() => {
    const enteredValues = Object.values(values)
      .map((value) => parseAmount(value))
      .filter((value): value is number => value !== null);
    const missingRowNumbers = buildMissingRowNumbers(details, values);
    const missingWarrantyIds = details.reduce<number[]>((result, detail) => {
      if (parseAmount(values[detail.IdWarranty] ?? '') === null) {
        result.push(detail.IdWarranty);
      }

      return result;
    }, []);

    return {
      rowCount: details.length,
      completedRows: details.length - missingRowNumbers.length,
      enteredTotal: enteredValues.reduce((sum, value) => sum + value, 0),
      warrantyTotal: details.reduce((sum, detail) => sum + detail.Cost, 0),
      missingRowNumbers,
      missingWarrantyIds,
      canSave: !isLocked && details.length > 0 && missingRowNumbers.length === 0,
    };
  }, [details, isLocked, values]);

  const saveProcess = useCallback(async () => {
    if (!invoice) {
      const invoiceError = new Error('No se encontró la factura para guardar el proceso.');
      setError(invoiceError);
      throw invoiceError;
    }

    if (isLocked) {
      const lockedError = new Error('Esta factura ya fue procesada y no admite nuevas ediciones.');
      setError(lockedError);
      throw lockedError;
    }

    if (!summary.canSave) {
      const validationError = new Error(
        `Faltan filas por diligenciar: ${summary.missingRowNumbers.join(', ')}.`
      );
      setError(validationError);
      throw validationError;
    }

    setSaving(true);
    setError(null);

    let createdLog: WarrantyInvoiceLog | null = null;

    try {
      createdLog = await WarrantyService.createInvoiceLog({
        IdInvoice: invoice.IdInvoice,
        InvoiceNumber: String(invoice.Number),
        InvoiceDate: invoice.DateInvoice,
        IdUser: invoice.UserId,
      });

      const detailPayloads = buildPdfRows(details, values).map<CreateWarrantyInvoiceLogDetailPayload>(
        (detail) => ({
          IdWarranty: detail.IdWarranty,
          Cost: detail.Cost,
          Value: detail.Value,
        })
      );

      const createdDetails: WarrantyInvoiceLogDetail[] = [];

      for (const detailPayload of detailPayloads) {
        const createdDetail = await WarrantyService.createInvoiceLogDetail(
          createdLog.IdLog,
          detailPayload
        );
        createdDetails.push(createdDetail);
      }

      const persistedLog =
        (await WarrantyService.getInvoiceLogById(createdLog.IdLog).catch(() => null)) ||
        ({
          ...createdLog,
          details: createdDetails,
        } satisfies WarrantyInvoiceLogWithDetails);
      setIsLocked(true);
      syncSavedDocument(invoice, details, persistedLog);
      setViewerOpen(true);

      return persistedLog;
    } catch (err) {
      if (createdLog?.IdLog) {
        try {
          await WarrantyService.deleteInvoiceLog(createdLog.IdLog);
        } catch (rollbackError) {
          console.error('❌ Error rolling back warranty log:', rollbackError);
        }
      }

      const processError = err as Error;
      setError(processError);
      throw processError;
    } finally {
      setSaving(false);
    }
  }, [details, invoice, isLocked, summary.canSave, summary.missingRowNumbers, syncSavedDocument, values]);

  return {
    invoice,
    details,
    values,
    loading,
    saving,
    isLocked,
    error,
    summary,
    pdfUrl,
    viewerOpen,
    savedLog,
    refresh: fetchProcessData,
    updateValue,
    closeViewer,
    saveProcess,
  };
};
