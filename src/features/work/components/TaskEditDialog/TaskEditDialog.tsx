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
  Autocomplete,
  TextField,
  Avatar,
  Chip,
  FormControlLabel,
  Switch,
  Divider,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close,
  Edit,
  Person,
  PersonAdd,
  CalendarToday,
  CheckCircle,
  Save,
  Business,
  Assignment
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { UserService } from '../../../users/services/user.service';
import type { User } from '../../../users/interfaces/user.interfaces';
import type { TaskEditDialogProps, Manager } from './TaskEditDialog.types';
import type { NotificationResult } from '../../interfaces/work.interfaces';

/**
 * Helper function to map User to Manager interface
 */
const mapUserToManager = (user: User): Manager => ({
  id: user.UserId,
  name: `${user.FirstName} ${user.LastName}`,
  email: user.Email,
  department: user.Company,
  available: user.Status === 1
});

export const TaskEditDialog = ({
  open,
  work,
  onClose,
  onConfirm
}: TaskEditDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Manager state
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Date state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [taskDurationDays, setTaskDurationDays] = useState<number>(0); // Duración de la tarea en días

  // Completed state
  const [completed, setCompleted] = useState(false);

  // Observations state
  const [observations, setObservations] = useState('');

  // Loading & Error state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notification state
  const [notificationResult, setNotificationResult] = useState<NotificationResult | null>(null);

  // Detect if this is first assignment or edit
  const isFirstAssignment = !work?.TaskId || work?.TaskId === 0;

  // Load managers when dialog opens
  useEffect(() => {
    if (open) {
      loadLeaders();
      initializeFormData();
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, work]);

  /**
   * Initialize form data from work prop
   */
  const initializeFormData = () => {
    if (!work) {
      console.log('🔍 initializeFormData: work is null/undefined');
      return;
    }

    console.log('🔍 initializeFormData: Inicializando con work:', {
      TaskId: work.TaskId,
      'StartDate (string)': work.StartDate,
      'StartDate type': typeof work.StartDate,
      'StartDate truthy': !!work.StartDate,
      'EndDate (string)': work.EndDate,
      'EndDate type': typeof work.EndDate,
      'EndDate truthy': !!work.EndDate,
      Completed: work.Completed,
      Obs: work.Obs,
      UserRainbow: work.UserRainbow
    });

    // Set dates - parsear sin conversión de zona horaria
    let parsedStart: Date | null = null;
    let parsedEnd: Date | null = null;

    if (work.StartDate && work.StartDate !== '') {
      try {
        // Extraer año, mes, día del formato ISO sin conversión de zona horaria
        const [datePart] = work.StartDate.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        parsedStart = new Date(year, month - 1, day); // mes - 1 porque JS usa 0-11

        console.log('📅 StartDate parseado (sin zona horaria):', {
          original: work.StartDate,
          extracted: { year, month, day },
          parsed: parsedStart.toLocaleDateString('es-ES'),
          isValid: !isNaN(parsedStart.getTime())
        });
        setStartDate(parsedStart);
      } catch (error) {
        console.error('❌ Error parsing StartDate:', error);
        setStartDate(null);
      }
    } else {
      console.log('⚠️ work.StartDate es null/undefined/vacío:', work.StartDate);
      setStartDate(null);
    }

    if (work.EndDate && work.EndDate !== '') {
      try {
        // Extraer año, mes, día del formato ISO sin conversión de zona horaria
        const [datePart] = work.EndDate.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        parsedEnd = new Date(year, month - 1, day); // mes - 1 porque JS usa 0-11

        console.log('📅 EndDate parseado (sin zona horaria):', {
          original: work.EndDate,
          extracted: { year, month, day },
          parsed: parsedEnd.toLocaleDateString('es-ES'),
          isValid: !isNaN(parsedEnd.getTime())
        });
        setEndDate(parsedEnd);
      } catch (error) {
        console.error('❌ Error parsing EndDate:', error);
        setEndDate(null);
      }
    } else {
      console.log('⚠️ work.EndDate es null/undefined/vacío:', work.EndDate);
      setEndDate(null);
    }

    // Calcular duración de la tarea en días
    if (parsedStart && parsedEnd) {
      const diffTime = parsedEnd.getTime() - parsedStart.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      const taskDuration = diffDays + 1; // +1 para incluir el día inicial
      setTaskDurationDays(taskDuration);
      console.log('⏱️ Duración de la tarea:', {
        startDate: parsedStart.toLocaleDateString('es-ES'),
        endDate: parsedEnd.toLocaleDateString('es-ES'),
        diffDays: diffDays,
        taskDuration: taskDuration,
        explanation: `Si inicio es ${parsedStart.toLocaleDateString('es-ES')} y fin es ${parsedEnd.toLocaleDateString('es-ES')}, la duración es ${taskDuration} día(s)`
      });
    } else if (work.Days) {
      // Fallback: usar el campo Days del work si existe
      setTaskDurationDays(work.Days);
      console.log('⏱️ Duración de la tarea (desde work.Days):', work.Days);
    }

    // Set completed state
    setCompleted(work.Completed || false);

    // Set observations
    setObservations(work.Obs || '');

    console.log('✅ initializeFormData completado');
  };

  /**
   * Load leaders from the backend
   */
  const loadLeaders = async () => {
    setLoadingManagers(true);
    setError(null);

    try {
      const users = await UserService.getUsers();
      const leaders = users.filter(user => user.Leader === true);
      const mappedManagers = leaders.map(mapUserToManager);
      setManagers(mappedManagers);

      // Preselect current manager if exists
      if (work?.UserRainbow) {
        const currentManager = mappedManagers.find(manager => manager.id === work.UserRainbow);
        if (currentManager) {
          setSelectedManager(currentManager);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los líderes';
      setError(errorMessage);
      setManagers([]);
    } finally {
      setLoadingManagers(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setSelectedManager(null);
    setStartDate(null);
    setEndDate(null);
    setCompleted(false);
    setObservations('');
    setError(null);
    setNotificationResult(null);
  };

  /**
   * Format date to YYYY-MM-DD
   */
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Validate form before saving
   */
  const validateForm = (): string | null => {
    if (!selectedManager) {
      return 'Debes seleccionar un manager';
    }

    // Only validate start date for edit mode (end date is read-only)
    if (!isFirstAssignment) {
      if (!startDate) {
        return 'Debes seleccionar una fecha de inicio';
      }
    }

    return null;
  };

  /**
   * Handle save
   */
  const handleSave = async () => {
    if (!work) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setNotificationResult(null);

    try {
      // For first assignment, dates and completed are optional
      const notification = await onConfirm({
        manager: selectedManager!,
        startDate: startDate ? formatDate(startDate) : '',
        endDate: endDate ? formatDate(endDate) : '',
        completed: isFirstAssignment ? false : completed,
        observations: observations
      });

      // Store notification result
      if (notification) {
        setNotificationResult(notification);
        console.log('📱 Notification received in dialog:', notification);
      }

      // Don't close dialog immediately if we have notifications to show
      // User can see the result and close manually
      if (!notification) {
        resetForm();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar los cambios';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    if (!saving) {
      resetForm();
      onClose();
    }
  };

  if (!work) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      {/* Header */}
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, px: { xs: 2, md: 3 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              {isFirstAssignment ? (
                <PersonAdd color="primary" fontSize="medium" />
              ) : (
                <Edit color="primary" fontSize="medium" />
              )}
              <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>
                {isFirstAssignment ? 'Asignar Tarea' : 'Editar Tarea'}
              </Typography>
            </Stack>
            <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary" mt={0.5}>
              {isFirstAssignment
                ? 'Selecciona el manager y revisa las fechas del proyecto que se guardarán'
                : 'Modifica el manager, fecha de inicio y estado de completado'
              }
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size={isMobile ? 'small' : 'medium'} disabled={saving}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}>
        <Stack spacing={{ xs: 2, md: 3 }}>
          {/* Información Básica - Readonly */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.5 },
              bgcolor: 'grey.50',
              border: 1,
              borderColor: 'grey.200'
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Assignment color="action" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                  INFORMACIÓN DE LA TAREA
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    TRABAJO
                  </Typography>
                  <Typography variant="body2" fontWeight={500} mt={0.5}>
                    {work.WorkName || 'Sin nombre'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    LOTE
                  </Typography>
                  <Typography variant="body2" fontWeight={500} mt={0.5}>
                    {work.Number || 'N/A'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    CLIENTE
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight={500}>
                      {work.ClientName || 'N/A'}
                    </Typography>
                  </Stack>
                </Grid>

                {work.TaskId && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      ID DE TAREA
                    </Typography>
                    <Box mt={0.5}>
                      <Chip
                        label={`#${work.TaskId}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Stack>
          </Paper>

          <Divider />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Notification Result Alert */}
          {notificationResult && (
            <Alert
              severity={notificationResult.totalFailed > 0 ? "warning" : "success"}
              onClose={() => setNotificationResult(null)}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Estado de las Notificaciones
              </Typography>

              {notificationResult.user && (
                <Typography variant="body2" gutterBottom>
                  <strong>Usuario:</strong> {notificationResult.user}
                  {notificationResult.phone && ` (${notificationResult.phone})`}
                </Typography>
              )}

              <Stack spacing={1} mt={1}>
                {/* WhatsApp Status */}
                <Box>
                  <Typography variant="body2" component="span">
                    {notificationResult.whatsapp.success ? '✅' : '❌'} <strong>WhatsApp:</strong>{' '}
                    {notificationResult.whatsapp.success
                      ? `Enviado exitosamente ${notificationResult.whatsapp.messageSid ? `(${notificationResult.whatsapp.messageSid})` : ''}`
                      : `Falló ${notificationResult.whatsapp.error ? `- ${notificationResult.whatsapp.error}` : ''}`
                    }
                  </Typography>
                </Box>

                {/* SMS Status */}
                <Box>
                  <Typography variant="body2" component="span">
                    {notificationResult.sms.success ? '✅' : '❌'} <strong>SMS:</strong>{' '}
                    {notificationResult.sms.success
                      ? `Enviado exitosamente ${notificationResult.sms.messageSid ? `(${notificationResult.sms.messageSid})` : ''}`
                      : `Falló ${notificationResult.sms.error ? `- ${notificationResult.sms.error}` : ''}`
                    }
                  </Typography>
                </Box>

                {/* Summary */}
                <Divider sx={{ my: 0.5 }} />
                <Typography variant="body2" fontWeight={500}>
                  <strong>Resumen:</strong> {notificationResult.totalSent} enviado{notificationResult.totalSent !== 1 ? 's' : ''}, {notificationResult.totalFailed} fallido{notificationResult.totalFailed !== 1 ? 's' : ''}
                </Typography>
              </Stack>
            </Alert>
          )}

          {/* Manager Selection */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Manager Asignado
            </Typography>

            {loadingManagers ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={32} />
              </Box>
            ) : managers.length === 0 ? (
              <Alert severity="info">
                No hay líderes disponibles para asignar
              </Alert>
            ) : (
              <Autocomplete
                value={selectedManager}
                onChange={(_, newValue) => {
                  setSelectedManager(newValue);
                  setError(null);
                }}
                options={managers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={saving}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar manager"
                    placeholder="Busca por nombre..."
                    size="medium"
                    required
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <Stack direction="row" alignItems="center" spacing={2} width="100%" py={0.5}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                          {option.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.email}
                          </Typography>
                        </Box>
                        {option.available && (
                          <Chip label="Disponible" size="small" color="success" variant="outlined" />
                        )}
                      </Stack>
                    </Box>
                  );
                }}
              />
            )}
          </Box>

          {/* Observations Field */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Observaciones
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observaciones relevantes..."
              disabled={saving}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Date Selection */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              <CalendarToday fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Fechas de Ejecución
              {isFirstAssignment ? (
                <Chip
                  label="Solo lectura"
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              ) : (
                <Chip
                  label="Fecha fin: Solo lectura"
                  size="small"
                  variant="outlined"
                  color="info"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Fecha de inicio"
                    value={startDate}
                    onChange={(newValue) => {
                      if (newValue && !isFirstAssignment) {
                        // Convert to Date if it's a Dayjs object
                        const dateValue = newValue instanceof Date ? newValue : new Date(newValue.toString());
                        setStartDate(dateValue);
                        setError(null);

                        // Recalcular fecha final: FechaFin = FechaInicio + (Duración - 1)
                        if (taskDurationDays > 0) {
                          const newEndDate = new Date(dateValue);
                          newEndDate.setDate(newEndDate.getDate() + (taskDurationDays - 1));
                          setEndDate(newEndDate);

                          console.log('🔄 Recalculando fecha final:', {
                            nuevaFechaInicio: dateValue.toLocaleDateString('es-ES'),
                            duracionDias: taskDurationDays,
                            diasASumar: taskDurationDays - 1,
                            nuevaFechaFin: newEndDate.toLocaleDateString('es-ES'),
                            ejemplo: `Si duración es ${taskDurationDays} día(s), se suma ${taskDurationDays - 1} día(s) a la fecha de inicio`
                          });
                        }
                      }
                    }}
                    disabled={saving || isFirstAssignment}
                    readOnly={isFirstAssignment}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        required: !isFirstAssignment,
                        helperText: isFirstAssignment ? 'Fecha del proyecto' : `Duración: ${taskDurationDays} día${taskDurationDays !== 1 ? 's' : ''}`
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Fecha de fin"
                    value={endDate}
                    onChange={() => {
                      // Fecha fin siempre de solo lectura (no editable)
                    }}
                    disabled={saving}
                    readOnly={true}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        helperText: isFirstAssignment ? 'Fecha del proyecto' : 'Calculada automáticamente'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>

          {/* Completed Switch - Only in Edit Mode */}
          {!isFirstAssignment && (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  bgcolor: completed ? 'success.50' : 'grey.50',
                  border: 1,
                  borderColor: completed ? 'success.200' : 'grey.200',
                  transition: 'all 0.3s ease'
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                  spacing={{ xs: 1.5, sm: 0 }}
                >
                  <Box flex={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CheckCircle color={completed ? 'success' : 'action'} fontSize="small" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Estado de la Tarea
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Marca como completada cuando el trabajo esté terminado
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                        disabled={saving}
                        color="success"
                      />
                    }
                    label={completed ? 'Completado' : 'Pendiente'}
                    labelPlacement="start"
                  />
                </Stack>
              </Paper>
            </Box>
          )}

          {/* Info Alerts */}
          {isFirstAssignment ? (
            <Alert severity="info">
              <Typography variant="body2">
                Las fechas mostradas corresponden al proyecto. Se guardarán automáticamente al asignar el manager.
              </Typography>
            </Alert>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                Al cambiar la <strong>fecha de inicio</strong>, la fecha de fin se recalcula automáticamente
                sumando <strong>{taskDurationDays} día{taskDurationDays !== 1 ? 's' : ''}</strong> de duración.
              </Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2.5 },
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving}
          color="inherit"
          size="medium"
          fullWidth={isMobile}
          sx={{ minHeight: { xs: '44px', md: 'auto' } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || loadingManagers}
          color="primary"
          variant="contained"
          size="medium"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : (isFirstAssignment ? <PersonAdd /> : <Save />)}
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: 'auto', md: 140 },
            minHeight: { xs: '44px', md: 'auto' }
          }}
        >
          {saving
            ? (isFirstAssignment ? 'Asignando...' : 'Guardando...')
            : (isFirstAssignment ? 'Asignar Tarea' : 'Guardar Cambios')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};
