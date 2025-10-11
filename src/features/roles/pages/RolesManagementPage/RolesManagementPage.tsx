import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useRoles } from '../../hooks';
import { RolesTable, CreateRoleModal } from '../../components';

/**
 * 🎭 Página de gestión de roles del sistema
 * Página principal del feature de roles
 *
 * Features:
 * - ✅ Visualización de todos los roles
 * - ✅ Creación de nuevos roles
 * - ✅ Estadísticas en cards
 * - ✅ Manejo de estados: loading, error, empty
 * - ✅ Feedback visual de operaciones
 * - ✅ Actualización en tiempo real
 * - ✅ Responsive design
 */
export const RolesManagementPage: React.FC = () => {
  // ==================== HOOKS ====================

  const {
    roles,
    loading,
    error,
    statistics,
    refresh
  } = useRoles();

  // ==================== ESTADOS LOCALES ====================

  /** Estado para controlar el modal de creación */
  const [createModalOpen, setCreateModalOpen] = useState(false);

  /** Estado para mostrar notificaciones */
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // ==================== HANDLERS ====================

  /**
   * 🔄 Handler para refrescar roles
   */
  const handleRefresh = () => {
    refresh();
    setNotification({
      open: true,
      message: 'Actualizando lista de roles...',
      severity: 'info'
    });
  };

  /**
   * ✅ Handler para éxito al crear rol
   */
  const handleCreateSuccess = () => {
    setNotification({
      open: true,
      message: '✅ Rol creado exitosamente',
      severity: 'success'
    });
  };

  /**
   * 🚪 Handler para cerrar notificación
   */
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // ==================== RENDER ====================

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ==================== HEADER ==================== */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Gestión de Roles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Administra los roles y permisos del sistema ERP
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              Nuevo Rol
            </Button>
          </Box>
        </Box>

        <Divider />
      </Box>

      {/* ==================== ESTADÍSTICAS ==================== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total de Roles
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={56} />
              ) : (
                <Typography variant="h3" component="div" fontWeight="bold">
                  {statistics.total}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Roles Activos
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={56} />
              ) : (
                <Typography variant="h3" component="div" fontWeight="bold" color="success.main">
                  {statistics.active}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Roles Inactivos
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={56} />
              ) : (
                <Typography variant="h3" component="div" fontWeight="bold" color="error.main">
                  {statistics.inactive}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==================== ERROR ==================== */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => refresh()}>
          <Typography variant="body1" fontWeight="bold">
            Error al cargar roles
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {/* ==================== TABLA DE ROLES ==================== */}
      <Paper elevation={2}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Lista de Roles
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {loading
              ? 'Cargando roles...'
              : `${roles.length} ${roles.length === 1 ? 'rol encontrado' : 'roles encontrados'}`}
          </Typography>

          <RolesTable
            roles={roles}
            loading={loading}
            // Preparado para futuras features
            // onEdit={(role) => console.log('Edit', role)}
            // onDelete={(roleId) => console.log('Delete', roleId)}
            // onViewDetails={(role) => console.log('View', role)}
          />
        </Box>
      </Paper>

      {/* ==================== MODAL DE CREACIÓN ==================== */}
      <CreateRoleModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* ==================== NOTIFICACIONES ==================== */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
