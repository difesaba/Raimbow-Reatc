import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  GetApp as GetAppIcon,
  OpenInNew as OpenInNewIcon,
  Payment as PaymentIcon,
  Print as PrintIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { usePagosProgramacionDetalle } from '../../hooks/usePagosProgramacion';
import { PagosProgramacionService } from '../../services/pagosProgramacion.service';
import {
  buildPagosProgramacionPdf,
  type PagosProgramacionPdfRow,
} from '../../utils/pagosProgramacionPdf';
import { formatCurrency, formatDate } from '../../utils/payroll.utils';
import type {
  CreateFacturaResponse,
  PagosProgramacionWeekRange,
} from '../../interfaces/pagosProgramacion.interfaces';

interface LocationState {
  ini: string;
  fin: string;
  fullName: string;
}

const stickyHeaderCellSx = {
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  fontWeight: 700,
};

export const PagosProgramacionPagarPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const range: PagosProgramacionWeekRange = {
    ini: state?.ini ?? '',
    fin: state?.fin ?? '',
  };
  const fullName = state?.fullName ?? '';
  const parsedUserId = Number(userId);

  const { detalle, loading, error, fetchDetalle } = usePagosProgramacionDetalle();

  const [values, setValues]           = useState<Record<number, string>>({});
  const [saving, setSaving]           = useState(false);
  const [isLocked, setIsLocked]       = useState(false);
  const [savedFactura, setSavedFactura] = useState<CreateFacturaResponse | null>(null);
  const [pdfUrl, setPdfUrl]           = useState<string | null>(null);
  const [viewerOpen, setViewerOpen]   = useState(false);
  const [saveError, setSaveError]     = useState<Error | null>(null);

  const pdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (parsedUserId && range.ini && range.fin) {
      fetchDetalle(parsedUserId, range);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedUserId]);

  // Pre-cargar valor fijo 60 para ProgressStatusId === 7
  useEffect(() => {
    if (!detalle) return;
    setValues((prev) => {
      const next = { ...prev };
      detalle.forEach((item, i) => {
        if (item.ProgressStatusId === 7 && !next[i]) {
          next[i] = '60';
        }
      });
      return next;
    });
  }, [detalle]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    };
  }, []);

  const handleValueChange = (index: number, value: string) => {
    if (saving || isLocked) return;
    setValues((prev) => ({ ...prev, [index]: value }));
  };

  const rowCount = detalle?.length ?? 0;
  const missingRows = detalle
    ? detalle.map((_, i) => i).filter((i) => !values[i] || values[i].trim() === '' || Number(values[i]) <= 0)
    : [];
  const missingRowNumbers = missingRows.map((i) => i + 1);
  const canSave = rowCount > 0 && missingRows.length === 0 && !isLocked;
  const completedCount = rowCount - missingRows.length;
  const enteredTotal = detalle
    ? detalle.reduce((sum, _, i) => sum + (Number(values[i]) || 0), 0)
    : 0;

  const handleSave = async () => {
    if (!detalle || detalle.length === 0) return;
    setSaving(true);
    setSaveError(null);
    try {
      const body = {
        UserRainbow: detalle[0].UserRainbow,
        FullName: fullName,
        IniDate: range.ini,
        FinDate: range.fin,
        Detalles: detalle.map((item, i) => ({
          TaskId: item.TaskId,
          Valor: Number(values[i]),
          SubName: item.SubName,
          LoteNumber: item.Number,
          NAME: item.NAME,
          Company: item.Company,
          InitialDate: item.InitialDate,
        })),
      };

      const response = await PagosProgramacionService.saveFactura(body);

      const pdfRows: PagosProgramacionPdfRow[] = detalle.map((item, i) => ({
        RowNumber: i + 1,
        SubName: item.SubName,
        LoteNumber: item.Number,
        NAME: item.NAME,
        Company: item.Company,
        InitialDate: item.InitialDate,
        Valor: Number(values[i]),
      }));

      const blob = buildPagosProgramacionPdf({
        invoiceNumber: response.Number,
        fullName,
        iniDate: range.ini,
        finDate: range.fin,
        rows: pdfRows,
      });

      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
      const url = URL.createObjectURL(blob);
      pdfUrlRef.current = url;

      setSavedFactura(response);
      setPdfUrl(url);
      setIsLocked(true);
      setViewerOpen(true);
    } catch (err) {
      setSaveError(err as Error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseViewer = () => setViewerOpen(false);

  const handleDownload = () => {
    if (!pdfUrl || !savedFactura) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `payment-order-${savedFactura.Number}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!pdfUrl) return;
    const w = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    w?.addEventListener('load', () => w.print());
  };

  const handleOpenNew = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
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
        {/* Header */}
        <Paper elevation={0}>
          <Box p={{ xs: 2, sm: 3 }}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', lg: 'flex-start' }}
            >
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PaymentIcon color="primary" />
                  <Typography variant="h5" fontWeight={600}>
                    Generar Pago
                  </Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Contratista: <strong>{fullName}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Semana: <strong>{range.ini}</strong> — <strong>{range.fin}</strong>
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/facturacion/pagos-programacion')}
                  disabled={saving}
                >
                  Volver
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  disabled={!canSave || saving}
                  onClick={handleSave}
                >
                  {saving ? 'Guardando...' : isLocked ? 'Guardado' : 'Guardar'}
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1.5} mt={2} flexWrap="wrap">
              <Chip label={`${rowCount} renglones`} color="primary" variant="outlined" size="small" />
              <Chip label={`${completedCount} con valor`} color="default" variant="outlined" size="small" />
              {enteredTotal > 0 && (
                <Chip label={`Total: ${formatCurrency(enteredTotal)}`} color="success" variant="outlined" size="small" />
              )}
            </Stack>
          </Box>
        </Paper>

        {/* Alerts */}
        {saving && <Alert severity="info">Guardando encabezado y detalles. Por favor espera...</Alert>}
        {isLocked && savedFactura && (
          <Alert severity="success">
            Pago <strong>#{savedFactura.Number}</strong> generado correctamente. La página está en modo solo lectura.
          </Alert>
        )}
        {!loading && !error && !saving && !isLocked && rowCount > 0 && (
          missingRowNumbers.length > 0 ? (
            <Alert severity="warning">
              Faltan valores en las filas: <strong>{missingRowNumbers.join(', ')}</strong>
            </Alert>
          ) : (
            <Alert severity="success">Todos los renglones tienen valor. Puedes guardar.</Alert>
          )
        )}
        {saveError && <Alert severity="error">{saveError.message}</Alert>}
        {error && <Alert severity="error">{error.message}</Alert>}

        {/* Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TableContainer component={Paper} variant="outlined" sx={{ height: '100%', overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={stickyHeaderCellSx}>Fila</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Subdivisión</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Lote</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Trabajo</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Empresa</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Tipo</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Fecha</TableCell>
                  <TableCell align="center" sx={stickyHeaderCellSx}>Estado</TableCell>
                  <TableCell align="right" sx={{ ...stickyHeaderCellSx, minWidth: 180 }}>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((__, j) => (
                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !detalle || detalle.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary" py={3}>
                        Sin registros para este usuario y rango de fechas.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  detalle.map((item, index) => {
                    const isMissing = missingRows.includes(index);
                    return (
                      <TableRow
                        key={index}
                        hover
                        sx={isMissing ? { backgroundColor: 'error.lighter', '&:hover': { backgroundColor: 'error.light' } } : undefined}
                      >
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={700}>{index + 1}</Typography>
                        </TableCell>
                        <TableCell><Typography variant="body2" fontWeight={600}>{item.SubName}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{item.Number}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{item.NAME}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{item.Company}</Typography></TableCell>
                        <TableCell>
                          <Chip
                            label={item.IsTownHome ? 'TownHome' : 'Lote'}
                            size="small"
                            variant="outlined"
                            color={item.IsTownHome ? 'secondary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.InitialDate ? formatDate(item.InitialDate) : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={item.IsComplete ? 'Completado' : 'Pendiente'}
                            size="small"
                            color={item.IsComplete ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ minWidth: 180 }}>
                          {item.ProgressStatusId === 7 ? (
                            <Typography variant="body2" fontWeight={700} color="success.main">
                              {formatCurrency(60)}
                            </Typography>
                          ) : (
                            <TextField
                              size="small"
                              fullWidth
                              label="Valor"
                              type="number"
                              value={values[index] ?? ''}
                              error={isMissing}
                              disabled={saving || isLocked}
                              onChange={(e) => handleValueChange(index, e.target.value)}
                              slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>

      {/* Result modal */}
      <Dialog open={viewerOpen} onClose={handleCloseViewer} fullWidth maxWidth="lg">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleIcon color="success" />
              <Typography variant="h6" fontWeight={700}>Pago generado correctamente</Typography>
            </Stack>
            <IconButton onClick={handleCloseViewer} size="small"><CloseIcon /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'background.default' }}>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    Número: <strong>#{savedFactura?.Number ?? '-'}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contratista: <strong>{fullName}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Semana: <strong>{range.ini} — {range.fin}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Renglones: <strong>{rowCount}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: <strong>{formatCurrency(enteredTotal)}</strong>
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  El proceso quedó cerrado y la información se muestra en modo solo lectura.
                </Typography>
              </Stack>
            </Paper>
          </Stack>

          {pdfUrl ? (
            <Paper variant="outlined" sx={{ mx: 3, mb: 3, overflow: 'hidden' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>Vista previa</Typography>
                  <Typography variant="body2" color="text.secondary">Documento listo para revisar, imprimir o descargar.</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Imprimir">
                    <IconButton onClick={handlePrint}><PrintIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Descargar PDF">
                    <IconButton onClick={handleDownload}><GetAppIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Abrir en nueva pestaña">
                    <IconButton onClick={handleOpenNew}><OpenInNewIcon /></IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <iframe
                src={pdfUrl}
                title="Payment Order"
                style={{ width: '100%', height: '70vh', border: 0, display: 'block' }}
              />
            </Paper>
          ) : (
            <Typography sx={{ px: 3, pb: 3 }} color="text.secondary">No fue posible cargar la vista previa.</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseViewer}>Cerrar</Button>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<GetAppIcon />} onClick={handleDownload} disabled={!pdfUrl}>
              Descargar
            </Button>
            <Button variant="contained" startIcon={<OpenInNewIcon />} onClick={handleOpenNew} disabled={!pdfUrl}>
              Abrir PDF
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
