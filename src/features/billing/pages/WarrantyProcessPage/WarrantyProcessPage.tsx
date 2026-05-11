import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AttachMoney as MoneyIcon,
  Save as SaveIcon,
  ReceiptLong as ReceiptLongIcon,
  TaskAlt as TaskAltIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { WarrantyInvoice } from '../../interfaces/warranty.interfaces';
import { WarrantyProcessTable } from '../../components/WarrantyProcessTable';
import { WarrantyProcessResultModal } from '../../components/WarrantyProcessResultModal';
import { useWarrantyProcess } from '../../hooks/useWarrantyProcess';
import { formatCurrency } from '../../utils/payroll.utils';

const formatInvoiceDate = (isoDate: string): string => {
  const dateOnly = isoDate.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

interface WarrantyProcessLocationState {
  invoice?: WarrantyInvoice;
}

export const WarrantyProcessPage = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const location = useLocation();
  const locationState = location.state as WarrantyProcessLocationState | null;

  const parsedInvoiceId = Number(invoiceId);

  const {
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
    refresh,
    updateValue,
    closeViewer,
    saveProcess,
  } = useWarrantyProcess(parsedInvoiceId, locationState?.invoice ?? null);

  const handleSave = async () => {
    try {
      await saveProcess();
    } catch {
      // El hook ya expone el error listo para mostrar en pantalla.
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
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', lg: 'flex-start' }}
            >
              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ReceiptLongIcon color="primary" />
                  <Typography variant="h4">
                    Procesar Pago Warranty
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  Capture manualmente el valor a procesar por cada renglón de la factura seleccionada.
                </Typography>
                {invoice && (
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.5, sm: 2 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Factura #{invoice.Number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {formatInvoiceDate(invoice.DateInvoice)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contratista: {invoice.Nombre}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/facturacion/warrantys')}
                  disabled={saving}
                >
                  Volver
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={refresh}
                  disabled={loading || saving || isLocked}
                >
                  Recargar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading || saving || !summary.canSave}
                >
                  {saving ? 'Guardando...' : isLocked ? 'Guardado' : 'Guardar'}
                </Button>
              </Stack>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              mt={3}
              flexWrap="wrap"
            >
              <Chip
                icon={<TaskAltIcon />}
                label={`${summary.rowCount} renglones`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<TaskAltIcon />}
                label={`${summary.completedRows} con valor capturado`}
                color="default"
                variant="outlined"
              />
              <Chip
                icon={<MoneyIcon />}
                label={`Warranty: ${formatCurrency(summary.warrantyTotal)}`}
                color="warning"
                variant="outlined"
              />
              <Chip
                icon={<MoneyIcon />}
                label={`Capturado: ${formatCurrency(summary.enteredTotal)}`}
                color="success"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Paper>

        {saving ? (
          <Alert severity="info">
            Guardando encabezado y detalles. La pantalla está temporalmente bloqueada hasta finalizar el proceso.
          </Alert>
        ) : isLocked ? (
          <Alert severity="success">
            Esta factura ya fue procesada correctamente como <strong>#{savedLog?.InvoiceNumber ?? '-'}</strong> y quedó en modo solo lectura.
          </Alert>
        ) : summary.missingRowNumbers.length > 0 ? (
          <Alert severity="warning">
            Faltan valores por diligenciar en las filas: <strong>{summary.missingRowNumbers.join(', ')}</strong>.
          </Alert>
        ) : (
          <Alert severity="success">
            Todos los renglones tienen valor diligenciado y la factura está lista para guardar.
          </Alert>
        )}

        {error && (
          <Alert severity="error">
            {error.message || 'No fue posible cargar la información para procesar la factura.'}
          </Alert>
        )}

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <WarrantyProcessTable
            details={details}
            values={values}
            loading={loading}
            missingWarrantyIds={summary.missingWarrantyIds}
            saving={saving || isLocked}
            onValueChange={updateValue}
          />
        </Box>
      </Stack>

      <WarrantyProcessResultModal
        open={viewerOpen}
        onClose={closeViewer}
        pdfUrl={pdfUrl}
        invoice={invoice}
        savedLog={savedLog}
        rowCount={summary.rowCount}
        enteredTotal={summary.enteredTotal}
      />
    </Container>
  );
};
