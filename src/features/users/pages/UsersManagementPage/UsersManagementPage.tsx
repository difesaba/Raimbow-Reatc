import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Grid,
  Button,
  Skeleton,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useUsers } from '../../hooks/useUsers';
import { useUserFilters } from '../../hooks/useUserFilters';
import { UsersTable } from '../../components/UsersTable/UsersTable';
import { UsersFilters } from '../../components/UsersFilters/UsersFilters';
import { CreateUserModal } from '../../components/CreateUserModal';
import { EditUserModal } from '../../components/EditUserModal';
import { ChangePasswordModal } from '../../components/ChangePasswordModal';
import { DeleteUserDialog } from '../../components/DeleteUserDialog/DeleteUserDialog';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../../roles/services/role.service';
import type { User, CreateUserDTO, UpdateUserDTO } from '../../interfaces/user.interfaces';
import type { Role } from '../../../roles/models/role.model';

/**
 * Users Management Page
 * Main page for managing system users
 */
export const UsersManagementPage = () => {
  // Custom hooks
  const {
    users,
    loading,
    statistics,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const {
    searchTerm,
    statusFilter,
    roleFilter,
    filteredUsers,
    uniqueCompanies,
    handleSearchChange,
    handleStatusChange,
    handleRoleChange,
    resetFilters
  } = useUserFilters(users);

  // Dialog states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Roles state
  const [roles, setRoles] = useState<Role[]>([]);

  // Load statistics when data is available
  useEffect(() => {
    if (statistics.total > 0 && !statsLoaded) {
      setStatsLoaded(true);
    }
  }, [statistics.total, statsLoaded]);

  // Load roles from API
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await RoleService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error loading roles:', error);
        // Fallback to default roles if API fails
        setRoles([
          { RoleId: 1, RoleName: 'Administrador' },
          { RoleId: 2, RoleName: 'Usuario' }
        ]);
      }
    };
    loadRoles();
  }, []);

  // Handle new user button click
  const handleNewUser = () => {
    setCreateModalOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Handle change password
  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setChangePasswordModalOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle create user submission
  const handleCreateSubmit = async (data: CreateUserDTO) => {
    try {
      await createUser(data);
      setSnackbar({
        open: true,
        message: 'Usuario creado exitosamente',
        severity: 'success'
      });
      setCreateModalOpen(false);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al crear usuario',
        severity: 'error'
      });
      throw error;
    }
  };

  // Handle edit user submission
  const handleEditSubmit = async (data: UpdateUserDTO) => {
    try {
      await updateUser(selectedUser!.UserId, data);
      setSnackbar({
        open: true,
        message: 'Usuario actualizado exitosamente',
        severity: 'success'
      });
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al actualizar usuario',
        severity: 'error'
      });
      throw error;
    }
  };

  // Handle change password submission
  const handlePasswordChangeSubmit = async (passwordData: any) => {
    try {
      await UserService.changePassword(passwordData);
      setSnackbar({
        open: true,
        message: 'Contraseña actualizada exitosamente',
        severity: 'success'
      });
      setChangePasswordModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al cambiar contraseña',
        severity: 'error'
      });
      throw error;
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async (userId: number) => {
    try {
      await deleteUser(userId);
      setSnackbar({
        open: true,
        message: 'Usuario eliminado exitosamente',
        severity: 'success'
      });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al eliminar usuario',
        severity: 'error'
      });
      throw error;
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3} paddingY={3}>
        {/* Page Header */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h4" gutterBottom>
                Administración de Usuarios
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestiona los usuarios del sistema, sus roles y permisos
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={handleNewUser}
            >
              Nuevo Usuario
            </Button>
          </Stack>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  TOTAL DE USUARIOS
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color="primary">
                    {statistics.total}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  USUARIOS ACTIVOS
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color="success.main">
                    {statistics.active}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  USUARIOS INACTIVOS
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color="text.secondary">
                    {statistics.inactive}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0}>
              <Box padding={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  ADMINISTRADORES
                </Typography>
                {statsLoaded ? (
                  <Typography variant="h4" color="info.main">
                    {statistics.administrators}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={60} height={40} />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Content Paper */}
        <Paper elevation={0}>
          <Box>
            {/* Filters Section */}
            <UsersFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              roleFilter={roleFilter}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
              onReset={resetFilters}
              roles={roles}
              totalResults={filteredUsers.length}
            />

            <Divider />

            {/* Users Table */}
            <Box padding={3}>
              <UsersTable
                users={filteredUsers}
                loading={loading}
                roles={roles}
                onEdit={handleEditUser}
                onChangePassword={handleChangePassword}
                onDelete={handleDeleteUser}
              />
            </Box>
          </Box>
        </Paper>

        {/* Create User Modal */}
        <CreateUserModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
          roles={roles}
          companies={uniqueCompanies.map((c) => ({ CompanyId: c, CompanyName: c, Active: true }))}
        />

        {/* Edit User Modal */}
        <EditUserModal
          open={editModalOpen}
          user={selectedUser}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditSubmit}
          roles={roles}
          companies={uniqueCompanies.map((c) => ({ CompanyId: c, CompanyName: c, Active: true }))}
        />

        {/* Change Password Modal */}
        <ChangePasswordModal
          open={changePasswordModalOpen}
          user={selectedUser}
          onClose={() => {
            setChangePasswordModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handlePasswordChangeSubmit}
        />

        {/* Delete User Dialog */}
        <DeleteUserDialog
          open={deleteDialogOpen}
          user={selectedUser}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteConfirm}
        />

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
};