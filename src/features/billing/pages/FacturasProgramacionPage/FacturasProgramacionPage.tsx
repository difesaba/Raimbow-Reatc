import React, { useState } from 'react';
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
  DialogContentText,
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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  GetApp as GetAppIcon,
  OpenInNew as OpenInNewIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { usePagosProgramacionFacturas } from '../../hooks/usePagosProgramacionFacturas';
import { formatCurrency, formatDate } from '../../utils/payroll.utils';
import type { PagosProgramacionFactura } from '../../interfaces/pagosProgramacion.interfaces';

const stickyHeaderCellSx = {
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  fontWeight: 700,
};

export const FacturasProgramacionPage: React.FC = () => {
  const {
    facturas, loading, error, totalValor, deletingId, refresh,
    pdfOpen, pdfLoading, pdfError, pdfUrl, pdfFactura,
    openPdf, closePdf, deleteFactura,
  } = usePagosProgramacionFacturas();

  const [toDelete, setToDelete] = useState<PagosProgramacionFactura | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setDeleteError(null);
    try {
      await deleteFactura(toDelete.FacturaId);
      setToDelete(null);
    } catch (err) {
      setDeleteError((err as Error).message || 'Error al eliminar la factura.');
    }
  };

  const handleDownload = () => {
    if (!pdfUrl || !pdfFactura) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `payment-order-${pdfFactura.Number}.pdf`;
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
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'flex-start' }}
            >
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Facturas Programación
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Listado de todos los pagos de programación generados.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refresh}
                disabled={loading}
                sx={{ alignSelf: { xs: 'stretch', md: 'flex-start' } }}
              >
                Recargar
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={2} flexWrap="wrap">
              <Chip
                icon={<ReceiptIcon />}
                label={`${facturas.length} facturas`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<MoneyIcon />}
                label={`Total: ${formatCurrency(totalValor)}`}
                color="success"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Paper>

        {error && <Alert severity="error">{error.message}</Alert>}

        {/* Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TableContainer component={Paper} variant="outlined" sx={{ height: '100%', overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={stickyHeaderCellSx}>#</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Contratista</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Semana</TableCell>
                  <TableCell align="center" sx={stickyHeaderCellSx}>Items</TableCell>
                  <TableCell align="right" sx={stickyHeaderCellSx}>Total</TableCell>
                  <TableCell sx={stickyHeaderCellSx}>Creada</TableCell>
                  <TableCell align="center" sx={stickyHeaderCellSx}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : facturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No hay facturas generadas aún.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  facturas.map((f) => (
                    <TableRow key={f.FacturaId} hover>
                      <TableCell>
                        <Chip label={f.Number} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{f.FullName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {f.IniDate} — {f.FinDate}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={f.TotalItems} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(f.TotalValor)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {f.CreatedAt ? formatDate(f.CreatedAt) : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Ver PDF">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openPdf(f)}
                              disabled={pdfLoading}
                            >
                              <PdfIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar factura">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => { setDeleteError(null); setToDelete(f); }}
                                disabled={deletingId === f.FacturaId}
                              >
                                {deletingId === f.FacturaId
                                  ? <CircularProgress size={16} color="error" />
                                  : <DeleteIcon fontSize="small" />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>

      {/* PDF Modal */}
      <Dialog open={pdfOpen} onClose={closePdf} fullWidth maxWidth="lg">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleIcon color="success" />
              <Typography variant="h6" fontWeight={700}>
                {pdfFactura ? `Factura ${pdfFactura.Number}` : 'Ver Factura'}
              </Typography>
            </Stack>
            <IconButton onClick={closePdf} size="small"><CloseIcon /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {pdfLoading && (
            <Stack direction="row" spacing={1.5} alignItems="center" p={3}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">Generando documento...</Typography>
            </Stack>
          )}

          {pdfError && <Alert severity="error" sx={{ m: 3 }}>{pdfError.message}</Alert>}

          {!pdfLoading && !pdfError && pdfFactura && (
            <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    Número: <strong>#{pdfFactura.Number}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contratista: <strong>{pdfFactura.FullName}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Semana: <strong>{pdfFactura.IniDate} — {pdfFactura.FinDate}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: <strong>{formatCurrency(pdfFactura.TotalValor)}</strong>
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          )}

          {!pdfLoading && !pdfError && pdfUrl ? (
            <Paper variant="outlined" sx={{ mx: 3, mb: 3, overflow: 'hidden' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}
              >
                <Typography variant="subtitle2" fontWeight={700}>Vista previa del documento</Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Imprimir"><IconButton onClick={handlePrint}><PrintIcon /></IconButton></Tooltip>
                  <Tooltip title="Descargar PDF"><IconButton onClick={handleDownload}><GetAppIcon /></IconButton></Tooltip>
                  <Tooltip title="Abrir en nueva pestaña"><IconButton onClick={handleOpenNew}><OpenInNewIcon /></IconButton></Tooltip>
                </Stack>
              </Stack>
              <iframe
                src={pdfUrl}
                title="Payment Order"
                style={{ width: '100%', height: '70vh', border: 0, display: 'block' }}
              />
            </Paper>
          ) : !pdfLoading && !pdfError ? (
            <Typography sx={{ px: 3, pb: 3 }} color="text.secondary">No fue posible generar la vista previa.</Typography>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closePdf}>Cerrar</Button>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<GetAppIcon />} onClick={handleDownload} disabled={!pdfUrl}>Descargar</Button>
            <Button variant="contained" startIcon={<OpenInNewIcon />} onClick={handleOpenNew} disabled={!pdfUrl}>Abrir PDF</Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(toDelete)} onClose={() => !deletingId && setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar factura</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Se eliminará permanentemente la factura <strong>{toDelete?.Number}</strong> de{' '}
            <strong>{toDelete?.FullName}</strong>. Esta acción también limpiará el campo Invoice en
            los Tasks asociados.
          </DialogContentText>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)} disabled={Boolean(deletingId)}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={Boolean(deletingId)}
            startIcon={deletingId ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
          >
            {deletingId ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
