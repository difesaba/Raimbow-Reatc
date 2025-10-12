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
  Avatar,
  Autocomplete,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Paper
} from '@mui/material';
import {
  Close,
  Person,
  Assignment,
  CheckCircle,
  Info,
  Business,
  CalendarToday
} from '@mui/icons-material';
import { UserService } from '../../../users/services/user.service';
import type { User } from '../../../users/interfaces/user.interfaces';
import type { AssignManagerDialogProps, Manager } from './AssignManagerDialog.types';

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

export const AssignManagerDialog = ({
  open,
  work,
  onClose,
  onConfirm
}: AssignManagerDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load managers when dialog opens
  useEffect(() => {
    if (open) {
      loadLeaders();
    } else {
      setSelectedManager(null);
      setError(null);
    }
  }, [open]);

  /**
   * Load leaders from the backend
   * Filters users with Leader === true
   */
  const loadLeaders = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📋 Loading leaders for work assignment...');
      const users = await UserService.getUsers();

      // Filter only users with Leader === true
      const leaders = users.filter(user => user.Leader === true);

      console.log(`✅ Found ${leaders.length} leaders out of ${users.length} total users`);

      // Map User interface to Manager interface
      const mappedManagers = leaders.map(mapUserToManager);

      setManagers(mappedManagers);

      // 🎯 Preseleccionar el manager actual si existe (para reasignación)
      if (work?.UserRainbow) {
        const currentManager = mappedManagers.find(manager => manager.id === work.UserRainbow);
        if (currentManager) {
          console.log('✅ Preseleccionando manager actual:', currentManager.name);
          setSelectedManager(currentManager);
        } else {
          console.warn('⚠️ Manager actual no encontrado en la lista de líderes. UserRainbow:', work.UserRainbow);
        }
      }
    } catch (err: unknown) {
      console.error('❌ Error loading leaders:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los líderes';
      setError(errorMessage);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (!selectedManager) return;

    setLoading(true);
    try {
      // ✅ Pasar objeto Manager completo para optimistic UI update
      await onConfirm(selectedManager);
    } finally {
      setLoading(false);
    }
  };

  if (!work) return null;

  const isReassignment = !!work.UserRainbow;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      {/* Header - Simplified */}
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {isReassignment ? 'Reasignar Manager' : 'Asignar Manager'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isReassignment
                ? 'Cambia el manager responsable de este trabajo'
                : 'Selecciona un manager para asignar este trabajo'
              }
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="medium" sx={{ alignSelf: 'flex-start' }}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Content - Responsive 2 Column Layout */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 3, sm: 4 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
        >
          {/* LEFT COLUMN: Work Details - Information */}
          <Box flex={{ xs: 1, md: 0.45 }}>
            <Stack spacing={3}>
              {/* Primary Information Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'primary.50',
                  border: 1,
                  borderColor: 'primary.100'
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Assignment color="primary" fontSize="medium" />
                    <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                      Información Principal
                    </Typography>
                  </Stack>

                  {/* Work Name - Emphasized */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      TRABAJO
                    </Typography>
                    <Typography variant="body1" fontWeight={600} mt={0.5}>
                      {work.WorkName || work.Obs || 'Sin descripción'}
                    </Typography>
                  </Box>

                  {/* Client - Emphasized */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      CLIENTE
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                      <Business fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight={600}>
                        {work.ClientName || `Cliente ${work.Sub || 'N/A'}`}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Date - Emphasized */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      FECHA PROGRAMADA
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                      <CalendarToday fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight={600}>
                        {work.ScheduledDate || 'Sin fecha programada'}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              {/* Secondary Information Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: 'grey.50',
                  border: 1,
                  borderColor: 'grey.200'
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={0.5}>
                    DETALLES ADICIONALES
                  </Typography>

                  {/* Lot Number */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Número de Lote
                    </Typography>
                    <Chip
                      label={work.Number || 'N/A'}
                      size="small"
                      variant="filled"
                      color="primary"
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Stack>

                  {/* Property Type */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Tipo de Propiedad
                    </Typography>
                    <Chip
                      label={work.Town === 1 ? 'Townhome' : 'Lote'}
                      size="small"
                      variant="outlined"
                      color={work.Town === 1 ? 'info' : 'default'}
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Stack>

                  {/* Work ID */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      ID de Tarea
                    </Typography>
                    <Chip
                      label={`#${work.TaskId || 'N/A'}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: { xs: 24, md: 20 } }}
                    />
                  </Stack>

                  {/* SQ FT */}
                  {work.SFQuantity && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        SQ FT
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {work.SFQuantity}
                      </Typography>
                    </Stack>
                  )}

                  {/* Colors */}
                  {work.Colors && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Colores
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {work.Colors}
                      </Typography>
                    </Stack>
                  )}

                  {/* Door Description */}
                  {work.DoorDesc && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Descripción Puerta
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {work.DoorDesc}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Box>

          {/* RIGHT COLUMN: Manager Selection - Action */}
          <Box flex={{ xs: 1, md: 0.55 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'primary.main',
                borderRadius: 2
              }}
            >
              <Stack spacing={3}>
                {/* Section Header */}
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Seleccionar Manager
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Busca y selecciona el manager que se encargará de este trabajo
                  </Typography>
                </Box>

                {/* Error State */}
                {error && (
                  <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}

                {/* Loading State */}
                {loading ? (
                  <Box display="flex" flexDirection="column" alignItems="center" py={6}>
                    <CircularProgress size={48} />
                    <Typography variant="body2" color="text.secondary" mt={2}>
                      Cargando managers disponibles...
                    </Typography>
                  </Box>
                ) : managers.length === 0 && !error ? (
                  /* Empty State */
                  <Alert severity="info" icon={<Info />}>
                    <Typography variant="body2">
                      No hay líderes disponibles para asignar. Verifica que existan usuarios con el campo "Leader" activado.
                    </Typography>
                  </Alert>
                ) : (
                  /* Manager Selection */
                  <>
                    <Autocomplete
                      value={selectedManager}
                      onChange={(_, newValue) => setSelectedManager(newValue)}
                      options={managers}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buscar manager"
                          placeholder="Escribe el nombre del manager..."
                          size="medium"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Person color="action" />
                                {params.InputProps.startAdornment}
                              </Stack>
                            )
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Stack direction="row" alignItems="center" spacing={2} width="100%" py={1}>
                            <Avatar sx={{
                              bgcolor: 'primary.main',
                              width: { xs: 48, md: 40 },
                              height: { xs: 48, md: 40 }
                            }}>
                              {option.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="body1" fontWeight={500}>
                                {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {option.email} • {option.department}
                              </Typography>
                            </Box>
                            <Chip
                              label={option.available ? 'Disponible' : 'Ocupado'}
                              size="small"
                              icon={option.available ? <CheckCircle fontSize="inherit" /> : undefined}
                              color={option.available ? "success" : "default"}
                              sx={{ height: { xs: 24, md: 20 } }}
                            />
                          </Stack>
                        </Box>
                      )}
                    />

                    {/* Selected Manager Preview */}
                    {selectedManager && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 1.5, md: 2 },
                          bgcolor: 'success.50',
                          border: 1,
                          borderColor: 'success.200'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{
                            bgcolor: 'success.main',
                            width: { xs: 56, md: 48 },
                            height: { xs: 56, md: 48 }
                          }}>
                            {selectedManager.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body2" color="text.secondary" fontSize={11}>
                              MANAGER SELECCIONADO
                            </Typography>
                            <Typography variant="body1" fontWeight={600} mt={0.5}>
                              {selectedManager.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedManager.email}
                            </Typography>
                          </Box>
                          <CheckCircle color="success" sx={{ fontSize: { xs: 28, md: 24 } }} />
                        </Stack>
                      </Paper>
                    )}
                  </>
                )}
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      {/* Actions - Improved accessibility */}
      <DialogActions sx={{ px: 3, py: 2.5, borderTop: 1, borderColor: 'divider' }}>
        <Button
          onClick={onClose}
          color="inherit"
          size="medium"
          sx={{ minWidth: 100 }}
        >
          Cerrar
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          size="medium"
          disabled={!selectedManager || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
          sx={{ minWidth: 140, minHeight: 42 }}
        >
          {loading ? 'Asignando...' : isReassignment ? 'Reasignar Manager' : 'Asignar Manager'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};