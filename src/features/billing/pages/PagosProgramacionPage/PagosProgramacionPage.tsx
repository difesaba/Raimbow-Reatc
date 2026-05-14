import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
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
  Close as CloseIcon,
  InfoOutlined as InfoOutlinedIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  usePagosProgramacionSemana,
  usePagosProgramacionDetalle,
} from '../../hooks/usePagosProgramacion';
import { formatDate } from '../../utils/payroll.utils';
import type { PagosProgramacionWeekRange } from '../../interfaces/pagosProgramacion.interfaces';

export const PagosProgramacionPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, range, setRange, refresh } =
    usePagosProgramacionSemana();

  const { detalle, loading: detalleLoading, error: detalleError, fetchDetalle, clear } =
    usePagosProgramacionDetalle();

  const [localRange, setLocalRange] = useState<PagosProgramacionWeekRange>(range);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const handleConsultar = () => {
    setRange(localRange);
  };

  const handleOpenDetalle = (userId: number, fullName: string) => {
    setSelectedName(fullName);
    setModalOpen(true);
    fetchDetalle(userId, range);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    clear();
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={600}>
            Pagos Programación
          </Typography>

          {/* Filtros de fecha */}
          <Paper sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                label="Fecha inicio"
                type="date"
                size="small"
                value={localRange.ini}
                onChange={(e) => setLocalRange((prev) => ({ ...prev, ini: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                disabled
              />
              <TextField
                label="Fecha fin"
                type="date"
                size="small"
                value={localRange.fin}
                onChange={(e) => setLocalRange((prev) => ({ ...prev, fin: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                disabled
              />
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                onClick={handleConsultar}
                disabled={loading}
              >
                Consultar
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refresh} disabled={loading}>
                Refrescar
              </Button>
            </Stack>
          </Paper>

          {/* Error */}
          {error && (
            <Alert severity="error">{error.message}</Alert>
          )}

          {/* Tabla principal */}
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="center">Items</TableCell>
                  <TableCell align="center">Detalle</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" py={3}>
                        Sin datos para el rango seleccionado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow key={row.UserId} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.FullName}</TableCell>
                      <TableCell align="center">
                        <Chip label={row.Detalles?.length ?? 0} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalle">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenDetalle(row.UserId, row.FullName)}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<PaymentIcon />}
                          onClick={() =>
                            navigate(
                              `/facturacion/pagos-programacion/pagar/${row.UserId}`,
                              { state: { ini: range.ini, fin: range.fin, fullName: row.FullName } }
                            )
                          }
                        >
                          Pagar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>

      {/* Modal de detalle */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Detalle — {selectedName}</Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {detalleError && <Alert severity="error" sx={{ mb: 2 }}>{detalleError.message}</Alert>}
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Subdivisión</TableCell>
                  <TableCell>Lote</TableCell>
                  <TableCell>Trabajo</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="center">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detalleLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((__, j) => (
                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !detalle || detalle.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary" py={2}>
                        Sin registros
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  detalle.map((item, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{item.SubName}</TableCell>
                      <TableCell>{item.Number}</TableCell>
                      <TableCell>{item.NAME}</TableCell>
                      <TableCell>{item.Company}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.IsTownHome ? 'TownHome' : 'Lote'}
                          size="small"
                          variant="outlined"
                          color={item.IsTownHome ? 'secondary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{item.InitialDate ? formatDate(item.InitialDate) : '—'}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.IsComplete ? 'Completado' : 'Pendiente'}
                          size="small"
                          color={item.IsComplete ? 'success' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
