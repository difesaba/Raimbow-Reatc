import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ReceiptLong as ReceiptLongIcon,
  Storefront as StorefrontIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { WarrantyInvoiceDetailModal } from '../../components/WarrantyInvoiceDetailModal';
import { WarrantyInvoicesTable } from '../../components/WarrantyInvoicesTable';
import { WarrantyProcessResultModal } from '../../components/WarrantyProcessResultModal';
import { useWarrantyInvoices } from '../../hooks/useWarrantyInvoices';
import { formatCurrency } from '../../utils/payroll.utils';
import { useNotification } from '../../../shared/hooks/useNotification';

export const WarrantyInvoicesPage = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [invoiceToDelete, setInvoiceToDelete] = useState<(typeof invoices)[number] | null>(null);
  const {
    invoices,
    loading,
    error,
    summary,
    refreshInvoices,
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
    openGeneratedPdf,
    closeGeneratedPdf,
    deletingInvoiceId,
    deleteGeneratedInvoice,
  } = useWarrantyInvoices();

  const handleProcess = (invoice: (typeof invoices)[number]) => {
    navigate(`/facturacion/warrantys/${invoice.IdInvoice}/procesar`, {
      state: { invoice },
    });
  };

  const handleDeleteGeneratedInvoice = async (invoice: (typeof invoices)[number]) => {
    setInvoiceToDelete(invoice);
  };

  const handleCloseDeleteDialog = () => {
    if (deletingInvoiceId) {
      return;
    }

    setInvoiceToDelete(null);
  };

  const handleConfirmDeleteGeneratedInvoice = async () => {
    if (!invoiceToDelete) {
      return;
    }

    try {
      await deleteGeneratedInvoice(invoiceToDelete);
      showSuccess('Factura generada eliminada correctamente.');
      setInvoiceToDelete(null);
    } catch (err) {
      showError((err as Error).message || 'No fue posible eliminar la factura generada.');
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        height: { md: 'calc(100vh - 88px)' },
        display: 'flex',
      }}
    >
      <Stack spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        <Paper elevation={0}>
          <Box p={{ xs: 2, sm: 3 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'flex-start' }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Pagos Warranty
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Consulte el listado general de facturas warranty y abra el detalle por fila en un modal.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refreshInvoices}
                disabled={loading}
                sx={{ alignSelf: { xs: 'stretch', md: 'flex-start' } }}
              >
                Recargar
              </Button>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              mt={3}
              flexWrap="wrap"
            >
              <Chip
                icon={<ReceiptLongIcon />}
                label={`${summary.invoiceCount} facturas`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<StorefrontIcon />}
                label={`${summary.companyCount} compañías/contratistas`}
                color="default"
                variant="outlined"
              />
              <Chip
                icon={<MoneyIcon />}
                label={formatCurrency(summary.totalAmount)}
                color="success"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error">
            {error.message || 'No fue posible cargar las facturas warranty.'}
          </Alert>
        )}

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <WarrantyInvoicesTable
            invoices={invoices}
            loading={loading}
            selectedInvoiceId={selectedInvoice?.IdInvoice ?? null}
            deletingInvoiceId={deletingInvoiceId}
            onViewDetail={openInvoiceDetail}
            onProcess={handleProcess}
            onViewGeneratedPdf={openGeneratedPdf}
            onDeleteGeneratedInvoice={handleDeleteGeneratedInvoice}
          />
        </Box>
      </Stack>

      <WarrantyInvoiceDetailModal
        open={detailOpen}
        onClose={closeInvoiceDetail}
        invoice={selectedInvoice}
        details={invoiceDetails}
        loading={detailLoading}
        error={detailError}
      />

      <WarrantyProcessResultModal
        open={generatedPdfOpen}
        onClose={closeGeneratedPdf}
        pdfUrl={generatedPdfUrl}
        invoice={generatedInvoice}
        savedLog={generatedLog}
        rowCount={generatedLog?.details.length ?? 0}
        enteredTotal={generatedLog?.details.reduce((sum, detail) => sum + detail.Value, 0) ?? 0}
        loading={generatedPdfLoading}
        error={generatedPdfError}
        title="Factura generada"
      />

      <Dialog
        open={Boolean(invoiceToDelete)}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Eliminar factura generada</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {invoiceToDelete?.GeneratedInvoiceNumber
              ? `Se eliminará la factura generada #${invoiceToDelete.GeneratedInvoiceNumber}. Esta acción permitirá volver a procesar la factura warranty.`
              : 'Se eliminará la factura generada seleccionada.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={Boolean(deletingInvoiceId)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDeleteGeneratedInvoice}
            color="error"
            variant="contained"
            disabled={Boolean(deletingInvoiceId)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
