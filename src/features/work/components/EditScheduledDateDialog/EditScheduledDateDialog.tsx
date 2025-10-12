import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Button,
  Stack,
  Box,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  CalendarToday,
  Info,
  CheckCircle
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import type { EditScheduledDateDialogProps } from './EditScheduledDateDialog.types';

export const EditScheduledDateDialog = ({
  open,
  work,
  onClose,
  onConfirm
}: EditScheduledDateDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-populate date picker with current work date when dialog opens
  useEffect(() => {
    if (open && work) {
      // Priorizar StartDate, luego ScheduledDate (que mapea a InitialDate)
      const startDate = work.StartDate || work.ScheduledDate;
      if (startDate) {
        // Convert YYYY-MM-DD string to Date object
        setSelectedDate(new Date(startDate));
      } else {
        // Default to today if no StartDate exists
        setSelectedDate(new Date());
      }
      setError(null);
    }
  }, [open, work]);

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate end date based on start date and days
  const calculateEndDate = (startDate: Date, days: number): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (days - 1));
    return endDate;
  };

  // Get calculated dates
  const getCalculatedDates = () => {
    if (!selectedDate || !work) return null;

    const days = work.Days || 1;
    const startDate = selectedDate;
    const endDate = calculateEndDate(startDate, days);

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      days
    };
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (!selectedDate || !work) return;

    const calculatedDates = getCalculatedDates();
    if (!calculatedDates) return;

    setLoading(true);
    setError(null);

    try {
      await onConfirm(calculatedDates.startDate, calculatedDates.endDate);
      // Reset state
      setSelectedDate(null);
    } catch (err: unknown) {
      console.error('❌ Error updating date:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la fecha';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset when dialog opens
  const handleClose = () => {
    setSelectedDate(null);
    setError(null);
    onClose();
  };

  if (!work) return null;

  const calculatedDates = getCalculatedDates();
  const days = work.Days || 1;

  return (
    <Dialog
      open={open}
      onClose={() => !loading && handleClose()}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Editar Fecha Programada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Selecciona la nueva fecha de inicio para esta tarea
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="medium" disabled={loading}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          {/* Work Information */}
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'grey.50', border: 1, borderColor: 'grey.200' }}>
            <Grid container spacing={2}>
              {/* Columna Izquierda */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box mb={1.5}>
                  <Typography variant="caption" color="text.secondary">
                    TRABAJO
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {work.WorkName || 'Sin nombre'}
                  </Typography>
                </Box>
                <Box mb={1.5}>
                  <Typography variant="caption" color="text.secondary">
                    LOTE
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {work.Number || 'N/A'}
                  </Typography>
                </Box>
                <Box mb={1.5}>
                  <Typography variant="caption" color="text.secondary">
                    DURACIÓN
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={`${days} día${days > 1 ? 's' : ''}`}
                      size="small"
                      color="info"
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Box>
                </Box>
                {work.SFQuantity && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      SQ FT
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {work.SFQuantity}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Columna Derecha */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box mb={1.5}>
                  <Typography variant="caption" color="text.secondary">
                    CLIENTE
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {work.ClientName || 'N/A'}
                  </Typography>
                </Box>
                {work.Colors && (
                  <Box mb={1.5}>
                    <Typography variant="caption" color="text.secondary">
                      COLORES
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {work.Colors}
                    </Typography>
                  </Box>
                )}
                {work.DoorDesc && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      DESCRIPCIÓN PUERTA
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {work.DoorDesc}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Nueva fecha de inicio"
              value={selectedDate}
              onChange={(newValue) => {
                if (newValue) {
                  // Convert to Date if it's a Dayjs object
                  const dateValue = newValue instanceof Date ? newValue : new Date(newValue.toString());
                  setSelectedDate(dateValue);
                  setError(null);
                }
              }}
              disabled={loading}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  size: isMobile ? 'medium' : 'small',
                  fullWidth: true
                }
              }}
            />
          </LocalizationProvider>

          {/* Calculated Dates Preview */}
          {calculatedDates && (
            <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'success.50', border: 1, borderColor: 'success.200' }}>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle color="success" sx={{ fontSize: { xs: 20, sm: 'small' } }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '0.875rem' } }}>
                    Fechas Calculadas
                  </Typography>
                </Stack>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    FECHA INICIAL
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(calculatedDates.startDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    FECHA FINAL
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(calculatedDates.endDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          {/* Info Alert */}
          {!selectedDate && (
            <Alert severity="info" icon={<Info />}>
              <Typography variant="body2">
                La fecha final se calculará automáticamente sumando {days} día{days > 1 ? 's' : ''} a la fecha inicial.
              </Typography>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, borderTop: 1, borderColor: 'divider' }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
          fullWidth={isMobile}
          sx={{ minHeight: { xs: 44, sm: 36 } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || loading}
          color="primary"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalendarToday />}
          fullWidth={isMobile}
          sx={{ minHeight: { xs: 44, sm: 36 } }}
        >
          {loading ? 'Guardando...' : 'Guardar Fecha'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
