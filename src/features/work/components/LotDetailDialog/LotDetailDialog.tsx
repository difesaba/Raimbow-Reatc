import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  List,
  ListItem,
  Divider,
  useMediaQuery,
  useTheme,
  Checkbox,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as ProgressIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { WorkService } from '../../services/work.service';
import type { LotDetailDialogProps } from './LotDetailDialog.types';
import type { LotDetail } from '../../interfaces/work.interfaces';

/**
 * 🔍 LotDetailDialog - Modal para mostrar detalles completos de un lote con tareas (Responsive)
 *
 * Vistas:
 * - Desktop (≥900px): Modal centrado con tabla
 * - Mobile (<900px): FullScreen con lista optimizada
 *
 * Estilo ADPRO: Header dentro del DialogContent
 */
export const LotDetailDialog: React.FC<LotDetailDialogProps> = ({
  open,
  lot,
  lotDetails,
  isLoading = false,
  onClose
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estado para loading de verificación por TaskId
  const [verifyLoading, setVerifyLoading] = useState<number | null>(null);

  // Estado local para manejar actualizaciones optimistas
  const [localLotDetails, setLocalLotDetails] = useState<LotDetail[] | null>(null);

  // Estado para notificación snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Sincronizar estado local con prop cuando cambie
  useEffect(() => {
    setLocalLotDetails(lotDetails);
  }, [lotDetails]);

  console.log('🎭 LotDetailDialog render - open:', open, 'lotDetails:', lotDetails, 'isLoading:', isLoading);

  if (!lot) {
    console.log('⚠️ LotDetailDialog: No lot provided, returning null');
    return null;
  }

  /**
   * 🔄 Handler para toggle verificación con actualización optimista
   */
  const handleVerifyToggle = async (detail: LotDetail) => {
    if (!detail.TaskId) {
      console.log('⚠️ Cannot verify: TaskId is missing');
      return;
    }

    setVerifyLoading(detail.TaskId);

    const newVerifyState = !(detail.Verify === 1 || detail.Verify === true);

    console.log('🔄 Toggling verify for TaskId:', detail.TaskId, 'New state:', newVerifyState);

    // 1️⃣ ACTUALIZACIÓN OPTIMISTA: Actualizar UI inmediatamente
    setLocalLotDetails(prev =>
      prev?.map(d =>
        d.TaskId === detail.TaskId
          ? { ...d, Verify: newVerifyState ? 1 : 0 }
          : d
      ) || null
    );

    try {
      // 2️⃣ Enviar actualización al backend
      await WorkService.updateWork({
        TaskId: detail.TaskId,
        StartDate: detail.StartDate || detail.InitialDate,
        EndDate: detail.EndDateTask || detail.EndDate,
        Completed: detail.Completed === 1 || detail.Completed === true,
        Verify: newVerifyState,
        Obs: detail.Obs || '',
        UserRainbow: detail.UserId || 0,
        User: 1 // TODO: Get from auth context
      });

      console.log('✅ Verify toggled successfully in backend');

      // ✅ MOSTRAR NOTIFICACIÓN DE ÉXITO
      setSnackbar({
        open: true,
        message: newVerifyState
          ? '✅ Registro verificado exitosamente'
          : 'Verificación removida',
        severity: 'success'
      });

    } catch (error) {
      console.error('❌ Error toggling verify, reverting...', error);

      // 3️⃣ REVERTIR: Si falla el backend, volver al estado original
      setLocalLotDetails(lotDetails);

      // ❌ MOSTRAR NOTIFICACIÓN DE ERROR
      setSnackbar({
        open: true,
        message: '❌ Error al verificar el registro',
        severity: 'error'
      });
    } finally {
      setVerifyLoading(null);
    }
  };

  /**
   * Formatear fecha de YYYY-MM-DD a DD/MM/YYYY
   */
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('es-ES');
  };

  /**
   * Obtener nombre del proceso desde Progress
   * Progress puede ser string (nombre del proceso) o number (porcentaje)
   * Si es string con formato "Nombre - Lote XX", extrae solo el nombre
   */
  const getProcessName = (progress: number | string | null | undefined): string => {
    console.log('🔍 DEBUG Progress value:', progress, 'Type:', typeof progress);

    // Manejar valores vacíos o undefined
    if (progress === null || progress === undefined || progress === '') {
      return 'Sin nombre de proceso';
    }

    // Si es string y no está vacío, procesarlo
    if (typeof progress === 'string' && progress.trim() !== '') {
      let processName = progress.trim();

      // Si Progress tiene formato "Nombre del Proceso - Lote XX", separarlo
      if (processName.includes(' - Lote ')) {
        const parts = processName.split(' - Lote ');
        processName = parts[0]; // Extraer solo el nombre del proceso
      }

      return processName;
    }

    // Si es número, mostrar como porcentaje
    if (typeof progress === 'number') {
      return `Progreso ${progress}%`;
    }

    return 'Sin nombre de proceso';
  };

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      maxWidth="xl"
      fullWidth
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      slotProps={{
        paper: {
          sx: {
            ...(!isMobile && { maxWidth: '1400px' })
          },
        },
      }}
    >
      <DialogContent
        sx={{
          padding: { xs: '16px', md: '24px 18px' },
          overflow: 'auto',
          ...(isMobile && { paddingBottom: '80px' }) // Espacio para el botón fijo en mobile
        }}
      >
        <Stack gap={2} justifyContent="flex-start">
          {/* Header Section - Estilo ADPRO */}
          <Stack
            direction="row"
            gap={1.5}
            justifyContent="flex-start"
            alignItems="center"
            alignSelf="stretch"
          >
            <HomeIcon
              color="primary"
              sx={{ fontSize: { xs: 32, md: 40 } }}
            />
            <Stack>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                sx={{ color: 'primary.main' }}
              >
                Lote {lot.Number} - {lot.Sub}
              </Typography>
              <Typography variant="caption">
                Subdivisión: {lot.Sub}
              </Typography>
              <Typography variant="caption">
                Tipo: {lot.IsTownHome ? 'Townhome' : 'Lote'}
              </Typography>
              {lot.SFQuantity && (
                <Typography variant="caption">
                  SQ FT: {lot.SFQuantity}
                </Typography>
              )}
              {lot.Colors && (
                <Typography variant="caption">
                  Colores: {lot.Colors}
                </Typography>
              )}
              {lot.DoorDesc && (
                <Typography variant="caption">
                  Descripción Puerta: {lot.DoorDesc}
                </Typography>
              )}
              {lot.StainDesc && (
                <Typography variant="caption">
                  Stain: {lot.StainDesc}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Divider />

          {/* Content Section */}
          {isLoading ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={300} />
            </Box>
          ) : !localLotDetails || localLotDetails.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={{ xs: 200, md: 400 }}
            >
              <Typography variant="body1" color="text.secondary">
                No se encontraron detalles para este lote
              </Typography>
            </Box>
          ) : (
            <>
              {/* Vista Mobile: Lista */}
              {isMobile ? (
                <List disablePadding>
                  {localLotDetails.map((detail, index) => {
                    // DEBUG: Ver todos los campos disponibles del detail
                    if (index === 0) {
                      console.log('📋 DEBUG Full detail object:', detail);
                      console.log('📋 Available fields:', Object.keys(detail));
                    }
                    return (
                    <Box key={detail.IdDet || index}>
                      <ListItem
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          backgroundColor: index % 2 === 0 ? 'background.paper' : 'action.hover',
                          padding: 2,
                          gap: 1.5
                        }}
                      >
                        {/* Header del item */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              {getProcessName(detail.Progress)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Lote: {detail.Number}
                            </Typography>
                          </Stack>
                          <Chip
                            label={detail.InvoiceId !== 0 ? 'Pagado' : 'Pendiente'}
                            color={detail.InvoiceId !== 0 ? 'success' : 'warning'}
                            size="small"
                          />
                        </Stack>

                        {/* Fechas */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Inicio:
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(detail.InitialDate)}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Fin:
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(detail.EndDate)}
                          </Typography>
                        </Stack>

                        {/* Progreso - solo mostrar si es número */}
                        {typeof detail.Progress === 'number' && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <ProgressIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              Progreso:
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="primary">
                              {detail.Progress}%
                            </Typography>
                          </Stack>
                        )}

                        {/* Días y Manager */}
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Días: <strong>{detail.Days || 0}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Manager: <strong>{detail.Manager || 'N/A'}</strong>
                          </Typography>
                        </Stack>

                        {/* Verificado */}
                        {detail.TaskId && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <VerifiedIcon
                              fontSize="small"
                              color={detail.Verify === true || detail.Verify === 1 ? "success" : "action"}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Verificado:
                            </Typography>
                            <Checkbox
                              checked={detail.Verify === true || detail.Verify === 1}
                              onChange={() => handleVerifyToggle(detail)}
                              disabled={verifyLoading === detail.TaskId}
                              color="success"
                              size="small"
                            />
                          </Stack>
                        )}
                      </ListItem>
                      {index < localLotDetails.length - 1 && <Divider />}
                    </Box>
                    );
                  })}
                </List>
              ) : (
                /* Vista Desktop: Tabla */
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Proceso
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Fecha Inicial
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Fecha Final
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Estado Pago
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Progreso
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Días
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Manager
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600
                          }}
                        >
                          Verificado
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {localLotDetails.map((detail, index) => {
                        // DEBUG: Ver todos los campos disponibles del detail (Desktop)
                        if (index === 0) {
                          console.log('🖥️ DEBUG Desktop Full detail object:', detail);
                          console.log('🖥️ Available fields:', Object.keys(detail));
                        }
                        return (
                        <TableRow
                          key={detail.IdDet || index}
                          hover
                          sx={{
                            '&:last-child td': { borderBottom: 0 },
                          }}
                        >
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" fontWeight={500}>
                                {getProcessName(detail.Progress)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Lote: {detail.Number}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(detail.InitialDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(detail.EndDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={detail.InvoiceId !== 0 ? 'Pagado' : 'Pendiente'}
                              color={detail.InvoiceId !== 0 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {typeof detail.Progress === 'number' ? (
                              <Typography variant="body2" fontWeight={500}>
                                {detail.Progress}%
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {detail.Days || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {detail.Manager || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {detail.TaskId ? (
                              <Checkbox
                                checked={detail.Verify === true || detail.Verify === 1}
                                onChange={() => handleVerifyToggle(detail)}
                                disabled={verifyLoading === detail.TaskId}
                                color="success"
                                size="small"
                              />
                            ) : (
                              <Typography variant="caption" color="text.disabled">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          ...(isMobile && {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            padding: 2,
            zIndex: 1
          })
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          startIcon={<CloseIcon />}
          disabled={isLoading}
          fullWidth={isMobile}
        >
          Cerrar
        </Button>
      </DialogActions>

      {/* Snackbar de Notificación */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
