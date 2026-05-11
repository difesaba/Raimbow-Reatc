import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  GetApp as GetAppIcon,
  OpenInNew as OpenInNewIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/payroll.utils';
import type { WarrantyProcessResultModalProps } from '../../interfaces/warranty.interfaces';

export const WarrantyProcessResultModal: React.FC<WarrantyProcessResultModalProps> = ({
  open,
  onClose,
  pdfUrl,
  invoice,
  savedLog,
  rowCount,
  enteredTotal,
  loading = false,
  error = null,
  title = 'Factura generada correctamente',
}) => {
  const handleOpenInNewTab = () => {
    if (!pdfUrl) {
      return;
    }

    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    if (!pdfUrl || !savedLog?.InvoiceNumber) {
      return;
    }

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `warranty-invoice-${savedLog.InvoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!pdfUrl) {
      return;
    }

    const printWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    printWindow?.addEventListener('load', () => {
      printWindow.print();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon color="success" />
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
          {loading ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Cargando documento generado...
              </Typography>
            </Stack>
          ) : null}

          {error ? <Alert severity="error">{error.message}</Alert> : null}

          <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'background.default' }}>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                {savedLog
                  ? `Log #${savedLog.IdLog} generado para la factura #${savedLog.InvoiceNumber}.`
                  : 'Se generó el documento de la factura procesada.'}
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} flexWrap="wrap">
                <Typography variant="body2" color="text.secondary">
                  Factura original: <strong>#{invoice?.Number ?? '-'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Factura generada: <strong>#{savedLog?.InvoiceNumber ?? '-'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Renglones: <strong>{rowCount}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total general: <strong>{formatCurrency(enteredTotal)}</strong>
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                El proceso quedó cerrado y la información se muestra en modo solo lectura.
              </Typography>
            </Stack>
          </Paper>
        </Stack>

        {!loading && !error && pdfUrl ? (
          <Paper variant="outlined" sx={{ mx: 3, mb: 3, overflow: 'hidden' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Vista previa de la factura
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Documento listo para revisar, imprimir o descargar.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Imprimir factura">
                  <span>
                    <IconButton onClick={handlePrint} disabled={!pdfUrl}>
                      <PrintIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Descargar PDF">
                  <span>
                    <IconButton onClick={handleDownload} disabled={!pdfUrl}>
                      <GetAppIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Abrir en nueva pestaña">
                  <span>
                    <IconButton onClick={handleOpenInNewTab} disabled={!pdfUrl}>
                      <OpenInNewIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>
            <iframe
              src={pdfUrl}
              title="Factura warranty generada"
              style={{
                width: '100%',
                height: '70vh',
                border: 0,
                display: 'block',
              }}
            />
          </Paper>
        ) : !loading && !error ? (
          <Typography sx={{ px: 3, pb: 3 }} color="text.secondary">
            No fue posible cargar la vista previa del PDF.
          </Typography>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cerrar</Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<GetAppIcon />} onClick={handleDownload} disabled={!pdfUrl}>
            Descargar
          </Button>
          <Button
            variant="contained"
            startIcon={<OpenInNewIcon />}
            onClick={handleOpenInNewTab}
            disabled={!pdfUrl}
          >
            Abrir PDF
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
